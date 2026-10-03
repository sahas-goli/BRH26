# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 14:05 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| `a51d8a0` | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` with VERIFY E fallbacks. | S3-02 still open until applied to Tiger. |
| `1744638` | `GET /api/stats` and `GET /api/graph/[id]`. | S3-04 done. |
| `6dc6003` | Full-screen `/live`: d3 cascade, b gauge, attack slider, series chart, explorer link, demo fallback. | S3-05 done. |
| `e9d059b` | `sim/replay.py` Kleinberg generator, `sim/load.sh`, `submission/tiger.md`. Local run wrote 1,000,000 events + 334k holders. | S3-03 open until loaded into Tiger and benchmarks filled. |

## Plan changes

Software tasks have one owner, SWE. Anyone may claim any open SWE task. HW stays HW. `scripts/task.sh list SWE1`, `SWE2`, or `SWE3` still lists that lane.

## This branch

S2-05 closeout. The devnet claim and the `/live` explorer link are already on main.

## Blocked

- S3-02 / S3-03: need `DATABASE_URL` to run `node db/apply.mjs` and `bash sim/load.sh`. On stock Postgres, `apply.mjs` stops at `create_hypertable` after the plain events table exists.
- Claim/confirm/stats/graph return 503 without `DATABASE_URL`.
- S2-06 cannot go live. Nessie balances do not move after a 201 transfer. `NESSIE_MODE` stays mock.
- S3-06a / S3-06: need `XAI_API_KEY`.
- S3-07: domain registration.
- `swe1/S1-02` still has bounty code with no PR.

## Claims

Selina holds S3-02 and S3-03. S2-06 stays claimed. S2-05 is done. S3-04 and S3-05 are done.

## Next

Paste Tiger `DATABASE_URL` into the environment, then: `node db/apply.mjs` → `bash sim/load.sh` → fill `submission/tiger.md` → point `FEATURED_BOUNTY` at an `r_####` replay id for `/live`. S2-06 stays on the mock.
