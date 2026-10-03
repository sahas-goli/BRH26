# Devpost draft (Six Hops)

Paste into Devpost after team review. Grounded in what is on `main` as of this draft; do not claim live Tiger, Photon, GoDaddy, or Nessie transfers until those go/no-gos pass. PLAN demo script: §12; checklist: §13.

## Inspiration

Jon Kleinberg’s navigability results say strangers can find each other with **local knowledge alone** — the person you need is often a few hops into someone’s private contacts. Stanley Milgram’s small-world letters made that intuition famous; modern apps either ignore incentives or demand a central copy of everyone’s graph. We wanted the chain to **pay correctly**, so people would actually forward, without building LinkedIn.

## What it does

**Six Hops** is a friend-to-friend bounty game:

1. A poster describes a target with **attributes only** (city-level places, no street names) and posts a capped bounty.
2. Holders forward to 1–3 people they think are closer (depth capped at 8).
3. The target claims with an opt-in intro. The poster confirms before payment.
4. The winning chain is paid under a **Babaioff-style split** (published sixteenths); the finder cannot profit from inventing fake hops.
5. A stall **controller** widens hints when branching factor `b` collapses; `/live` shows cascades, `b`, and an attack comparison (MIT-style fake-hop gains vs ours at +0%).

Rails: Solana atomic multi-payee payout (devnet or mock), optional Nessie escrow (mock until VERIFY D), optional Photon iMessage agent for registered numbers.

## How we built it

| Layer | What | Where |
|---|---|---|
| Web app | Next.js typed APIs + mobile pages | `web/app/`, `web/lib/bounty.ts`, `web/lib/types.ts` |
| Incentives | Split + attack endpoint | `web/lib/split.ts`, `web/app/api/attack/` |
| Payout | Mock or Solana System transfers + memos | `web/lib/payout.ts`, `web/lib/solana.ts` |
| Bank rail | Nessie client (mock default) | `web/lib/nessie.ts` |
| Live board | d3 cascade, branching factor, controller UI | `web/app/live/` |
| Agent | Spectrum / Photon flows + privacy rules | `agent/src/` |
| Voice / Imagine | Grok token route + OG cards | `web/app/talk/`, `web/app/api/og/`, `web/lib/imagine.ts` |
| Hints | Gemini structured HintCard (optional) | `web/lib/hintcard.ts` |
| Local MVP | PGlite schema + smokes (no Tiger required) | `db/schema.local.sql`, `web/scripts/smoke-*.ts` |
| Process | Claim locks, one SWE lane, Cursor trailers | `WORKFLOW.md` |

## Challenges we ran into

- **Sponsor sandboxes disagree with docs.** Nessie VERIFY D: transfers return success-shaped responses but balances do not move — we stayed on `NESSIE_MODE=mock` rather than fake a live bank demo.
- **Secrets vs parallel agents.** Tiger `DATABASE_URL`, Spectrum, xAI, and domain DNS are shared human steps; we kept the product green with PGlite + mock flags so software never blocked on keys.
- **Privacy in iMessage.** Agent replies must never leak chain members or other handles — enforced in `agent/src/privacy.ts`, not left to an LLM.
- **Cornell network.** Plain HTTP to Nessie resets; Photon agent needs outbound-only + tunnel for `/send`.

## Accomplishments that we're proud of

- End-to-end **post → forward → claim → confirm** against real SQL locally (`npm run smoke:mock` / `smoke:http`).
- **Incentive tests**: split unit tests plus `/api/attack` showing MIT fake-hop gains vs our zero finder gain.
- **Solana path measured** on devnet (multi-instruction payout + `sixhops:pay:…` memo; signatures in PLAN §7.2) with safe `PAYOUT_MODE=mock` for the overnight game.
- **Full `/live` demo surface**: cascade, branching factor, controller steps, attack slider — usable without every sponsor live.
- **Parallel engineering**: four people/agents via `scripts/task.sh` claim branches and rebase merges; Cursor `Co-authored-by` trailers for SpaceX evidence.

## What we learned

- Mock flags and a local DB are not shortcuts — they are how you ship a multi-sponsor hackathon without lying about go/no-gos.
- Small-world products fail on **trust and inbox**, not graph algorithms; Photon registered numbers + personal `/h` links beat “install our app.”
- Correct splits are a product feature: judges understand the attack slider faster than a theorem statement.

## What's next

1. Wire Tiger (`DATABASE_URL`) → schema/caggs → Vercel preview MVP; load replay benches.
2. Claim **milgram.study** (GoDaddy Registry), set `PUBLIC_BASE_URL`.
3. Live Photon go/no-go (registered forward + nudge + paid) and Grok mint + Imagine once keys land.
4. Re-run Nessie when a transfer shape that moves balances is confirmed.
5. People’s Choice push after the Devpost hard deadline.

## Track write-ups (repo)

See `submission/{software,solana,nessie,tiger,spacex,design,godaddy,photon,gemini,bigred}.md` for per-prize blurbs aligned with PLAN §13. Hardware is not entered.
