# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 13:50 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| `50a3bb1` | `web/lib/split.ts`. Each relay gets `floor(B/16)`. A finder who adds fake hops collects the same total. | S2-01. `npm run check` now runs these tests. |
| `8a2ba64` | Devnet rent exemption measured at 650,240 lamports (`getMinimumBalanceForRentExemption(0)` on `api.devnet.solana.com`). PLAN.md 6.1 now uses that figure: about 9.8 cents at `DEMO_USD_PER_SOL=150`, so B ≥ 160 cents. `web/scripts/gonogo.cjs` reruns tests B and D. | S2-02 still open. |
| `fe72e97` | `web/lib/payout.ts` ledger. A 4-deep chain at 1600 cents pays 100 + 100 + 100 + 1300. A second confirm returns `mock_<bountyId>` and adds no rows. | Superseded by the claim routes in `7d487e5`. |
| `b7fa142` | `POST /api/attack`. Ours gain is 0%. MIT gain is 50 / 75 / 87.5 / 93.75 for k=1..4. | S2-04 done. |
| `9a37154` | Controller. A seeded stall steps nudge, widen, raise. An overdue bounty refunds the full cap. Tick route is 503 until `pool` exists. | S2-07 done. |
| `c8f09bc` | `web/lib/solana.ts` builds one payout transaction: N transfers plus a `sixhops:pay` memo. | S2-05 still open. |
| `a62857f` | `submitPayout` sends that transaction once. A retry returns the existing signature. | S2-05 still open. |
| `4b3c8e2` | `web/lib/nessie.ts` opens an escrow (checking funded at cap + $50, then the cap moves into escrow), pays holders from escrow, and refunds the rest to checking. A local stand-in proved both balances move on each step. Live Nessie was not called. | S2-06 still open. `NESSIE_KEY` unset. |
| `37731b0` | When `PAYOUT_MODE=devnet`, claim and confirm stamp one signature onto the payout rows before insert. Bank rails and refunds stay off that transaction. A second confirm returns the stored signature and does not sign again. The test injects the signature; no devnet send ran. | S2-05 still open. `SOLANA_PAYER_SECRET` unset. |
| `4902fca` | `releaseEscrow` also moves the Solana share from escrow to a treasury account. The local stand-in shows holder, treasury, and escrow all move. | S2-06 still open. Live Nessie not called. |
| `46c5b82` | When `NESSIE_MODE=live`, confirm pays bank-rail holders from escrow, moves the Solana share to treasury, and refunds `cap - bounty`. An overdue tick refunds the full escrow before it marks the bounty refunded. | S2-06 still open. Live Nessie not called. |
| `4151c75` | A paid claim or confirm includes `explorerUrl` for the payout signature. | S2-05 still open. No confirmed devnet signature. |
| `fd879cc` | Web scaffold is on main. `npm run check` passed (23 tests, including the split brute force) and `npm run build` passed. | S2-01 done. S3-01 still needs a Vercel preview. |
| `64070f8` | When `PAYOUT_MODE=devnet`, a custodial hop with no address gets a server keypair before the payout transaction. A wallet hop with no address fails closed. | S2-05 still open. Faucet 429. No `SOLANA_PAYER_SECRET`. |
| `52cb84f` | `createEscrow` funds escrow once per bounty id. A second call returns the same accounts. | S2-06 still open. Live balances do not move. |
| `86d8523` | In devnet mode the payout rows are committed before the signature is requested. The bounty stays `found` until that signature is stored. A retry that already has a signature does not send again. | S2-05 still open. No claim transaction yet. |
| `a51d8a0` | `db/schema.sql`, `db/caggs.sql`, and `db/apply.mjs` with VERIFY E fallbacks. | S3-02 still open until applied to Tiger. |
| (this PR) | `GET /api/stats` and `GET /api/graph/[id]`. Gauge JSON uses PLAN 4.2 queries. Graph hides salts until paid and links the payout explorer URL. | S3-04 done. |

## This branch

`web/lib/stats.ts` plus the stats and graph routes. Unit tests cover gauge JSON and salt reveal rules. Routes return 503 without `DATABASE_URL`.

## Plan changes

- 2026-10-03: rent exemption is 650,240 lamports, not the earlier 890,880. Recorded in PLAN.md 6.1. Relay floor is 10 cents, so B ≥ 160 cents. The $10 cap still clears it.
- 2026-10-03: test B passed. Treasury `DgGpjfFcuZkvQDpMDyPC7fnbJovzQjpXfycRpLMXuA1a` held 5 SOL. Five 6-transfer memos confirmed. Median 611 ms. PLAN.md 6.1.
- 2026-10-03: test D failed. Nessie creates the customer and accounts, then a completed transfer returns 201 and does not change either balance within 2 minutes. The live body has no payee. `NESSIE_MODE` stays mock. PLAN.md 7.3.
- 2026-10-03: a local claim and confirm confirmed devnet signature `61a5bLrJdUqZkYqjvptTqJ5KGqj2dGWdhvSjoDrgJG16sTwwNqkdNbTcdbbRphtmxRyFjFbz3kuMqgbPU7NjQiXS`. One transfer plus a pay memo. S2-05 stays open until `/live` links it.

## Blocked

- Claim and confirm return 503 until `DATABASE_URL` is set. `pool` is exported from `web/lib/db.ts`.
- S3-02: schema is in the repo. Live apply waits on `DATABASE_URL` (`node db/apply.mjs`).
- S2-05: a local claim and confirm already produced confirmed devnet signature `61a5bLrJdUqZkYqjvptTqJ5KGqj2dGWdhvSjoDrgJG16sTwwNqkdNbTcdbbRphtmxRyFjFbz3kuMqgbPU7NjQiXS` (one transfer plus a `sixhops:pay` memo). The task stays open because `/live` is still the SWE3 stub and `DATABASE_URL` is unset. No backup RPC is set.
- S2-06 cannot go live. Nessie balances do not move after a 201 transfer.
- `swe1/S1-02` has bounty code on its branch and no pull request.

## Claims

SWE3 holds S3-02 and S3-04. SWE2 holds S2-05 and S2-06. S2-01, S2-02, S2-03, S2-04, and S2-07 are done.

## Next

S3-05 `/live` can consume stats/graph once seeded. S3-02 needs Tiger `DATABASE_URL`. S3-03 replay after schema is live.
