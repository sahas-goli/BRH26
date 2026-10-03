# Six Hops (BRH26)

Friend-to-friend bounties: post → forward → claim. Plan: [PLAN.md](PLAN.md). Workflow: [WORKFLOW.md](WORKFLOW.md). Living status: [PROGRESS.md](PROGRESS.md).

## Local software loop (no sponsor secrets)

```bash
npm --prefix web ci
npm --prefix web run check          # typecheck + lib + API tests (mock post/forward/claim)
npm --prefix web run smoke:mock     # mock MVP path only
node db/apply.mjs --dry-run         # schema extract / Tiger SSL plan (no DATABASE_URL)
# optional offline replay smoke (needs python3 + numpy):
# bash sim/smoke_replay.sh
```

Mock flags default off/mock (`.env.example`). `configureBounty` wires automatically when `DATABASE_URL` is set (`web/lib/bounty.ts` + `web/lib/db.ts`).

## Preview smoke (after Vercel deploy)

1. Open the preview URL for `main` (or your branch; `claim/*` branches are ignored by `vercel.json`).
2. `/post` → create a bounty (Gemini can stay off; edit hint fields).
3. Open the poster `/h/<token>` → forward to 1–3 labels → open a child link → `/claim/<token>` with an intro.
4. `/live` shows the seeded demo cascade until `DATABASE_URL` + `FEATURED_BOUNTY` point at Tiger.

Without Tiger, claim/confirm/stats/graph return `503` by design.

## Go/no-go E (Tiger) — human + `DATABASE_URL`

```bash
# 1. Create Tiger Cloud service; put URL in web/.env.local (never commit)
# 2. Apply schema + caggs + 1k smoke insert:
DATABASE_URL='postgres://…' node db/apply.mjs
# 3. Optional full replay load:
python3 sim/replay.py          # or --quick
bash sim/load.sh
# 4. Set FEATURED_BOUNTY=r_0000 (or a live bounty id) on Vercel; re-check /live
```

## Env checklist

Copy [`.env.example`](.env.example) → `web/.env.local` and `agent/.env.local`. See task [AL-01](tasks/AL-01.md).
