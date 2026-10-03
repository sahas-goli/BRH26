# BigRed (main theme: Navigation)

## Short description

Decentralized social search: people navigate private contact graphs with local knowledge (Milgram / Kleinberg navigability), and a successful chain is paid correctly under a Babaioff-style split — no central copy of anyone’s address book.

## Why BigRed / Navigation specifically

1. **Theme fit.** Navigation through a social network, not a map UI bolted onto a directory.
2. **Keynote-grounded.** Local routing with no global graph; we never see the network — humans choose the next hop.
3. **Playable overnight.** Venue game + `/live` cascade make “2–4 hops away” measurable, not just a slide.
4. **Incentive correctness.** Depth ≤ 8, fan-out ≤ 3, finder cannot profit from fake hops (attack slider / `split.ts`).

## Where in the code

| Piece | Path |
|---|---|
| Product core | `web/lib/bounty.ts`, `web/lib/split.ts`, claim/forward APIs |
| Personal hop UX | `web/app/h/[token]/`, `web/app/claim/[token]/`, `web/app/post/` |
| Room navigation viz | `web/app/live/` (cascade, b, controller, attack) |
| Replay / cliff | `sim/replay.py`, sweep charts on `/live` |
| Demo script | PLAN.md §12 |
| Deck PDF | HW-06 (Drive); ops in `hardware/game.md` |

## What judges see

The 2-minute script (PLAN.md §12): Kleinberg one-liner → `/live` overnight + replay → judge hop (Photon or `/h` link) → target claim → attack slider (+0% finder gain). Q&A crib in the same section (not a pyramid; attributes only; no LinkedIn graph dump).
