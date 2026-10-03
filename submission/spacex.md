# SpaceX Make it Legendary (Cursor + Grok)

## Short description

Built in Cursor with attribution trailers; Grok Imagine wanted-card OG images; Grok Voice `/talk/[token]` with ephemeral tokens and tools `get_bounty` / `forward_to` / `claim`.

## Why SpaceX / Cursor + Grok specifically

1. Ephemeral voice tokens keep `XAI_API_KEY` off the browser.
2. Imagine link previews make every forwarded hop look like a wanted poster.
3. Whole-team Cursor evidence (Co-authored-by, transcripts) matches the track rubric.
4. Multilingual voice UX for holders who would rather speak than type.

## Where in the code

- `web/lib/imagine.ts`, `web/lib/grok.ts`, `/talk/[token]`, `POST /api/grok/token`
- Cursor transcripts export path (WORKFLOW §8)

## Demo look-at

Wanted card in a share preview; optional voice forward in a second language when `GROK_ENABLED=true`.
