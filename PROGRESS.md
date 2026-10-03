# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Collaborators with no `web/.env.local` take exactly one of AL-06, AL-08, AL-09, AL-10, AL-11. One person per task. Claim with `bash scripts/task.sh claim <ID>`, then `git switch -c swe/<ID> origin/main`.

Do not claim AL-01, AL-02, AL-03, AL-04, S2-06, S3-03, or S3-07. Those need secrets or are already held. AL-01 needs `DATABASE_URL` and `INTERNAL_SECRET` and stays with S. Do not ask S for those secrets. AL-05 and AL-07 are done.

AL-06 is the domain shortlist (search only, do not buy, ignore `.study`). AL-08 is the judging slide outline. AL-09 is the People's Choice share copy (do not post it). AL-10 is the Cursor transcript export notes. AL-11 is the team registration form check (no personal data in git). AL-05 was the poster. AL-07 was the public-site storyboard. Public site: https://brh26-brh-26.vercel.app.

S2-06 is Hayden's Nessie task. Leave it.

Updated 2026-10-03 17:35 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| (earlier) | `db/schema.sql`, `db/caggs.sql`, `db/apply.mjs` | S3-02 open until Tiger apply |
| (this PR) | 1M replay proof: `/api/graph/r_0000`, benchmarks in `submission/tiger.md` | S3-03 done |
| `65853ac` | Grok Voice `/talk` + three tools | S3-06 done (live mint still needs `XAI_API_KEY`) |
| `b52f7ea` | Grok ephemeral token + VERIFY G notes | S3-06a done (partial) |

## Plan changes

Software tasks have one owner, SWE. Which task to claim is at the top of this file. The hardware lane, `hardware/`, HOTP, and the venue badge game were removed. Claim is an introduction; poster confirm pays. `bounties.target_badge_id` remains an unused column.

## Local MVP evidence (no Tiger)

- `npm run smoke:mock` → PGlite lib path (`SMOKE_MVP_OK`)
- `npm run smoke:http` → real route handlers post→forward→claim→confirm→og (`SMOKE_HTTP_OK`)
- `next dev`: `DATABASE_URL=pglite:.data/local` in `web/.env.local` (see README)
- Tiger service `hldtuqlvht` is ready. Schema and caggs are applied. The real `DATABASE_URL` is in local `web/.env.local` only.

## Blocked / needs humans

- **Live preview MVP:** put the same `DATABASE_URL` in Vercel, plus `INTERNAL_SECRET` and `PUBLIC_BASE_URL`. `FEATURED_BOUNTY=r_0000` makes `/live` open on the replay cascade.
- **S2-06:** claimed by Hayden (`claim/S2-06`, haydenmfu, since 2026-10-03T20:45Z). Nessie live still failing VERIFY D — keep mock. Leave it.
- **S3-07:** GoDaddy / MLH domain claim for `milgram.study`.
- **AL-01:** Photon, xAI, and Gemini keys are still missing. Solana, Nessie, and Tiger are set in local `web/.env.local`.
- **AL-02:** local smoke green; prod double-run still blocked on secrets.

## Also on main (demo readiness)

- `submission/*.md` track write-ups (PLAN §9/§13). Hardware is not a track.
- README phone LAN local test steps

## Claims (remote locks)

- `claim/S2-06` — Hayden (haydenmfu), since 2026-10-03T20:45Z. Leave it.
- AL-05 done (poster). AL-07 done (storyboard). Do not claim them.
- AL-06, AL-08, AL-09, AL-10, AL-11 — unclaimed. One collaborator each.
- AL-01, AL-02, AL-03, AL-04, S3-07 — unclaimed locks, but they stay with S. Do not claim them without `web/.env.local`.

## Next (humans)

1. Set Vercel `FEATURED_BOUNTY=r_0000` if `/live` should open on the replay cascade.
2. Nessie (S2-06); Photon/xAI keys (AL-01). Domain registration stays S3-07. Name search is AL-06 (no purchase).

## Open tasks by env

Collaborators with no `web/.env.local` claim exactly one of the tasks below. One person per task. `bash scripts/task.sh claim <ID>` from Git Bash, then `git switch -c swe/<ID> origin/main`.

**Needs env** — `web/.env.local`, API keys, or a logged-in Vercel/Tiger account. Do not send these to collaborators. Do not claim them.

- AL-01, AL-02, AL-03, AL-04, S3-07 stay with S. S2-06 is Hayden's. Leave it.

**No env (collaborators)** — public site and the repo only. Separate files, no shared edits. One person per task.

- AL-05 poster is done (`design/poster-direction.md`). Do not claim it.
- AL-06 domain shortlist (search only, do not buy) → `submission/domain-shortlist.md`
- AL-07 storyboard is done (`submission/public-storyboard.md`). Do not claim it.
- AL-08 judging slide outline → `submission/slides.md`
- AL-09 People's Choice share copy (do not post) → `submission/peoples-choice-share.md`
- AL-10 Cursor transcript export notes → `cursor-transcripts/README.md`
- AL-11 team registration form check (no personal data) → `submission/team-form.md`
