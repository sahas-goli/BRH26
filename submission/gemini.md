# Gemini API track

## Short description

The `/post` free-text path calls Gemini with a JSON schema matching `HintCard` + hidden cues. The server re-validates: unknown keys dropped, strings capped, names/streets rejected — so the public card is attributes-only by construction.

## Why Gemini specifically

1. **Structured output** maps onto our contract (`city`, `organizationType`, `field`, `skill`, `language`, `experience`) without brittle regex.
2. **PII instruction + server sanitize** — model drops names; `sanitizeCompiledHint` enforces it again (`web/lib/hintcard.ts`).
3. **Optional.** `GEMINI_ENABLED=false` (default): posters edit hint fields manually; the rest of the MVP still runs.

## Where in the code

| Piece | Path |
|---|---|
| Compiler + sanitize | `web/lib/hintcard.ts`, `web/lib/hintcard.test.ts` |
| Wired from bounty create | `web/lib/bounty.ts` (`compileHint` when `GEMINI_ENABLED=true`) |
| UI | `web/app/post/` |
| Env | `GEMINI_API_KEY`, `GEMINI_MODEL` (see `.env.example`) |

## What judges see

Paste a messy ask (“someone on a launch ops team near Starbase who soldered QFNs”) → card shows city/field/skill only, no personal name. If the key is missing, fill the form fields and continue.
