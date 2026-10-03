# Design track

## Short description

Mobile-first post → hop → claim flows, plus a full-bleed `/live` room screen: d3-force cascade by depth, branching-factor gauge, controller steps, attack slider, and Grok Imagine (or template) wanted cards as link previews.

## Why Design specifically

1. **One job per surface.** `/post`, `/h/[token]`, `/claim/[token]`, `/live` — no dashboard clutter in the personal hop path.
2. **Room vs pocket.** Projector gets `/live`; phones get personal links and OG wanted cards.
3. **Theory made visible.** Depth-colored cascade, b-gauge (red below 2), and MIT-vs-ours attack slider turn Kleinberg / Babaioff into something judges can point at in 30 s.
4. **Shareable brand.** Every forward preview is a wanted poster (`/api/og/[id]`), not a generic link card.

## Where in the code

| Piece | Path |
|---|---|
| Live board + gauge UI | `web/app/live/live-board.tsx`, `web/app/live/live.css` |
| Cascade (d3-force) | `web/app/live/cascade.tsx` |
| Hop / claim / post | `web/app/h/[token]/`, `web/app/claim/[token]/`, `web/app/post/` |
| OG wanted card | `web/app/api/og/[id]/route.ts`, `web/lib/imagine.ts` |
| Attack comparison API | `web/app/api/attack/` |
| Voice alternate | `web/app/talk/[token]/` |

## What judges see

1. `/live` on the projector: overnight cascade + b needle + attack slider (MIT +50/75/88/94% vs ours +0%).
2. Phone: hop page with depth, forward form, wanted image; claim success with Explorer link when paid.
3. Fallback OG template when `GROK_ENABLED=false` (still on-brand, no xAI key required).
