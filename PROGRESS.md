# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 14:00 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| `a51d8a0` | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` with VERIFY E fallbacks. | S3-02 still open until applied to Tiger. |
| `1744638` | `GET /api/stats` and `GET /api/graph/[id]`. | S3-04 done. |
| `6dc6003` | Full-screen `/live`: d3 cascade, b gauge, attack slider, series chart, explorer link, demo fallback. | S3-05 done. |
| `e9d059b` | `sim/replay.py` Kleinberg generator, `sim/load.sh`, `submission/tiger.md`. Local run wrote 1,000,000 events + 334k holders. | S3-03 open until loaded into Tiger and benchmarks filled. |

## This branch

Progress note only.

## Blocked

- S3-02 / S3-03: need `DATABASE_URL` to run `node db/apply.mjs` and `bash sim/load.sh`.
- Claim/confirm/stats/graph return 503 without `DATABASE_URL`.
- S3-06a / S3-06: need `XAI_API_KEY`.
- S3-07: domain registration.
- `swe1/S1-02` still has bounty code with no PR.

## Claims

SWE3 (Selina) holds S3-02 and S3-03. S3-04 and S3-05 are done.

## Next

Paste Tiger `DATABASE_URL` into the environment, then: `node db/apply.mjs` → `bash sim/load.sh` → fill `submission/tiger.md` → point `FEATURED_BOUNTY` at an `r_####` replay id for `/live`.
