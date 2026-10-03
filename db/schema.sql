-- db/schema.sql
CREATE TABLE IF NOT EXISTS bounties (
  id              TEXT PRIMARY KEY,            -- 'b_' + 8 random base62 chars
  poster_token    TEXT UNIQUE NOT NULL,        -- secret, 128-bit, lets the poster confirm
  hint            JSONB NOT NULL,              -- HintCard (visible attributes)
  hidden_hint     JSONB NOT NULL DEFAULT '[]', -- [{attr, value}] revealed one per "widen" step
  cap_cents       INT  NOT NULL CHECK (cap_cents >= 1000),
  bounty_cents    INT  NOT NULL,               -- current offer; starts at 60% of cap
  status          TEXT NOT NULL DEFAULT 'open',
  target_badge_id TEXT,                        -- venue game: claim needs this badge's HOTP code
  controller_step INT  NOT NULL DEFAULT 0,
  low_b_since     TIMESTAMPTZ,                 -- when b first dropped below 2 (controller)
  nessie_poster_acct TEXT, nessie_escrow_acct TEXT,
  og_png          BYTEA,                       -- Grok Imagine wanted card
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS holders (
  id              TEXT PRIMARY KEY,            -- 'h_' + 8 random base62
  bounty_id       TEXT NOT NULL REFERENCES bounties(id),
  token           TEXT UNIQUE NOT NULL,        -- 128-bit base64url, appears in /h/[token]
  parent_id       TEXT REFERENCES holders(id), -- NULL for the poster's root holder
  depth           INT  NOT NULL,               -- poster root = 0, first recipients = 1
  label           TEXT,                        -- what the sender called them ("my TA")
  handle          TEXT,                        -- iMessage handle if delivered via Photon
  salt            TEXT NOT NULL,               -- 16 random bytes hex, for the edge commitment
  rail            TEXT NOT NULL DEFAULT 'custodial',
  sol_address     TEXT,                        -- wallet rail, or custodial pubkey
  custodial_secret TEXT,                       -- devnet only; base58 secret key for custodial rail
  nessie_acct     TEXT,                        -- bank rail
  forwards        INT  NOT NULL DEFAULT 0,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at       TIMESTAMPTZ,
  nudged_at       TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS holders_bounty_id_idx ON holders (bounty_id);

CREATE TABLE IF NOT EXISTS payouts (
  bounty_id   TEXT NOT NULL REFERENCES bounties(id),
  holder_id   TEXT NOT NULL REFERENCES holders(id),
  role        TEXT NOT NULL,                   -- relay | finder | refund
  cents       INT  NOT NULL,
  rail        TEXT NOT NULL,
  tx_sig      TEXT,                            -- Solana signature (same for every SOL share of a bounty)
  nessie_transfer_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bounty_id, holder_id)           -- idempotency: a holder is paid at most once per bounty
);

-- Append-only event stream. Live and replay share one table.
-- Tiger Cloud preferred syntax first; db/apply.mjs falls back if WITH fails.
CREATE TABLE IF NOT EXISTS events (
  time       TIMESTAMPTZ NOT NULL,
  bounty_id  TEXT NOT NULL,
  holder_id  TEXT,
  parent_id  TEXT,
  depth      INT,
  kind       TEXT NOT NULL,                    -- EventKind
  latency_s  DOUBLE PRECISION,                 -- on 'forwarded': seconds since this holder received it
  source     TEXT NOT NULL DEFAULT 'live',     -- live | replay
  detail     JSONB
) WITH (tsdb.hypertable, tsdb.segmentby = 'bounty_id', tsdb.orderby = 'time DESC');
-- VERIFY (E): if the WITH syntax errors, use: SELECT create_hypertable('events', by_range('time'));
