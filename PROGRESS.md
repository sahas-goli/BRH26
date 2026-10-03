# Progress

Living status. The build plan stays in [PLAN.md](PLAN.md). Update this file when something merges, a go/no-go result comes in, or a task blocks.

Updated 2026-10-03 12:10 ET.

## On main

| Commit | What landed | Task |
|---|---|---|
| `50a3bb1` | `web/lib/split.ts`. Each relay gets `floor(B/16)`. A finder who adds fake hops collects the same total. Tests pass via `npx tsx --test web/lib/split.test.ts`. | S2-01 still open. Done-when needs `npm run check`, which does not exist until S3-01. |
| `8a2ba64` | Devnet rent exemption measured at 650,240 lamports (`getMinimumBalanceForRentExemption(0)` on `api.devnet.solana.com`). PLAN.md 6.1 now uses that figure: about 9.8 cents at `DEMO_USD_PER_SOL=150`, so B ≥ 160 cents. `web/scripts/gonogo.cjs` reruns tests B and D. | S2-02 still open. |
| `fe72e97` | `web/lib/payout.ts` ledger. A 4-deep chain at 1600 cents pays 100 + 100 + 100 + 1300. A second confirm returns `mock_<bountyId>` and adds no rows. | Superseded by the claim routes below. |

## This branch

`POST /api/claim` and `POST /api/bounties/[id]/confirm` call `claimBounty` / `confirmBounty`. A mock 4-deep claim writes payout rows that sum to `bounty_cents` (1600), sets status `paid`, and a second confirm returns the same signature with the row count unchanged. Against a real database the routes need `web/lib/db.ts` to export `pool`. Until then they return 503.

## Plan changes

- 2026-10-03: rent exemption is 650,240 lamports, not the earlier 890,880. Recorded in PLAN.md 6.1. Relay floor is 10 cents, so B ≥ 160 cents. The $10 cap still clears it.
- 2026-10-03: Nessie writes not run. `NESSIE_KEY` unset. PLAN.md 7.3 still says VERIFY D.

## Blocked

- S2-01 and later web tasks that need the app runner: S3-01 scaffold is not on main. No `package.json`, no `web/lib/db.ts`, no `npm run check`. Claim and confirm return 503 until `pool` exists.
- S2-02 test B, the 6-transfer half: devnet faucet returned 429. No `SOLANA_PAYER_SECRET`.
- S2-02 test D: no `NESSIE_KEY`.
- `swe1/S1-02` has bounty code on its branch and no pull request.

## Claims

SWE2 holds S2-01. S2-02 is open. S2-03 is done once this branch merges.

## Next

S2-04 attack endpoint. It can be built from `attackComparison` in `web/lib/split.ts`. S2-05 and S2-06 stay blocked on the faucet and `NESSIE_KEY`.
