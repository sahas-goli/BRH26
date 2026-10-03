# Software track

## Short description

Six Hops is a typed, mockable full-stack product: friend-to-friend bounties with a Babaioff-style split, fan-out ≤ 3, depth ≤ 8, a stall controller, and an end-to-end post→forward→claim path that stays green without sponsor keys (PGlite local + mock payout).

## Why Software specifically

1. **Incentive correctness is tested.** `web/lib/split.ts` + `web/lib/split.test.ts` encode the published sixteenths and prove MIT-style fake-hop gains vs our zero finder gain.
2. **Contracts, not vibes.** Shared `web/lib/types.ts` and `db/schema.sql` are the source of truth; WORKFLOW forbids silent contract edits.
3. **Never blocked on sponsors.** Flags (`PAYOUT_MODE`, `NESSIE_MODE`, `PHOTON_ENABLED`, `GROK_ENABLED`, `GEMINI_ENABLED`) default mock/off; `npm run smoke:mock` / `smoke:http` exercise create→forward×3→claim→confirm against real SQL (PGlite).
4. **Parallel-safe engineering.** One software lane (`owner: SWE`), claim locks via `claim/<ID>`, rebase merges — four agents can ship without stepping on each other.

## Where in the code

| Piece | Path |
|---|---|
| Split + attack comparison | `web/lib/split.ts`, `web/app/api/attack/` |
| Bounty core | `web/lib/bounty.ts`, `POST /api/bounties`, `/api/forward`, `/api/h/[token]` |
| Claim / pay | `web/lib/payout.ts`, `POST /api/claim`, `/api/bounties/[id]/confirm` |
| Controller | `web/lib/controller.ts`, `POST /api/controller/tick` |
| Local MVP DB | `db/schema.local.sql`, `web/lib/pglite-db.ts`, `web/scripts/smoke-*.ts` |
| Live board | `web/app/live/` |

## What judges see

- Terminal: `npm --prefix web run check` (includes split + lifecycle tests).
- Phone: `/post` → hop → claim (README LAN steps) or Vercel preview once Tiger is wired.
- `/live` attack slider: MIT +50/75/88/94% vs ours +0%.
