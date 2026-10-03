#!/usr/bin/env bash
# Load sim/out CSV files into Tiger after db/apply.mjs.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/sim/out"
: "${DATABASE_URL:?DATABASE_URL is required}"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<SQL
\copy bounties (id, poster_token, hint, hidden_hint, cap_cents, bounty_cents, status, controller_step, expires_at) FROM '$OUT/replay_bounties.csv' CSV HEADER
\copy holders (id, bounty_id, token, parent_id, depth, label, salt, forwards, received_at) FROM '$OUT/replay_holders.csv' CSV HEADER
\copy events (time, bounty_id, holder_id, parent_id, depth, kind, latency_s, source, detail) FROM '$OUT/replay_events.csv' CSV HEADER
CALL refresh_continuous_aggregate('bounty_minute', NULL, NULL);
SQL

echo "loaded replay CSVs from $OUT"
