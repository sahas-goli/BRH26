# MLH: Best Use of ElevenLabs (sponsor, via MLH)


## Challenge
Deploy natural, human-sounding audio with ElevenLabs: realistic, dynamic, emotionally expressive voices for any project, from interactive AI companions to narrated stories and voice-enabled apps.

## Requirements
Use ElevenLabs in the project. Nothing else listed.

## Judging
Not specified; best overall use of ElevenLabs.

## Theme tie-in
Audio navigation for blind/low-vision users (theme doc's own idea prompt).

## Resources / claiming
- Partner page: https://www.mlh.com/partners/elevenlabs (short link https://mlh.link/elevenlabs). MLH login on the prizes page needed for a claim code.
- **Free perk:** 3-month free ElevenLabs subscription via promo code (MLH emails it during event week to registered hackers; redeem on the ElevenLabs signup page).
- API key: https://elevenlabs.io/app/settings/api-keys, put in `.env` as `ELEVENLABS_API_KEY`.
- Install: `pip install elevenlabs python-dotenv` | `npm install @elevenlabs/elevenlabs-js dotenv` | CLI `npm install -g @elevenlabs/cli`.
- Text-to-speech: SDK `text_to_speech.convert()` (text, voice id, output format e.g. `mp3_44100_128`); docs showed model `eleven_v4`, default voice "George" `JBFqnCBsd6RMkjVDRZzb`.
- Docs: quickstart https://elevenlabs.io/docs/quickstart, API reference https://elevenlabs.io/docs/api-reference/introduction, product guides https://elevenlabs.io/docs/product-guides/overview, full text for LLMs https://elevenlabs.io/docs/llms-full.txt
- Conversational agents: https://elevenlabs.io/docs/agents-platform/overview (`mlh.link/ElevenLabs-Agents`). Voice library: https://elevenlabs.io/app/voice-library. Demo + video: `mlh.link/elevenlabs-demo`, `mlh.link/elevenlabs-videos`.
