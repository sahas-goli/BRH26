# Checkpoint 1 — before the table, 2026-10-04

Early morning, before the hackathon table. Live demo: https://sash.select. `origin/main` is `4c130c4` (PR 77, payout address after Pass it on). The Photon deposit path, kill switch, judge guide, and This is me button are already merged (PRs 70–76).

## Running

The Photon agent must be running on the laptop (`agent/`, `PHOTON_ENABLED`, port 8787). Leave that process up. Pro shared line; judges register at `/text`.

## Flow

New search → description → hours → deposit address in its own iMessage → send devnet SOL → reply `sent` → private page → pass a name → the recipient taps **Pass it on** or **This is me**.

**This is me** is a green button under the hint card (PR 76).

After **Pass it on**, a hop holder sees "Your share is paid to this address." with **Copy address** and **View on Solana Explorer** (PR 77). The poster is not paid and does not get that address. The custodial wallet is created once at pass time on devnet.

## Split

Payable budget is the deposit minus a 0.001 SOL reserve, priced at $150/SOL. Each passer gets `floor(B/16)`. The match gets the rest. One transaction pays the chain from that search's deposit wallet. Website-created searches still use the 60% cap and the treasury.

## Paid on devnet

- `b_gCijcO6z`: 2 hops, 0.5 SOL, passer 467¢, match 7018¢.
- `b_DQkaXzZU`: Selina 62¢, Audrey 943¢, 0.068 SOL deposit.
- `b_H35TUd5E`: Hayden 62¢, Selina 62¢, Audrey 881¢, 1005¢ reward.

## Public demo addresses

Receive addresses and the funding wallet only. No private keys.

- Audrey `Fm32wWrLyyXXPDzgked6GJ9mRpt436P11EZzksy3kPBL`
- Linity `G3brZuf7Xkgg21WZ6v5r5nQPy2AEW6o53wHS18oU4NLB`
- fool `ESFQ7UT8P3iemp6YxRccP7wc63WRTbpNd26WpXhQrTDq`
- Funding wallet `DgGpjfFcuZkvQDpMDyPC7fnbJovzQjpXfycRpLMXuA1a`

## Speakers

Audrey: motivation and payout logic. Hayden: site and Solana payout. Selina: Photon and Tiger. Sahas: clock, phone cue, and per-judge track.

## If we have to stop

`npm --prefix web run kill-switch` (a `--dry-run` flag exists). Text `reset` clears one Photon conversation.

## Known

The laptop must stay awake. A link mix-up after resolve was reported and is not fixed. Nessie is mock.
