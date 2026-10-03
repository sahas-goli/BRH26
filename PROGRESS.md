# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 15:10 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| (earlier) | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` | S3-02 open until Tiger apply |
| (earlier) | `sim/replay.py`, `sim/load.sh`, `submission/tiger.md` | S3-03 open until Tiger load + benches |
| `65853ac` | Grok Voice `/talk` + three tools | S3-06 done (live mint still needs `XAI_API_KEY`) |
| `b52f7ea` | Grok ephemeral token + VERIFY G notes | S3-06a done (partial) |

## Plan changes

Software tasks have one owner, SWE. Anyone may claim any open SWE task. HW stays HW.

## Blocked / needs humans

- **S3-02 / S3-03:** need Tiger `DATABASE_URL`. Offline: `node db/apply.mjs --dry-run`, `bash sim/smoke_replay.sh`.
- **Live MVP on preview:** Vercel env with at least `DATABASE_URL`, `INTERNAL_SECRET`, `PUBLIC_BASE_URL`. Mock UI works without Tiger; claim/stats/graph are 503 until DB is set.
- **S2-06:** claimed by Sahas Goli (`claim/S2-06` since 16:20Z). Nessie live still failing VERIFY D — keep mock.
- **S3-07:** GoDaddy / MLH domain claim for `milgram.study`.
- **AL-01:** no `web/.env.local` on this workstation — see checklist in `tasks/AL-01.md`.

## Claims (remote locks)

- `claim/S2-06` — Sahas Goli (since 16:20Z; not stale yet under the 3 h rule)
- S3-02 / S3-03 locks released after harness merge so whoever has `DATABASE_URL` can reclaim

## Next

1. Paste Tiger `DATABASE_URL` → `node db/apply.mjs` → `bash sim/load.sh` → fill `submission/tiger.md`.
2. Set Vercel env → preview post→forward→claim smoke (README).
3. S2-06 stays mock until Nessie transfers move balances.
