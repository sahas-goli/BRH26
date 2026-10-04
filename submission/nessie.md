# Capital One Nessie track

## Short description

On post the cap moves from checking to escrow. On poster confirm, holder shares and the Solana-rail treasury leg leave escrow and the remainder returns to checking. On expiry the escrow refunds to checking. The `/live` money panel shows it. The depth-0 poster is not paid.

## Why Nessie specifically

1. **Escrow matches the product story.** The poster funds the cap once. On confirm, holder shares and the Solana-rail treasury leg leave escrow, and the unused remainder returns to checking.
2. **Judge-visible balances.** The `/live` Balances (Nessie) panel shows checking and escrow next to the Solana Explorer proof.
3. **HTTPS-only client.** Cornell’s network resets plain HTTP to `api.nessieisreal.com`; the client always uses HTTPS and `?key=`.
4. **The depth-0 poster is not paid.** The paid chain starts at depth 1. The poster’s ledger row is the refund of the unused cap.

## Where in the code

| Piece | Path |
|---|---|
| Open, release, refund, pay | `web/lib/nessie.ts` |
| Post funds escrow | `web/lib/bounty.ts` (`createEscrow`) |
| Confirm pays holders, treasury, remainder | `web/lib/payout.ts` (`payFromEscrow`) |
| Expiry refunds escrow to checking | `web/app/api/controller/tick/route.ts` (`refundIfLive`) |
| Money panel | `web/app/live/live-board.tsx` |
| Env names | `NESSIE_KEY`, `NESSIE_BASE_URL`, `NESSIE_MODE` in `.env.example` |

## What judges see

- Post: the cap moves from checking to escrow.
- Poster confirm: holder shares and the Solana-rail treasury leg leave escrow, and the remainder returns to checking.
- Expiry: the escrow refunds to checking.
- `/live` shows checking, escrow, and status.
- The depth-0 poster is not paid.
