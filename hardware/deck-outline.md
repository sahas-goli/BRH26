# Main deck outline (HW-06)

Slide-by-slide for the Google Drive PDF (PLAN.md §13). Spoken beats match PLAN §12 / `submission/pitch-2min.md`.  
**Done when:** PDF on Drive + link in team chat — this file is the outline only.

Local UI for screenshots: `npm --prefix web run seed:demo && npm --prefix web run dev` (sets `FEATURED_BOUNTY`).

---

## Slides

### 1. Title
- **Six Hops** — friend-to-friend bounties that pay the chain correctly
- Team names + BigRed//Hacks 2026
- Optional: badge photo or `/live` still as background

### 2. Problem
- The person you need is usually 2–4 hops away in private contacts
- LinkedIn-style apps need a **central copy of everyone’s graph**
- Existing bounty / referral splits reward fake hops (MIT-style gains)

### 3. Insight (Kleinberg / Milgram)
- Navigability with **local knowledge alone** (keynote / small-world)
- We never see the network — humans choose the next hop
- Domain callback: `milgram.study` (when claimed)

### 4. Solution (one screen)
- Poster posts capped bounty + attribute-only hint card
- Holders forward ≤ 3; depth ≤ 8
- Target claims (badge HOTP or intro) → **one** Solana multi-payee tx
- Babaioff-style split: finder gains **+0%** from fake recruiters

### 5. Screenshot — `/live` cascade
- **Capture:** `http://localhost:3000/live` after `seed:demo`
- Show: depth-colored d3 cascade, paid target glow, edge memos
- Caption: “Overnight game + seeded table demo (PGlite / Tiger when live)”

### 6. Screenshot — branching factor `b`
- Same `/live`: gauge needle, controller steps, holders / frontier / max depth
- Call out red zone **b < 2** (controller widens hint)
- Optional inset: physical gauge + `hardware/bridge.py`

### 7. Screenshot — `/post`
- **Capture:** `http://localhost:3000/post`
- Hint fields (or free text), cap, deadline
- Caption: attributes only; Gemini optional

### 8. Screenshot — hop `/h/[token]`
- Wanted card + hint + depth (“hop N of 8”) + forward form
- Caption: personal link (iMessage via Photon when registered, else SMS/AirDrop)

### 9. Screenshot — `/claim/[token]`
- Intro + optional badge code → success + Explorer link (mock or devnet)
- Caption: target opts in; poster never sees the chain

### 10. Screenshot — attack slider
- **Capture:** `/live` attack panel, drag **k = 1..4**
- Side-by-side: MIT +50/75/88/94% vs ours **+0%**; poster total unchanged
- Back with `web/lib/split.ts` / `/api/attack`

### 11. Tech stack
- Next.js + Tiger (or local PGlite) · Solana memos/payout · Nessie escrow (mock until VERIFY D)
- Photon / Spectrum iMessage · Grok Voice + Imagine · Gemini hints
- Arduino HOTP badges + serial `b` gauge · Cursor agents (Co-authored-by)

### 12. Impact / demo ask
- Venue overnight game + projector `/live`
- Judges: register number or use `/h` link; try attack slider
- Tracks: BigRed, Software, Hardware, Design, Solana, Photon, …

### 13. Backup / honesty
- Fallback video: `submission/backup-video.md` (AL-03)
- Play money: devnet + Nessie mock; real incentives when RPC/mainnet
- Repo: github.com/Sahas266/BRH26 (public after secret scrub)

---

## Screenshot checklist (before export)

| # | URL / surface | File suggestion |
|---|---|---|
| A | `/live` full board | `deck/01-live.png` |
| B | `/live` gauge + controller | `deck/02-gauge.png` |
| C | `/live` attack k=2 | `deck/03-attack.png` |
| D | `/post` | `deck/04-post.png` |
| E | `/h/<token>` hop | `deck/05-hop.png` |
| F | `/claim/<token>` success | `deck/06-claim.png` |
| G | Explorer tx (devnet or mock label) | `deck/07-explorer.png` |

Do **not** paste secrets, `.env.local`, or `hardware/secrets.h` into the deck.
