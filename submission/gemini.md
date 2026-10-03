# Gemini API track

## Short description

`/post` free text is compiled into an attributes-only `HintCard` via Gemini structured output, with server-side sanitization that drops names and overlong strings.

## Why Gemini specifically

1. Structured JSON output matches our `HintCard` schema without brittle parsing.
2. Instruction-following to strip PII before storage.
3. Optional flag (`GEMINI_ENABLED`)—manual form fields work without the key.

## Where in the code

- `web/lib/hintcard.ts`, `/post` page, create-bounty path in `web/lib/bounty.ts`

## Demo look-at

Paste a messy ask on `/post`; show the compiled card with no personal names. If key missing, edit fields manually.
