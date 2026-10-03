# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 15:30 ET.

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

- `npm run smoke:mock` → PGlite lib path (`SMOKE_MVP_OK`)
- `npm run smoke:http` → real route handlers post→forward→claim→confirm→og (`SMOKE_HTTP_OK`)
- `next dev`: `DATABASE_URL=pglite:.data/local` in `web/.env.local` (see README)
- `web/lib/hotp.ts` RFC vectors + claim wiring (HW-02 software; firmware still open)

## Blocked / needs humans

- **S3-02 / S3-03:** need Tiger `DATABASE_URL`. Offline: `node db/apply.mjs --dry-run`, `bash sim/smoke_replay.sh`.
- **Live preview MVP:** Vercel env with Tiger `DATABASE_URL` (or accept pglite only locally). Also `INTERNAL_SECRET`, `PUBLIC_BASE_URL`.
- **S2-06:** claimed by Sahas Goli (`claim/S2-06` since 16:20Z). Nessie live still failing VERIFY D — keep mock.
- **S3-07:** GoDaddy / MLH domain claim for `milgram.study`.
- **AL-01:** no `web/.env.local` on this workstation — see checklist in `tasks/AL-01.md`.
- **AL-02:** local smoke green; prod double-run still blocked on secrets.

## Also on main (demo readiness)

- `hardware/INVENTORY.md`, `hardware/game.md`, `hardware/bridge.py` (stats → `B x.xx`)
- `submission/*.md` track stubs (PLAN §9/§13)
- README phone LAN local test steps

## Claims (remote locks)

- `claim/S2-06` — Sahas Goli
- HW-01 / HW-05 claims released after scaffold merge (physical work still open)

## Next (humans)

1. Tiger `DATABASE_URL` → apply → Vercel preview MVP.
2. MLH table: fill `hardware/INVENTORY.md` + flash one badge (HW-01).
3. Organizer approval + 5 volunteers in `hardware/game.md` (HW-03).
4. GoDaddy domain (S3-07); Nessie (S2-06); Photon/xAI keys (AL-01).
