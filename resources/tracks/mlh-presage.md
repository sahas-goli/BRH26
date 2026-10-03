# MLH: Best Use of Presage (sponsor, via MLH)

## Challenge
Integrate Presage's human-sensing to understand real-time physical and emotional state: heart rate, breathing rate, engagement, facial expression (camera-based). Use cases: games with dynamic difficulty from player excitement, contactless wellness/stress/fitness apps, accessibility/security, focus-monitoring productivity tools.

## Requirements
Use any Presage SDK.

## Judging
Not specified; demonstrate the "future of human-computer interaction."

## Build resources
- Partner page: https://www.mlh.com/partners/presage (https://mlh.link/presage).
- Sign up (free tier, API key): https://physiology.presagetech.com/auth/register
- SDK = **SmartSpectra**, camera-based (no wearables). Platforms: iOS 17+ (Swift), Android SDK 28+ (Kotlin), C++20 (macOS/Linux/Windows), Node.js 20+/Electron 28+. **No Python, web, or REST option.** Docs https://smartspectra.presagetech.com/docs, samples https://github.com/Presage-Security/SmartSpectra
- Metrics: pulse rate + HRV, breathing waveform/rate, face landmarks/iris/blink/speech, facial expression, relative arterial pressure waveform, quality/stability scores. Focus and emotion are advertised on MLH's page.
- Non-medical: not FDA-cleared, no diagnosis use.
- Setup shortcuts: Claude Code skill `npx skills add Presage-Security/SmartSpectra --skill using-smartspectra`; MCP server `https://mcp.presagetech.com/mcp` fetches keys + docs (key issues: support@presagetech.com).
- Demo app (iOS): https://presagetechnologies.com/sixth-sense | Discord https://discord.gg/K7KNmuX7KT | quickstart https://physiology.presagetech.com/quickstart

## Verified 2026-10-03 (proposal research)

**Gotchas:** Warm-up: confidence starts at 0. Pulse needs about 12 s, breathing 30 s, HRV/stress 60 s, which eats a 2-minute pitch, so start capture before the judge arrives or show the waveforms. Needs at least 25 fps sustained, even diffuse light (hackathon fluorescents may flicker), one centered face, and no talking during breathing measurement. Breathing needs a stationary camera and visible upper chest. A laptop webcam or Logitech USB webcam works. Use monotonic timestamps (process.hrtime.bigint()/1000n) or you get kNonMonotonicTimestamp errors. Electron CSP must allow blob: in worker-src. Intel Macs are not listed for Node. Linux arm64 support implies it may run on the DGX Spark (Ubuntu arm64) or a Pi 5 (Bookworm glibc 2.36); that is an untested inference. Non-medical: not FDA-cleared. Production pricing is by contact. Setup shortcuts: Claude Code skill `npx skills add Presage-Security/SmartSpectra --skill using-smartspectra` and the MCP server at mcp.presagetech.com/mcp.

**What judges rewarded at other 2025-2026 events:** Vitals as a live control signal in a closed loop (game difficulty, AI tactics, pacing, alerts), not a dashboard readout. A demo where the judge's own face drives the system. Field is very small because of native-only SDK friction (iOS 17+, Android, C++20, Node/Electron) and API-key or model-loading issues. A working integration on a Mac, iPhone or Linux box is close to winning by default. Get the API key and test the cardiac model in the first hour, and keep a fallback ready.

Examples: TAMUhack 2026 MLH Presage winner: Helm, a real-time security threat detector built on the C++ SmartSpectra SDK + OpenCV on Linux (WSL), fusing pulse, breathing and visual cues; the team reported pain running it on Windows. TAMUhack 2026 3rd Overall Software: Haggle, a salary-negotiation trainer. The iPhone SmartSpectra app turns HR, breathing and speech into a stress score every 2 s, and Gemini adapts the opponent's tactics live (with ElevenLabs Conversational AI). HackTropica 2K26 MLH Presage winner: SoloFit, which reads phone-camera HR into a workout readiness score via the Presage Physiology REST API, reverse-engineered from a Python client. So a REST/upload path exists even though the repo notes say there is none. Breathing confidence is 0 until a 30 s window completes, and uploads cap at 10 MB. Hack Canada 2026: StoryDrift (iOS SmartSpectra vitals every 5 s drive a 'Drift Score' that paces a bedtime story; won a different prize). HackRice 16: DREAD, a horror game where the Node SDK's cardiac model never loaded on their key, forcing a green-channel rPPG fallback.

Sources: https://smartspectra.presagetech.com/docs | https://smartspectra.presagetech.com/docs/nodejs.md | https://smartspectra.presagetech.com/docs/measurement-quality.md | https://smartspectra.presagetech.com/docs/data-types.md | https://presagetech.com/for-developers
