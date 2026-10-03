# Tiger Data write-up notes

## Replay

- Generator: `sim/replay.py` (Kleinberg 1000×1000 lattice, greedy fan-out ≤ 3, attrition U(0.2,0.6)).
- Offline smoke (no Tiger): `bash sim/smoke_replay.sh` (`replay.py --quick` + CSV header checks).
- Outputs: `sim/out/replay.csv` (~1M `events` rows, `source=replay`), plus bounties/holders CSVs and `sim/out/sweep.json`.
- Load: `node db/apply.mjs`, then `bash sim/load.sh`.

## Benchmarks (fill after load)

| Metric | Value | Notes |
|---|---|---|
| `bounty_minute` vs raw `time_bucket` (ms) | _pending DATABASE_URL_ | `EXPLAIN ANALYZE` on the same bounty |
| Compression ratio | _pending_ | `hypertable_columnstore_stats('events')` or compression stats |
| Refresh lag (`now() - max(bucket)`) | _pending_ | After `refresh_continuous_aggregate` |

## Sweep

See `sim/out/sweep.json` for success rate vs attrition and vs fan-out (b ≈ 2 cliff).
