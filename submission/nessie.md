# Capital One Nessie track

## Short description

Per-bounty escrow accounts: fund on post, release on paid claim/confirm, refund on expiry; bank-rail holders get Nessie accounts when live.

## Why Nessie specifically

1. Real-looking balances panel for judges without moving mainnet money.
2. Escrow semantics match “poster funds once, chain paid later.”
3. HTTPS-only client matches Cornell network constraints.

## Where in the code

- `web/lib/nessie.ts`, create/claim/expiry paths; `NESSIE_MODE=mock|live`
- VERIFY D (2026-10-03): transfers did not move balances—stay on mock until fixed

## Demo look-at

`/live` money panel under mock, or live balances once VERIFY D passes.
