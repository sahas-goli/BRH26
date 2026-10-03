# MLH Solana track

## Short description

Each forward commits a salted edge memo on Solana; a successful claim pays the whole chain in one atomic multi-transfer + memo transaction on devnet.

## Why Solana specifically

1. One tx, N payees, no custom program—fits sub-2s demo latency.
2. Memo program gives timestamped edge commitments that cannot be backdated.
3. Devnet + mock mode keeps overnight games safe; mainnet is an RPC flip.

## Where in the code

- `web/lib/solana.ts`, payout path in `web/lib/payout.ts`, `PAYOUT_MODE=devnet|mock`

## Demo look-at

Explorer link after claim/confirm: N transfers + `sixhops:pay:…` memo.
