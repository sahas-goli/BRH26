# Tiger Data track

## Short description

Live and replay events share one Timescale hypertable. Continuous aggregates (`bounty_minute`, `bounty_hour`) drive the controller’s p75 latency and the `/live` cascade. A Kleinberg-lattice simulator can load ~1M `source=replay` rows for the Tiger write-up benchmarks.

## Why Tiger Data specifically

1. **Hypertable + caggs** match an append-only event stream with real-time dashboards — not a generic Postgres bolt-on.
2. **`percentile_agg` / rollup** (toolkit) feed controller maturity (p75 hop latency) when available; `db/apply.mjs` falls back if toolkit/columnstore APIs differ.
3. **Replay at scale.** `sim/replay.py` generates ~1M events for compression / cagg-vs-raw numbers on the submission form.
4. **Same schema for live game + synthetic** (`source` column), so `/live` can show overnight hops beside the replay.

## Where in the code

| Piece | Path |
|---|---|
| Schema / caggs | `db/schema.sql`, `db/caggs.sql` |
| Apply + VERIFY E fallbacks | `db/apply.mjs`, `node db/apply.mjs --dry-run` |
| Stats / graph | `web/lib/stats.ts`, `GET /api/stats`, `GET /api/graph/[id]` |
| Simulator | `sim/replay.py`, `sim/load.sh`, `sim/smoke_replay.sh` |
| UI | `web/app/live/` |

## Benchmarks (fill after Tiger apply)

| Metric | Value | Notes |
|---|---|---|
| `bounty_minute` vs raw scan (ms) | 0.928 vs 85.574 (92x) | `EXPLAIN ANALYZE` on `b_copy100k`, 100,000 copied rows |
| Compression ratio | _pending_ | chunks are newer than the 1-day columnstore policy, so before/after bytes are empty |
| Refresh lag (`now() - max(bucket)`) | 62.5 s | after refresh; matches the 1-minute cagg end offset |

Offline without Tiger: `bash sim/smoke_replay.sh` validates CSV headers; local MVP uses PGlite (`db/schema.local.sql`) and does not replace this track.

## What judges see

`/live` with `FEATURED_BOUNTY` pointing at a live or `r_####` replay id; quote the three benchmark numbers once filled. Sweep cliff: `sim/out/sweep.json`.
