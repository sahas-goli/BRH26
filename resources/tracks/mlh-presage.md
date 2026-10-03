# MLH: Best Use of Presage (sponsor, via MLH)

- **Winners:** 1
- **Prize:** Fitbit Inspire + Presage perks: 3 months of free development credits, 30% off usage charges for 1 year after launch.
- **Listed on:** Devpost + MLH prizes page (https://www.mlh.com/events/bigred-hacks-2026/prizes). Not in the organizer doc.

## Challenge
Integrate Presage's human-sensing to understand real-time physical and emotional state: heart rate, breathing rate, engagement, facial expression (camera-based). Use cases: games with dynamic difficulty from player excitement, contactless wellness/stress/fitness apps, accessibility/security, focus-monitoring productivity tools.

## Requirements
Use any Presage SDK.

## Judging
Not specified; demonstrate the "future of human-computer interaction."

## Theme tie-in
Accessibility/driver-state or user-state aware navigation. Pairs with MLH webcams and Pi kits.

## Resources / claiming
- Partner page: https://www.mlh.com/partners/presage (https://mlh.link/presage). Prize claim: no login.
- Sign up (free tier, API key): https://physiology.presagetech.com/auth/register
- SDK = **SmartSpectra**, camera-based (no wearables). Platforms: iOS 17+ (Swift), Android SDK 28+ (Kotlin), C++20 (macOS/Linux/Windows), Node.js 20+/Electron 28+. **No Python, web, or REST option.** Docs https://smartspectra.presagetech.com/docs, samples https://github.com/Presage-Security/SmartSpectra
- Metrics: pulse rate + HRV, breathing waveform/rate, face landmarks/iris/blink/speech, facial expression, relative arterial pressure waveform, quality/stability scores. Focus and emotion are advertised on MLH's page.
- Non-medical: not FDA-cleared, no diagnosis use.
- Setup shortcuts: Claude Code skill `npx skills add Presage-Security/SmartSpectra --skill using-smartspectra`; MCP server `https://mcp.presagetech.com/mcp` fetches keys + docs (key issues: support@presagetech.com).
- Demo app (iOS): https://presagetechnologies.com/sixth-sense | Discord https://discord.gg/K7KNmuX7KT | quickstart https://physiology.presagetech.com/quickstart

## Spoken
Prize: Fitbit. Any camera (phone or webcam) becomes a vitals sensor: breathing rate, heart rate, facial expression.
