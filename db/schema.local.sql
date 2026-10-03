-- Local / PGlite schema for MVP smoke (no Timescale hypertables).
-- Production Tiger path still uses schema.sql + caggs.sql via db/apply.mjs.
CREATE TABLE IF NOT EXISTS bounties (
  id              TEXT PRIMARY KEY,
  poster_token    TEXT UNIQUE NOT NULL,
  hint            JSONB NOT NULL,
  hidden_hint     JSONB NOT NULL DEFAULT '[]',
  cap_cents       INT  NOT NULL CHECK (cap_cents >= 1000),
  bounty_cents    INT  NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open',
  target_badge_id TEXT,
  controller_step INT  NOT NULL DEFAULT 0,
  low_b_since     TIMESTAMPTZ,
  nessie_poster_acct TEXT, nessie_escrow_acct TEXT,
  og_png          BYTEA,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS holders (
  id              TEXT PRIMARY KEY,
  bounty_id       TEXT NOT NULL REFERENCES bounties(id),
  token           TEXT UNIQUE NOT NULL,
  parent_id       TEXT REFERENCES holders(id),
  depth           INT  NOT NULL,
  label           TEXT,
  handle          TEXT,
  salt            TEXT NOT NULL,
  rail            TEXT NOT NULL DEFAULT 'custodial',
  sol_address     TEXT,
  custodial_secret TEXT,
  nessie_acct     TEXT,
  forwards        INT  NOT NULL DEFAULT 0,
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at       TIMESTAMPTZ,
  nudged_at       TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS holders_bounty_id_idx ON holders (bounty_id);

CREATE TABLE IF NOT EXISTS payouts (
  bounty_id   TEXT NOT NULL REFERENCES bounties(id),
  holder_id   TEXT NOT NULL REFERENCES holders(id),
  role        TEXT NOT NULL,
  cents       INT  NOT NULL,
  rail        TEXT NOT NULL,
  tx_sig      TEXT,
  nessie_transfer_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (bounty_id, holder_id)
);

CREATE TABLE IF NOT EXISTS events (
  time       TIMESTAMPTZ NOT NULL,
  bounty_id  TEXT NOT NULL,
  holder_id  TEXT,
  parent_id  TEXT,
  depth      INT,
  kind       TEXT NOT NULL,
  latency_s  DOUBLE PRECISION,
  source     TEXT NOT NULL DEFAULT 'live',
  detail     JSONB
);
CREATE INDEX IF NOT EXISTS events_bounty_time_idx ON events (bounty_id, time DESC);
