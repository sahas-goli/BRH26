# Photon: Agents in iMessage using Photon (sponsor)

Source: https://somethingreat.notion.site/Hackathon-Guidelines-for-Photon-3dce443f36bb803696daf4135f063cd1 (Notion; extracted via its API; also on the slides). Awarded to the team that best uses Spectrum.

## Pitch
AI that coexists with us: present in conversations, attuned to context, trusted to act with taste. Agents that participate, not just assist.

## What you can build
- Agents that join human-to-human conversations to suggest, support, or participate
- AI companions that understand social context, emotion, tone
- Multi-agent systems collaborating with humans and each other
- Agents across interfaces: chat, voice, ambient

## Requirement
**Must integrate Spectrum**, Photon's open-source framework for bringing agents to all platforms. Connect the agent to iMessage via the dashboard.

## Judging
- Vision: pushes the frontier of hybrid intelligence?
- Craft: cohesive, responsive, tastefully integrated?
- Depth: handles real-world context and edge cases?
- Traction: could run with real users tomorrow?

What great looks like: real human-in-the-loop collaboration (not a prompt demo reel); context that persists across time, channels, teammates; a delightful default that does not demand attention; safety and fallback behavior that earns trust.

## Links
- Dashboard: https://app.photon.codes/dashboard (promo **HACKWITHPHOTON** = 1 free month Pro)
- Docs: https://photon.codes/docs/spectrum-ts/introduction | Spectrum https://photon.codes/spectrum | Brand kit https://photon.codes/brand
- Discord https://discord.gg/KhCRKNsx55 | X https://x.com/photonhq

## Verified 2026-10-03 (proposal research)

**Gotchas:** On Free and Pro (the HACKWITHPHOTON promo gives Pro), the shared line ONLY messages numbers registered in the dashboard Users tab. Anyone else gets 'Target not allowed'. Judges cannot just text the bot cold: add their numbers live at the table, or have a teammate's phone run the demo. The debug bot at debug.photon.codes shows the exact Apple handle (phone vs email) to register. Different recipients may see different sending numbers on shared lines. Group creation and location sharing are Business-only. Open GitHub issue photon-hq/advanced-imessage-ts#53: Find My location cards in Spectrum Cloud shared-line mode carry no lat/lng (the address field holds the sender handle). Do NOT build the demo around iMessage location on Pro; have users text an address or pin, or tap a web link that uses browser geolocation. One third-party source (Hermes agent docs) says shared lines can't start conversations with new targets and quotes free-tier limits of 5,000 msgs/server/day and 50 new conversations per line per day. Groups: existing groups appear supported, but Pro is 'Limited'; test early. Setup is roughly 15-30 minutes (account, project, users, keys). Judges score real human-in-the-loop, context that persists over time and across people and channels, safety and fallback, and readiness for real users tomorrow.

**What judges rewarded at other 2025-2026 events:** Agents that live in an existing human thread and act in the background: proactive check-ins rather than a Q&A bot. Native iMessage affordances (tapbacks, polls, voice notes, location, calls). Real human-in-the-loop moments, such as a trusted contact or friends' agents. Deterministic safety and fallback logic kept separate from the LLM. Something real people could text tomorrow. A multi-person or multi-agent angle helps (unsaid, PlansAroundUs), but the Pro plan cannot create group chats, so use 1:1 threads plus routing.

Examples: DivHacks 2026 winner: Nook, 'walks you home, right from iMessage'. Onboarding happens in iMessage (trusted contact, Find My location). It sends check-ins, reads tapbacks and voice notes, places Vonage calls for hands-free guidance, and stores location in TimescaleDB+PostGIS. Deterministic rules make the safety decisions; Gemini only words the messages. DivHacks 2026 second winner: News Next Door (Grok simplifies and translates civic alerts, ElevenLabs audio, delivered over iMessage). HackPrinceton Spring '26 (131 submissions) winner: Wavelength (Claude agent over Canvas, Google Calendar, Gmail and Slack, delivered over iMessage; adds events from flyer photos, detects conflicts). Photon's own showcase: naval.chat got 100+ users in a day. CROWDING: at least 8 of roughly 28 DivHacks 2026 winners ran on Photon (Nook, News Next Door, unsaid, PlansAroundUs, Key-o, Fit Check, PlaNYt, ExitNow), so it is popular wherever Photon reps attend. Photon's newsletter (May 14, 2026) says it doubles hackathon winnings for any win built with its SDK, even at events it does not sponsor. Verify the current terms.

Sources: https://photon.codes/docs/spectrum-ts/introduction | https://photon.codes/docs/spectrum-ts/getting-started | https://photon.codes/docs/spectrum-ts/providers/imessage | https://photon.codes/docs/spectrum-ts/providers | https://photon.codes/docs/spectrum-ts/providers/voice | https://photon.codes/docs/spectrum-ts/messages | https://photon.codes/docs/spectrum-ts/troubleshooting/imessage | https://photon.codes/docs/advanced-kits/imessage/getting-started | https://photon.codes/pricing | https://github.com/photon-hq/spectrum-ts | https://github.com/photon-hq/advanced-imessage-ts/issues/53 | https://hermes-agent.nousresearch.com/docs/user-guide/messaging/photon
