# Cursor transcript exports

SpaceX-track evidence (PLAN.md §13, WORKFLOW.md §8). At **05:00**, each person exports their Cursor Agent chat transcripts into their role folder below. Keep Settings → Agents → Attribution on so commits keep `Co-authored-by: Cursor` trailers.

The 60-second Cursor screen recording for the Devpost video is **not** this task (see AL-04 / WORKFLOW §8).

## Folders

Export into `cursor-transcripts/<role>/` only:

| Role | Folder |
|---|---|
| SWE1 | `cursor-transcripts/SWE1/` |
| SWE2 | `cursor-transcripts/SWE2/` |
| SWE3 | `cursor-transcripts/SWE3/` |

Do not put transcripts in the repo root or under another role's folder.

## Strip secrets before any later commit

Before copying or committing anything from a chat export:

- Remove `.env`, `.env.local`, and any pasted env blocks
- Remove API keys, tokens, passwords, connection strings, and keypair material
- Remove private Solana secrets, Nessie keys, `INTERNAL_SECRET`, and similar
- Prefer redacting to `[REDACTED]` over deleting the whole turn when context still matters

This README task does **not** add transcript files. When exports land later, they must already be scrubbed.

## Export status

| Role | Status |
|---|---|
| SWE1 | not exported yet |
| SWE2 | not exported yet |
| SWE3 | not exported yet |
