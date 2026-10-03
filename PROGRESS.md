# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 16:30 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| (earlier) | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` | S3-02 open until Tiger apply |
| (earlier) | `sim/replay.py`, `sim/load.sh`, `submission/tiger.md` | S3-03 open until Tiger load + benches |
| `65853ac` | Grok Voice `/talk` + three tools | S3-06 done (live mint still needs `XAI_API_KEY`) |
| `b52f7ea` | Grok ephemeral token + VERIFY G notes | S3-06a done (partial) |

## Plan changes

Software tasks have one owner, SWE. Anyone may claim any open SWE task. ALL stays. The hardware lane, `hardware/`, HOTP, and the venue badge game were removed. Claim is an introduction; poster confirm pays. `bounties.target_badge_id` remains an unused column.

## Local MVP evidence (no Tiger)

- `npm run smoke:mock` → PGlite lib path (`SMOKE_MVP_OK`)
- `npm run smoke:http` → real route handlers post→forward→claim→confirm→og (`SMOKE_HTTP_OK`)
- `next dev`: `DATABASE_URL=pglite:.data/local` in `web/.env.local` (see README)
- Tiger service `hldtuqlvht` is ready. Schema and caggs are applied. The real `DATABASE_URL` is in local `web/.env.local` only.

## Blocked / needs humans

- **S3-03:** schema, caggs, and VERIFY E are done on `hldtuqlvht` (100k COPY in 1.7 s, cagg 92x faster). Still need `bash sim/load.sh` for the 1M replay and the compression number.
- **Live preview MVP:** put the same `DATABASE_URL` in Vercel, plus `INTERNAL_SECRET` and `PUBLIC_BASE_URL`.
- **S2-06:** claimed by Sahas Goli (`claim/S2-06` since 16:20Z). Nessie live still failing VERIFY D — keep mock.
- **S3-07:** GoDaddy / MLH domain claim for `milgram.study`.
- **AL-01:** Photon, xAI, and Gemini keys are still missing. Solana, Nessie, and Tiger are set in local `web/.env.local`.
- **AL-02:** local smoke green; prod double-run still blocked on secrets.

## Also on main (demo readiness)

- `submission/*.md` track write-ups (PLAN §9/§13). Hardware is not a track.
- README phone LAN local test steps

## Claims (remote locks)

- `claim/S2-06` — Sahas Goli

## Next (humans)

1. Copy Tiger `DATABASE_URL` into Vercel, then load the replay (`bash sim/load.sh`).
2. Nessie (S2-06); Photon/xAI keys (AL-01). Domain registration stays S3-07. Name search is AL-06 (no purchase).

## Open tasks by env

Claim with `bash scripts/task.sh claim <ID>` from Git Bash, then `git switch -c swe/<ID> origin/main`. Hold at most 2 claims.

**Needs env (S)** — `web/.env.local`, API keys, or a logged-in Vercel/Tiger account. Do not send these to collaborators.

- AL-01, AL-02, AL-03, AL-04, S2-06, S3-03, S3-07

**No env (collaborators)** — public site and the repo only. Three parallel files, no shared edits.

- AL-05 brand/poster notes → `design/poster-direction.md`
- AL-06 domain shortlist (search only, do not buy) → `submission/domain-shortlist.md`
- AL-07 public-URL shot list → `submission/public-storyboard.md`
