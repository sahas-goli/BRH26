# MLH Solana track

## Short description

Every forward can commit a salted edge memo on Solana. A successful claim pays the entire winning chain in **one** confirmed transaction: up to 8 `SystemProgram.transfer`s plus one Memo (`sixhops:pay:<bountyId>:<hash>`). Devnet for the demo; `PAYOUT_MODE=mock` overnight.

## Why Solana specifically

1. **Atomic multi-payee payout** without a custom on-chain program — fits a ~2 s stage moment.
2. **Edge commitments.** `sixhops:edge:…` memos hash parent/child salts so losing branches stay private but edges are timestamped.
3. **Cheap + fast** for hackathon demo money; mock mode keeps venue games safe until RPC is healthy.
4. **Explorer is the proof.** Judges open one URL and see N transfers + memo.

## Where in the code

| Piece | Path |
|---|---|
| Memos / tx builders | `web/lib/solana.ts` (`edgeMemo`, `payMemo`, `buildPayoutTransaction`) |
| Claim / confirm settle | `web/lib/payout.ts` (`PAYOUT_MODE=devnet` path) |
| Go/no-go B harness | `web/scripts/gonogo.cjs` |
| Env | `SOLANA_RPC_URL`, `SOLANA_PAYER_SECRET`, `PAYOUT_MODE` |

**Measured (PLAN §7.2):** Devnet claim/confirm produced multi-instruction txs with pay memos (signatures recorded in PLAN).

## What judges see

After poster confirm: Explorer link (`explorer.solana.com/tx/…?cluster=devnet`) with N transfers + memo. Attack slider on `/live` explains why the split is Solana-settled the way it is.
