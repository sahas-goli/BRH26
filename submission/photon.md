# Photon iMessage track

## Short description

A registered holder gets a 1:1 iMessage with their personal link and hint card; a tapback or yes plus a first name creates the next hop; if the search stalls they get a nudge to pass it to someone closer; after the poster confirms they get a paid message with the Explorer link. Anyone not registered uses the copied link. Replies stay on the public hint card and that holder’s own links.

## Why Photon specifically

1. **Trusted inbox.** Relays already read iMessage, so the hop stays in that thread.
2. **Registered-number boundary.** A registered holder gets the 1:1 iMessage. Anyone else uses the copied personal link.
3. **Next hop.** A tapback or “yes”, then a first name, calls `POST /api/forward` and creates the next hop. “This is me” returns the claim URL.
4. **Stall and pay.** A stall nudge asks them to pass it to someone closer. After the poster confirms, the paid message includes the Explorer link.

## Where in the code

| Piece | Path |
|---|---|
| Agent entry / providers | `agent/src/index.ts`, `agent/README.md` |
| Inbound flows | `agent/src/flows.ts` (`handleInboundText`, `handleReaction`) |
| Privacy rules | `agent/src/privacy.ts`, `agent/src/privacy.test.ts` |
| Web calls | `agent/src/web.ts` → `/api/h`, `/api/forward` |
| Nudges | `agent/src/tick.ts` → `POST /api/controller/tick` + `POST /send` |
| Flags | `PHOTON_ENABLED`, `AGENT_URL` |

## What judges see

1. A registered holder gets a 1:1 iMessage with their personal link and hint card.
2. A tapback or yes, plus a first name, creates the next hop.
3. If the search stalls, they get a nudge to pass it to someone closer.
4. After the poster confirms, they get a paid message with the Explorer link.
5. Anyone not registered uses the copied link.
