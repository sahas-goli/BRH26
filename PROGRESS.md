# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 12:28 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| `50a3bb1` | `web/lib/split.ts`. Each relay gets `floor(B/16)`. A finder who adds fake hops collects the same total. Tests pass via `npx tsx --test web/lib/split.test.ts`. | S2-01 still open. Done-when needs `npm run check`, which does not exist until S3-01. |
| `8a2ba64` | Devnet rent exemption measured at 650,240 lamports (`getMinimumBalanceForRentExemption(0)` on `api.devnet.solana.com`). PLAN.md 6.1 now uses that figure: about 9.8 cents at `DEMO_USD_PER_SOL=150`, so B ≥ 160 cents. `web/scripts/gonogo.cjs` reruns tests B and D. | S2-02 still open. |
| `fe72e97` | `web/lib/payout.ts` ledger. A 4-deep chain at 1600 cents pays 100 + 100 + 100 + 1300. A second confirm returns `mock_<bountyId>` and adds no rows. | Superseded by the claim routes in `7d487e5`. |
| `b7fa142` | `POST /api/attack`. Ours gain is 0%. MIT gain is 50 / 75 / 87.5 / 93.75 for k=1..4. | S2-04 done. |
| `9a37154` | Controller. A seeded stall steps nudge, widen, raise. An overdue bounty refunds the full cap. Tick route is 503 until `pool` exists. | S2-07 done. |
| `c8f09bc` | `web/lib/solana.ts` builds one payout transaction: N transfers plus a `sixhops:pay` memo. | S2-05 still open. |
| `a62857f` | `submitPayout` sends that transaction once. A retry returns the existing signature. | S2-05 still open. |
| `4b3c8e2` | `web/lib/nessie.ts` opens an escrow (checking funded at cap + $50, then the cap moves into escrow), pays holders from escrow, and refunds the rest to checking. A local stand-in proved both balances move on each step. Live Nessie was not called. | S2-06 still open. `NESSIE_KEY` unset. |
| `37731b0` | When `PAYOUT_MODE=devnet`, claim and confirm stamp one signature onto the payout rows before insert. Bank rails and refunds stay off that transaction. A second confirm returns the stored signature and does not sign again. The test injects the signature; no devnet send ran. | S2-05 still open. `SOLANA_PAYER_SECRET` unset. |

## This branch

Nothing in flight. Mock payouts stay `mock_<bountyId>` unless `PAYOUT_MODE=devnet`.

## Plan changes

- 2026-10-03: rent exemption is 650,240 lamports, not the earlier 890,880. Recorded in PLAN.md 6.1. Relay floor is 10 cents, so B ≥ 160 cents. The $10 cap still clears it.
- 2026-10-03: Nessie writes not run. `NESSIE_KEY` unset. PLAN.md 7.3 still says VERIFY D.

## Blocked

- S2-01 and later web tasks that need the app runner: S3-01 scaffold is not on main. No `package.json`, no `web/lib/db.ts`, no `npm run check`. Claim and confirm return 503 until `pool` exists.
- S2-02 test B, the 6-transfer half: devnet faucet returned 429. No `SOLANA_PAYER_SECRET`.
- S2-02 test D: no `NESSIE_KEY`.
- `swe1/S1-02` has bounty code on its branch and no pull request.

## Claims

SWE2 holds S2-05 and S2-06. S2-01 and S2-02 are open. S2-03, S2-04, and S2-07 are done.

## Next

S2-05 claim and confirm now call the signer when `PAYOUT_MODE=devnet`. A confirmed devnet signature still needs a funded payer. S2-06 still needs `NESSIE_KEY` before `NESSIE_MODE=live`. S2-01 needs `npm run check`.
