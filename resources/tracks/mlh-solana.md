# MLH: Best Use of Solana (sponsor, via MLH)

## Challenge
Build on Solana's fast execution and near-zero transaction costs. Suggested: games, social apps, consumer products needing high-frequency transactions, trading/lending platforms, supply-chain or identity solutions at volume.

## Requirements
Use Solana blockchain infrastructure.

## Judging
Not specified; innovation and real-world applicability.

## Build resources
- Partner page: https://www.mlh.com/partners/solana (https://mlh.link/solana).
- Quickstart (browser-only, no install): https://solana.com/docs/intro/quick-start via Solana Playground https://beta.solpg.io/ (devnet wallet, `solana airdrop 5`). Playground wallet is for testing only; never send mainnet assets.
- Devnet faucet: https://faucet.solana.com/
- Local setup: https://solana.com/docs/intro/installation (Rust, Solana CLI, Anchor; Windows needs WSL). Anchor docs: https://www.anchor-lang.com/docs
- Docs https://solana.com/docs | agent skills https://solana.com/skills | templates (dApp/DeFi/NFT) https://templates.solana.com/ | Blueshift courses https://learn.blueshift.gg/en | hacker resources PDF (Drive) https://drive.google.com/file/d/1Fwll2BhiunGD1q21ZMB8vVsaugdssqmV/view
- Quickstart topics: accounts, transactions, programs, PDAs, CPIs.

## Verified 2026-10-03 (proposal research)

**Gotchas:** The devnet faucet is rate-limited, so airdrop early and keep a funded keypair. Blinks will not unfurl on X without Dialect registration, so demo in a wallet or a page instead. Writing an Anchor program costs hours (Rust, plus WSL on Windows); for a 32-hour build, prefer SOL/SPL transfers plus memos (or Solana Pay QR) from @solana/kit with no custom program. Phantom must be switched to devnet for the demo. Solana judging is unpublished ('innovation and real-world applicability'); a token bolted on for its own sake reads as a gimmick. Bee Maps API pricing and access were not verified (API reference not fetched).

**What judges rewarded at other 2025-2026 events:** At small events the bar is low and the field is thin; even vague integrations have won. Strong entries make on-chain state meaningful (provenance, tamper-proof logs, payments or escrow, tokens). Usually off-theme for navigation unless used as a tamper-evident record or payment rail.

Examples: DivHacks 2026 winner: ExitNow (NYC subway copilot with GTFS-RT, Grok filtering, Photon ETA messages to friends); the Devpost write-up never explains the Solana role. ShellHacks 2026 winner: MomentumX (tokenized-stock trading with a momentum scanner). TAMUhack 2026: NFTicket (Solana NFT ticketing), and cortex (1st overall) put baggage records on-chain.

Sources: https://solana.com/docs/intro/quick-start | https://solana.com/docs/clients/javascript | https://solana.com/developers/guides/advanced/actions | https://faucet.solana.com/ | https://docs.solanapay.com/core/transfer-request/merchant-integration | https://www.coindesk.com/tech/2025/10/06/bee-maps-raises-usd32m-to-scale-solana-powered-decentralized-mapping-network | https://beemaps.com/docs/
