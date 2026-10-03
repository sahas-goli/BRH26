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

## Benchmarks (1,000,000 replay events, 2026-10-03)

Tiger holds 1,000,000 `events` rows whose `bounty_id` is `r_*` (3,415 replay bounties), plus the earlier VERIFY E rows. The proof bounty is `r_0000`: it exists in `bounties`, with 2,291 events, 764 holders, and 236 `bounty_minute` buckets. `GET /api/graph/r_0000` returned 200 with 764 nodes and 763 edges (depths 0–8). `GET /api/graph/r_missing` returned 404. `GET /api/stats?bounty=r_0000` returned 200 (`holders` 764, `maxDepth` 8, 60 series buckets).

| Metric | Value | Notes |
|---|---|---|
| `bounty_minute` vs raw `GROUP BY time_bucket` | 0.334 ms vs 86.766 ms (260×) | `EXPLAIN ANALYZE` on `r_0000` after the closed chunk was compressed. The raw plan filtered `bounty_id = 'r_0000'` and the grouped query returns 236 buckets. |
| Compression ratio | 8.72× (78,495,744 → 9,003,008 bytes) | `hypertable_columnstore_stats('events')`: 1 of 2 chunks compressed. `compress_chunk` on `_hyper_1_4_chunk` (2026-09-24 to 2026-10-01), which was already older than the 1-day policy. The 2026-10-01 to 2026-10-08 chunk stays uncompressed. |
| Refresh lag (`now() - max(bucket)`) | −14,799.7 s | At 2026-10-03 21:04:20Z, `max(bucket)` was 2026-10-04 01:11:00Z because replay timestamps run ahead of the clock. Lag versus the newest event minute is 0 s. |

Earlier VERIFY E on `b_copy100k` (100,000 rows, 0.928 ms vs 85.574 ms) used a bounty id that is not this replay set. Those numbers are not the 1M result.

Set `FEATURED_BOUNTY=r_0000` so `/live` polls this cascade. Offline without Tiger: `bash sim/smoke_replay.sh` validates CSV headers; local MVP uses PGlite (`db/schema.local.sql`) and does not replace this track.

## What judges see

`/live` with `FEATURED_BOUNTY=r_0000`. Quote the three numbers above. Sweep cliff: `sim/out/sweep.json`.
