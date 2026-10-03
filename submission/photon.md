# Photon iMessage track

## Short description

A Spectrum (`spectrum-ts`) agent on the HACKWITHPHOTON Pro line delivers Six Hops personal links in 1:1 iMessage threads, turns tapbacks/names into forwards, and sends controller nudges plus found/paid messages — with deterministic privacy sanitization (no chain members, salts, or other handles).

## Why Photon specifically

1. **Trusted inbox.** Relays already read iMessage; we do not ask them to install an app.
2. **Registered-number boundary.** Pro shared line only messages allowlisted handles — matches “judges at the table,” not blast spam.
3. **Natural UX primitives.** Tapback / “yes” → ask for a name; name → `POST /api/forward`; “this is me” → claim URL.
4. **Rich previews.** Forwarded URLs render with the Grok Imagine wanted card (`og:image` from `/api/og/[id]`).

## Where in the code

| Piece | Path |
|---|---|
| Agent entry / providers | `agent/src/index.ts`, `agent/README.md` |
| Inbound flows | `agent/src/flows.ts` (`handleInboundText`, `handleReaction`) |
| Privacy rules | `agent/src/privacy.ts`, `agent/src/privacy.test.ts` |
| Web calls | `agent/src/web.ts` → `/api/h`, `/api/forward` |
| Nudges | `agent/src/tick.ts` → `POST /api/controller/tick` + `POST /send` |
| Flags | `PHOTON_ENABLED`, `SPECTRUM_PROJECT_ID`, `SPECTRUM_PROJECT_SECRET`, `AGENT_URL` |

**VERIFY A (partial):** Spectrum installs and terminal provider run without keys. Live registered forward + nudge + paid was not completed this weekend without Spectrum secrets.

## What judges see

1. Register the judge’s number at the table.
2. They receive a bounty link with wanted-card preview.
3. Reply with a first name → new edge on `/live`.
4. Fallback if Photon is down: open `/h/<token>` on a phone (PLAN §12).
