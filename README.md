# Six Hops (BRH26)

Friend-to-friend bounties: post → forward → claim. Plan: [PLAN.md](PLAN.md). Workflow: [WORKFLOW.md](WORKFLOW.md). Living status: [PROGRESS.md](PROGRESS.md).

## Local software loop (no sponsor secrets)

```bash
npm --prefix web ci
npm --prefix web run check          # typecheck + lib + API tests
npm --prefix web run smoke:mock     # PGlite lib path: create → forward×3 → claim → confirm
npm --prefix web run smoke:http     # same via real route handlers (pages API surface)
npm --prefix web run smoke:unit     # in-memory fixture unit tests only
node db/apply.mjs --dry-run         # schema extract / Tiger SSL plan (no DATABASE_URL)
# optional offline replay smoke (needs python3 + numpy):
# bash sim/smoke_replay.sh
```

### Table demo: `/live` with real PGlite data (no Tiger)

One command to seed a branching cascade, then serve it:

```bash
npm --prefix web run seed:demo && npm --prefix web run dev
# open http://localhost:3000/live  (FEATURED_BOUNTY set by seed:demo)
```

`seed:demo` writes `web/.data/demo` (`DATABASE_URL=pglite:.data/demo`), writes `FEATURED_BOUNTY=<id>` into `web/.env.local` so `/live` loads that cascade (never overwrites a Postgres Tiger URL), and checks `/api/stats` + `/api/graph` before exit. Pitch: [submission/pitch-2min.md](submission/pitch-2min.md). Backup video: [submission/backup-video.md](submission/backup-video.md).

### Local `next dev` (no Tiger)

```bash
# web/.env.local (or use seed:demo above for a pre-filled cascade)
DATABASE_URL=pglite:.data/local
PUBLIC_BASE_URL=http://localhost:3000
PAYOUT_MODE=mock
NESSIE_MODE=mock
GROK_ENABLED=false
GEMINI_ENABLED=false
PHOTON_ENABLED=false

npm --prefix web run dev
# then /post → /h/<token> → forward → /claim/<token>
```

Tiger: `configureBounty` wires when `DATABASE_URL` is a Postgres URL. PGlite uses `db/schema.local.sql` + `ensureBountyDatabase()` on each API route. Production Tiger path is unchanged.

### Phone on the same Wi‑Fi (local UI smoke)

Most hops open on phones—test that before the venue:

1. Find your laptop LAN IP (e.g. `ipconfig` → `192.168.x.x`).
2. In `web/.env.local` set:
   ```bash
   DATABASE_URL=pglite:.data/local
   PUBLIC_BASE_URL=http://192.168.x.x:3000
   PAYOUT_MODE=mock
   ```
3. Start Next bound to all interfaces:
   ```bash
   npm --prefix web run dev -- --hostname 0.0.0.0 --port 3000
   ```
4. On the phone (same Wi‑Fi / disable VPN): open `http://192.168.x.x:3000/post`.
5. Create a bounty → open the poster hop link → forward to yourself (AirDrop/SMS the child `/h/…` URL) → `/claim/…` with an intro. The poster confirms before payment.

Allow Node through the OS firewall if the phone cannot connect. Prefer cellular later for Vercel preview (Cornell Wi‑Fi oddities).

API-only regression without a browser: `npm --prefix web run smoke:http`.

## Preview smoke (after Vercel deploy)

1. Open the preview URL for `main` (or your branch; `claim/*` branches are ignored by `vercel.json`).
2. `/post` → create a bounty (Gemini can stay off; edit hint fields).
3. Open the poster `/h/<token>` → forward to 1–3 labels → open a child link → `/claim/<token>` with an intro.
4. `/live` shows the seeded demo cascade until Tiger `DATABASE_URL` + `FEATURED_BOUNTY` are set.

With only PGlite locally, APIs work; Vercel preview still needs a real `DATABASE_URL` (Tiger) for serverful post/forward/claim.

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

## Write-ups

- Track notes: [submission/README.md](submission/README.md)
