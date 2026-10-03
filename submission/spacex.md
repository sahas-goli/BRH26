# SpaceX Make it Legendary (Cursor + Grok)

## Short description

The product was built in Cursor with Co-authored-by attribution. Grok Imagine generates name-free wanted-poster OG images for every hop link. Grok Voice powers `/talk/[token]`: server-minted ephemeral tokens, browser WebSocket, tools `get_bounty` / `forward_to` / `claim`.

## Why Cursor + Grok specifically

1. **Ephemeral voice secrets.** `POST /api/grok/token` mints via `https://api.x.ai/v1/realtime/client_secrets`; the browser uses `xai-client-secret.*` — raw `XAI_API_KEY` never ships to the client (`web/lib/grok.ts`).
2. **Imagine as the link preview.** `wantedPrompt` is attributes-only; PNG stored on the bounty and served at `/api/og/[id]` (`web/lib/imagine.ts`).
3. **Track evidence.** WORKFLOW requires Cursor Agent commits with attribution; transcripts export to `cursor-transcripts/` for Devpost.
4. **Multilingual holders.** Voice session instructions tell Grok to help in the user’s language (20+).

## Where in the code

| Piece | Path |
|---|---|
| Imagine | `web/lib/imagine.ts`, `POST` create-bounty hook, `/api/og/[id]` |
| Voice mint + tools | `web/lib/grok.ts`, `web/app/api/grok/token/`, `web/app/talk/[token]/` |
| VERIFY G notes | `PLAN.md` §7.5 |
| Flags | `GROK_ENABLED`, `XAI_API_KEY` |

**VERIFY G (partial):** Endpoints unit-tested; live mint blocked without credits this session. Fallback: `GROK_ENABLED=false` (template OG / drop voice).

## What judges see

- Share an `/h/…` link → wanted-card preview.
- Optional: “Talk instead” → speak a forward in another language when Grok is enabled.
- Mention Cursor-built codebase / trailers in Q&A.
