# Capital One Nessie track

## Short description

Per-bounty bank-rail escrow on Capital One’s Nessie sandbox: fund on post, release shares + treasury on paid claim/confirm, refund on expiry. `/live` can show balances when live; overnight and demo default to `NESSIE_MODE=mock` because VERIFY D transfers do not move balances.

## Why Nessie specifically

1. **Escrow matches the product story.** Poster funds once; chain is paid later; unused cap refunds — without mainnet fiat.
2. **Judge-visible balances.** Planned checking + escrow accounts feed a money panel next to Solana Explorer proof.
3. **HTTPS-only client.** Cornell’s network resets plain HTTP to `api.nessieisreal.com`; the client always uses HTTPS + `?key=`.
4. **Mock-first safety.** Unit tests drive a stand-in client; live stays off until transfers actually debit/credit.

## Where in the code

| Piece | Path |
|---|---|
| Client (open / release / refund / pay) | `web/lib/nessie.ts` |
| Tests (mock fetch) | `web/lib/nessie.test.ts` |
| Create bounty escrow | `web/lib/bounty.ts` (`NESSIE_MODE=live` → `createEscrow`) |
| Claim / confirm / expiry | `web/lib/payout.ts` (`releaseEscrow`, `refundIfLive`) |
| Env | `NESSIE_KEY`, `NESSIE_BASE_URL`, `NESSIE_MODE` in `.env.example` |
| Go/no-go notes | PLAN.md §7.3; task `S2-06` |

**VERIFY D (2026-10-03, failed):** customer + accounts create; `POST …/transfers` with planned `{medium, payee_id, …}` rejects; alternate bodies return 201 but GET balances stay flat. Keep mock until a working transfer shape is confirmed.

## Problem for the next person (2026-10-03)

- `NESSIE_MODE` stays mock. Do not mark S2-06 done. Do not change `web/lib/nessie.ts` to the body the API accepts today, because that body cannot name a destination account.
- Base URL `https://api.nessieisreal.com`, key in `?key=`, HTTPS only.
- Customer and two checking accounts create; starting balances stick (last run checking 80, escrow 0).
- `POST /accounts/{checkingId}/transfers` with `{medium:"balance", payee_id, amount, description}` returns 400. Pydantic `TransferCreate` requires `transaction_date`, `status`, `amount`, `description` and rejects `medium` and `payee_id` as extra fields.
- The four-field body returns 201. `GET /transfers/{id}` shows status completed, amount 10, and no `payee_id`.
- A completed deposit (`medium` balance is allowed on deposits), a completed purchase against a new merchant, and `PUT /accounts/{id}` with `{balance: 12}` (HTTP 202, "Accepted account update") all leave `GET /accounts/{id}` at the creation balance. Polled 45 seconds after the 202, and earlier for 2 minutes.
- The GET balance is only the number from account creation.
- What still needs a working shape: move money checking→escrow on post, escrow→holders and treasury on pay, escrow→checking on expiry, such that both GET balances change. The local stand-in in `nessie.ts` still sends `{medium, payee_id, amount, description}` so mock tests keep describing the intended transfer.

## What judges see

- Under mock: lifecycle still completes; money panel labeled mock / unavailable.
- If live ever passes: `/live` balances after post (escrow funded) and after claim (escrow drained to holders + treasury).
- Honest Q&A: Nessie is demo/play money; Solana Explorer is the atomic payout proof for the crypto rail.
