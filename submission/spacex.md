# SpaceX Make it Legendary (Cursor + Grok)

## Short description

The product was built in Cursor with Co-authored-by attribution. Grok Imagine draws one simple neutral vector of the person after the bounty form on `/post` is submitted, and generates name-free wanted-poster OG images for every hop link.

## Why Cursor + Grok specifically

1. **Imagine on post.** After `/post` submit, Grok Imagine draws a simple neutral vector portrait from the attributes-only description (`web/lib/imagine.ts`).
2. **Imagine as the link preview.** `wantedPrompt` is attributes-only; PNG stored on the bounty and served at `/api/og/[id]` (`web/lib/imagine.ts`).
3. **Track evidence.** WORKFLOW requires Cursor Agent commits with attribution; transcripts export to `cursor-transcripts/` for Devpost.

## Where in the code

| Piece | Path |
|---|---|
| Imagine (post + OG) | `web/lib/imagine.ts`, `POST` create-bounty hook, `/api/og/[id]` |
| VERIFY G notes | `PLAN.md` §7.5 |
| Flags | `GROK_ENABLED`, `XAI_API_KEY` |

**VERIFY G (partial):** Imagine path unit-tested; live image generation blocked without credits this session. Fallback: `GROK_ENABLED=false` (template OG).

## What judges see

- Submit a search on `/post` → neutral vector portrait when Grok is enabled.
- Share an `/h/…` link → wanted-card preview.
- Mention Cursor-built codebase / trailers in Q&A.
