# Photon iMessage track

## Short description

A Spectrum/`spectrum-ts` agent delivers bounty links in 1:1 iMessage threads, handles tapbacks/names for forwards, and sends nudges/found/paid messages under deterministic privacy rules.

## Why Photon specifically

1. Trusted channel: people already read iMessage; no new app install for relays.
2. Registered-number Pro line matches our privacy boundary (no mass spam).
3. Tapback / contact-card intake maps cleanly onto forward UX.
4. Rich link previews carry the Grok Imagine wanted card.

## Where in the code

- `agent/` (S1-01 echo, S1-05 flows), `POST /api/forward`, controller tick → `/send`
- Flags: `PHOTON_ENABLED`, `SPECTRUM_PROJECT_ID`, `SPECTRUM_PROJECT_SECRET`

## Demo look-at

Register a judge at the table; they receive a bounty, reply with a name, and a new edge appears on `/live`. Fallback: `/h` link on a phone if Photon is down.
