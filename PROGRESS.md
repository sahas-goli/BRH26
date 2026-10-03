# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 15:20 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| (earlier) | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` | S3-02 open until Tiger apply |
| (earlier) | `sim/replay.py`, `sim/load.sh`, `submission/tiger.md` | S3-03 open until Tiger load + benches |
| `65853ac` | Grok Voice `/talk` + three tools | S3-06 done (live mint still needs `XAI_API_KEY`) |
| `b52f7ea` | Grok ephemeral token + VERIFY G notes | S3-06a done (partial) |

## Plan changes

Software tasks have one owner, SWE. Anyone may claim any open SWE task. HW stays HW.

## Local MVP evidence (no Tiger)

`npm --prefix web run smoke:mock` → PGlite create→forward×3→claim→confirm (`SMOKE_MVP_OK`). Set `DATABASE_URL=pglite` for local Next.

## Blocked / needs humans

- **S3-02 / S3-03:** need Tiger `DATABASE_URL`. Offline: `node db/apply.mjs --dry-run`, `bash sim/smoke_replay.sh`.
- **Live preview MVP:** Vercel env with Tiger `DATABASE_URL` (or accept pglite only locally). Also `INTERNAL_SECRET`, `PUBLIC_BASE_URL`.
- **S2-06:** claimed by Sahas Goli (`claim/S2-06` since 16:20Z). Nessie live still failing VERIFY D — keep mock.
- **S3-07:** GoDaddy / MLH domain claim for `milgram.study`.
- **AL-01:** no `web/.env.local` on this workstation — see checklist in `tasks/AL-01.md`.
- **AL-02:** local smoke green; prod double-run still blocked on secrets.

## Claims (remote locks)

- `claim/S2-06` — Sahas Goli
- `claim/AL-02` — haydenmfu (local smoke; leave open until prod demo)

## Next

1. Paste Tiger `DATABASE_URL` → `node db/apply.mjs` → preview post→forward→claim.
2. Or run local Next with `DATABASE_URL=pglite` for UI smoke.
3. S2-06 stays mock until Nessie transfers move balances.
