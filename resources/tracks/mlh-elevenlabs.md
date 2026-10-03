# MLH: Best Use of ElevenLabs (sponsor, via MLH)

## Challenge
Deploy natural, human-sounding audio with ElevenLabs: realistic, dynamic, emotionally expressive voices for any project, from interactive AI companions to narrated stories and voice-enabled apps.

## Requirements
Use ElevenLabs in the project. Nothing else listed.

## Judging
Not specified; best overall use of ElevenLabs.

## Build resources
- Partner page: https://www.mlh.com/partners/elevenlabs (short link https://mlh.link/elevenlabs).
- **Free perk:** 3-month free ElevenLabs subscription via promo code (MLH emails it during event week to registered hackers; redeem on the ElevenLabs signup page).
- API key: https://elevenlabs.io/app/settings/api-keys, put in `.env` as `ELEVENLABS_API_KEY`.
- Install: `pip install elevenlabs python-dotenv` | `npm install @elevenlabs/elevenlabs-js dotenv` | CLI `npm install -g @elevenlabs/cli`.
- Text-to-speech: SDK `text_to_speech.convert()` (text, voice id, output format e.g. `mp3_44100_128`); docs showed model `eleven_v4`, default voice "George" `JBFqnCBsd6RMkjVDRZzb`.
- Docs: quickstart https://elevenlabs.io/docs/quickstart, API reference https://elevenlabs.io/docs/api-reference/introduction, product guides https://elevenlabs.io/docs/product-guides/overview, full text for LLMs https://elevenlabs.io/docs/llms-full.txt
- Conversational agents: https://elevenlabs.io/docs/agents-platform/overview (`mlh.link/ElevenLabs-Agents`). Voice library: https://elevenlabs.io/app/voice-library. Demo + video: `mlh.link/elevenlabs-demo`, `mlh.link/elevenlabs-videos`.

## Verified 2026-10-03 (proposal research)

**Gotchas:** Free-plan credits run out fast (10k credits is about 10 minutes of TTS), so redeem the MLH promo code first. LLM cost is billed separately on agents (per third-party guides; the official page did not show it). The 'Best Use' judging is unpublished. Two voice stacks (Grok Voice for SpaceX plus ElevenLabs) in one product look like bolt-ons unless each has a distinct job, e.g., Grok as the realtime agent and ElevenLabs for SFX or spatial earcons, or per-character voices. Pick one realtime conversational engine.

**What judges rewarded at other 2025-2026 events:** Voice as the primary interface, both STT and TTS, ideally hands-free or eyes-free with a hardware form factor. Nearly everyone bolts on narration, so integrations count only if removing voice breaks the product (Conversational AI agents, voice cloning with a purpose, real-time duplex).

Examples: DivHacks 2026 winner: GRWM, a voice-controlled smart mirror on a Raspberry Pi with a motion sensor for swipe gestures. ElevenLabs handles both speech-to-text and spoken replies ('show my route', 'give me 20 more minutes'). Elsewhere it shows up as secondary narration in most 2026 winners (Julia's Time Machine tour guide, Leaf on Read talking trees, PAC-MANhattan, knowyourbuilding audio reports, Paradise demo narration, Nook voice guidance).

Sources: https://elevenlabs.io/docs/agents-platform/overview | https://elevenlabs.io/pricing | https://elevenlabs.io/pricing/api | https://elevenlabs.io/docs/overview/models.md | https://elevenlabs.io/docs/overview/capabilities/sound-effects.md | https://elevenlabs.io/docs/llms.txt
