# Six Hops

Six Hops is a friend-to-friend search for someone you cannot look up. You describe them with attributes only (a city, a field, a skill). A friend passes one personal link to someone closer. The person who matches introduces themselves. The poster funds one reward and takes no share. On a chain of one, the match is paid all of it. On a longer chain the match keeps a reserved floor, earlier passers are paid one sixteenth, and the last passer is paid what remains. A holder can forward to at most 3 people. A chain longer than 8 pays nobody. The public site is [https://sash.select](https://sash.select). Plan: [PLAN.md](PLAN.md). Workflow: [WORKFLOW.md](WORKFLOW.md).

## Judge flow

A judge posts from iMessage, on a phone registered at `/text`. The agent runs on the laptop.

1. Text `new search`.
2. Photon asks who you are looking for. Reply with one description and no names or street addresses. That text becomes the hint card.
3. Photon asks how many hours the search stays open. Reply with a number from 1 to 168.
4. Photon sends the deposit address in its own message, and a minimum in devnet SOL (about 0.068, enough to reach $10). Send devnet SOL to that address, then reply `sent`.
5. When the deposit has landed, Photon replies with your private page. The link is `/h/<token>#k=<poster token>`. Keep it. The `#k=` value is how you accept later.
6. Reply with a name. Photon sends that person's personal link, with a short explanation of the card.
7. The recipient opens the link, reads that explanation, and taps **This is me** or **Pass it on**. They can paste their own Solana address before passing it on.
8. **This is me** opens the claim page. The match writes a short introduction and an optional Solana address, then taps **Opt in and send introduction**.
9. The poster opens the private page, reads the introduction under **Someone claims to be the match**, and taps **Accept and pay**.
10. One devnet transaction pays the chain from that search's deposit wallet.

Photon replies stay on the public hint card and that person's own links. If Photon is quiet, the same search can start on the website: **Start a search**, then pass a personal link. That path uses the website bounty below.

## A personal link

A stranger who receives a link from Photon gets this explanation with it: "This is a search for a kind of person; the card is on the link, so tap This is me if it is you, otherwise pass it to someone closer. The route that works gets paid in test SOL."

On the page, under **Who do you know?**, a hop holder sees: "Someone is looking for a person who matches the card. If it is you, tap This is me; if you know someone closer, pass the link on." Then: "Payment is test SOL for the route that works." **This is me** sits under the hint card. **Pass it on** is the forward form. The page also shows the reward, the hop number (at most 8), and the label the sender used.

## The poster's private page

The depth-0 page says it is your private search, and that the map shows who has the link, without names. **Your search so far** draws one dot per person. The poster is at the top. The chain grows downward. Counts show how many people are helping and how deep the chain is.

`GET /api/h/<token>/network` serves that map only to the poster. `anonymizeGraph` in `web/lib/stats.ts` relabels depth 0 as **You** and everyone else as **Someone**. Names, salts, memos, and real holder ids stay off the response. A hop holder's link does not get this map.

While the search is open or found, the poster card says escrow is holding the reward until they accept. Accepting pays the chain. Rejecting reopens the search. The poster never sees who forwarded.

## Payout split

The payable budget is `B` cents. `H` is 8. The poster takes no share. `splitCents` in `web/lib/split.ts` returns nothing when the chain is shorter than 1 or longer than 8, and a chain that long pays nobody. The shares always sum to `B`.

A chain of one paid person is only the match, and that person gets all of `B`. From two paid people on, the match's share is reserved at `B - 7 * floor(B / 16)`. That floor does not shrink as the chain gets longer. Every passer except the last one gets `floor(B / 16)`. The last passer, the person who handed the link to the match, gets whatever is left.

On a $16 reward (1,600 cents) the reserved match floor is $9 and each earlier passer gets $1.

- Riley is the match: Riley gets $16.
- Riley passed to Sam, and Sam is the match: Riley gets $7 and Sam gets $9.
- Riley passed to Sam, Sam passed to Alex, and Alex is the match: Riley gets $1, Sam gets $6, and Alex gets $9.
- A full chain of 8: six early passers get $1, the last passer gets $1, and the match gets $9.

A last passer who adds one hop they control collects the same total as before. An earlier passer who adds one hop they control gains one `floor(B / 16)`, taken from the last passer, and risks the chain not finding the person in time. The match who adds one hop they control keeps the match payout on the new phone and also collects the new last-passer share. The comparison on `/live` puts that next to the MIT geometric rule, which pays the finder more for each invented hop.

A Photon search creates a new devnet deposit wallet and stores it on the depth-0 holder. The bounty waits in `funding` until SOL arrives. `depositCents` in `web/lib/deposit.ts` keeps a 0.001 SOL reserve (`DEPOSIT_RESERVE_LAMPORTS`) so the wallet can pay the fee, then prices the rest at $150 per SOL. That full amount is the reward: `cap_cents` and `bounty_cents` are set to the same value. When the poster accepts, one devnet transaction is signed by that deposit wallet.

0.5 SOL is 500,000,000 lamports. After the reserve, that is 7,485 cents. On a 2-hop chain the last passer gets 3,269 cents and the match gets 4,216 cents. Bounty `b_gCijcO6z` already paid an earlier equal split from the same deposit size: 467 cents to the passer and 7,018 cents to the match.

A search created on the website still takes a dollar cap. `INITIAL_SHARE` in `web/lib/types.ts` is 0.6, so the payable budget starts at 60% of the cap and the rest is reserve. That search has no deposit wallet, so the devnet payout is signed by the shared treasury (`SOLANA_PAYER_SECRET`). The split is the same last-passer rule, applied to that 60% budget. The poster still takes no share.

## After Pass it on

A hop holder who taps **Pass it on** then sees **Your share is paid to this address**, with **Copy address** and **View on Solana Explorer**. On devnet, that address is created once at pass time when they keep the demo wallet, and a later pass shows the same address. If they paste their own Solana address, that public address is the one shown. The poster is not paid and does not get this card. Choosing Nessie checking does not show a Solana address.

## Nessie

The **Balances (Nessie)** panel on `/live` shows Nessie checking and escrow as the bank rail. Checking is a $50 cushion plus the part of the cap that is not the payable reward. Escrow shows the payable reward until the search is paid or refunded, then it shows zero. For the featured replay those figures are a $20 cap and a $16 reward when the public bounty is not loaded, so checking reads $54 and escrow reads $16 while the reward is still set aside. The note is either "Escrow is holding the reward until the poster accepts." or "Checking holds the remaining balance."

The balances shown are demo figures. The panel computes them in the page. It does not call Capital One, and no live bank transfer runs.

## `/live`

[sash.select/live](https://sash.select/live) is the Tiger replay `r_0000`: 764 holders, depth through 8, the branching display, and the attack slider. `FEATURED_BOUNTY` selects it. A search started on a phone is a different bounty id. Tiger holds 1,000,000 replay `events` rows; on `r_0000` the `bounty_minute` aggregate answers in about a third of a millisecond, against about 87 ms for the raw scan of the same buckets.

## `/text`

Photon Pro shared lines only accept registered numbers. [sash.select/text](https://sash.select/text) takes the phone number your iMessage uses and registers it as a shared user (`web/lib/photon.ts`, `POST /api/photon/join`). The page then shows the line to text, with `new search` ready to send. A personal link can also be pasted to that number. An unregistered number uses the copied `/h/` link instead.

## Kill switch

From the repo root:

```bash
npm --prefix web run kill-switch -- --dry-run
npm --prefix web run kill-switch
```

That calls `POST /api/admin/reset` and marks every live `b_` search (`funding`, `open`, `found`) as `cancelled`. Personal links for those searches die. Paid bounties and the `/live` replay stay. Devnet SOL already in a deposit wallet stays there. The same command clears Photon conversations on the laptop agent (`POST /reset` on port 8787). Texting `reset` clears only that sender's conversation, then they can text `new search` again.

## Repo layout

- `web/` is the Next.js site: pages, API routes, the split, deposits, and payouts.
- `agent/` is the Photon iMessage agent. It runs on the laptop and listens for `/health`, `/send`, and `/reset`.
- `db/` is the Tiger schema, continuous aggregates, and `apply.mjs`.
- `sim/` replays the cascade used on `/live`.
- `submission/` is the judge guide, track notes, slides, and the table script.
- `scripts/task.sh` is the task board.

## How a search is stored

Tiger (or local PGlite) keeps four tables from `db/schema.sql`.

- `bounties` is one search: hint card, cap, payable budget, status, expiry, and the poster's confirm token.
- `holders` is one person in the chain. Depth 0 is the poster. The token in `/h/[token]` is theirs. A Photon deposit wallet sits on the depth-0 row. A pasted Solana address is that holder's `sol_address`.
- `payouts` is one row per paid holder: passer, match, or the poster's reserve refund. Every SOL share of a bounty shares one transaction signature.
- `events` is the append-only stream, live and replay together (`source` is `live` or `replay`).

## How to run

Install and check, from a clone of this repo. Node 20+.

```bash
npm --prefix web ci
npm --prefix web run check
npm --prefix web run smoke:mock
npm --prefix web run smoke:http
npm --prefix web run smoke:unit
node db/apply.mjs --dry-run
```

`smoke:mock` is the PGlite path: create, forward three times, claim, confirm. `smoke:http` hits the route handlers. Optional replay header check: `bash sim/smoke_replay.sh` (python3 and numpy).

Copy [.env.example](.env.example) to `web/.env.local` and [agent/.env.example](agent/.env.example) to `agent/.env.local`. Set names only in those files, never in git: `DATABASE_URL`, `INTERNAL_SECRET`, `PUBLIC_BASE_URL`, `FEATURED_BOUNTY`, `PAYOUT_MODE`, `SOLANA_RPC_URL`, `SOLANA_RPC_BACKUP`, `SOLANA_PAYER_SECRET`, `DEMO_USD_PER_SOL`, `NESSIE_MODE`, `NESSIE_KEY`, `NESSIE_TREASURY_ACCT`, `PHOTON_ENABLED`, `PHOTON_API_KEY`, `SPECTRUM_PROJECT_ID`, `SPECTRUM_PROJECT_SECRET`, `AGENT_URL`, `AGENT_PORT`, `GEMINI_ENABLED`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `GROK_ENABLED`, `XAI_API_KEY`.

Local site without Tiger: point `DATABASE_URL` at a PGlite path, set `PUBLIC_BASE_URL` to localhost, and leave `PAYOUT_MODE` and `NESSIE_MODE` at the values in `.env.example`. Then `npm --prefix web run dev`. Walk `/post`, a poster `/h/<token>`, a forward, and `/claim/<token>`.

Seed a local `/live` cascade:

```bash
npm --prefix web run seed:demo && npm --prefix web run dev
```

`seed:demo` writes `web/.data/demo`, sets `FEATURED_BOUNTY` in `web/.env.local` when that file is not already a Tiger URL, and checks `/api/stats` and `/api/graph`.

Phone on the same Wi-Fi: set `PUBLIC_BASE_URL` to the laptop's LAN address on port 3000, start `npm --prefix web run dev -- --hostname 0.0.0.0 --port 3000`, and open `/post` from the phone.

Apply the Tiger schema with `DATABASE_URL` set: `node db/apply.mjs`. Optional load: `python3 sim/replay.py` and `bash sim/load.sh`. Set `FEATURED_BOUNTY` to `r_0000` for the production board.

The Photon agent: `npm --prefix agent ci`, then `npm --prefix agent start`. It listens on `AGENT_PORT` (8787 unless that variable says otherwise). `PAYOUT_MODE=devnet` is what sends the devnet transaction.

Write-ups: [submission/README.md](submission/README.md). Judge steps: [submission/judge-guide.md](submission/judge-guide.md).

## Speakers

Sahas opens, says why the search exists, and explains how a deposit splits. He cues the phones, walks whichever judge is in front of him through that track, closes, and takes questions. Hayden covers the site and Solana: the Next.js pages, personal `/h/` links, claim, accept, and the one devnet payout (deposit wallet versus treasury). Selina covers Photon and Tiger: registration at `/text`, the iMessage search, and the `/live` replay `r_0000`. The laptop stays on `/live`.

## Tracks entered

From [submission/track-ticks.md](submission/track-ticks.md):

- **BigRed (main).** Every team is auto-entered for the Navigation theme track.
- **Software.** Six Hops is a typed full-stack product with this split, fan-out at most 3, depth at most 8, and a post-to-forward-to-claim path.
- **Design.** The design is the mobile post, hop, and claim flow, plus the `/live` cascade, branching-factor display, and attack slider.
- **People's Choice.** PLAN.md section 13 lists it.
- **Capital One: Nessie.** The `/live` panel shows checking and escrow. The figures are demo balances for that bank rail. The depth-0 poster is not paid.
- **SpaceX: Make it Legendary.** The project was built entirely in Cursor, using agent mode and cloud agents. Sahas, Hayden, Audrey, and Selina used an agent-mode chat, and Hayden, Audrey, and Selina ran sandbox agents. Grok Imagine draws one simple neutral vector of the person after the bounty form on `/post` is submitted, and name-free wanted-poster previews on forwarded links.
- **Photon: iMessage agents.** A registered holder gets a 1:1 iMessage with their personal link and hint card. A tapback or yes plus a first name creates the next hop. A stall gets a nudge to pass it to someone closer. After the poster confirms, they get a paid message with the Explorer link. Anyone not registered uses the copied link.
- **MLH: Solana.** A devnet claim and confirm produced multi-instruction transactions with pay memos.
- **MLH: Tiger Data.** Tiger holds 1,000,000 replay `events` rows, and the continuous aggregate beats the raw scan on `r_0000`.
