# MLH: Best Use of Gemini API (sponsor, via MLH)

## Challenge
Push the boundaries of AI with Google Gemini. Examples: chatbots for personalized advice, apps that summarize complex research papers, creative generation (code, scripts).

## Requirements
Integrate the Google Gemini API.

## Judging
Not specified; innovative use of Gemini capabilities.

## Build resources
- Partner page: https://www.mlh.com/partners/gemini (https://mlh.link/gemini).
- **Free perks:** students get a 1-year free Google student plan (https://gemini.google/students/) plus $10/month credits via Google Program Benefits (https://developers.google.com/program/my-benefits); non-students: $300 new Google Cloud credit.
- API key: https://aistudio.google.com/apikey (env `GEMINI_API_KEY`). Prototype in AI Studio: https://aistudio.google.com/prompts/new_chat
- Install: `pip install -U google-genai` | `npm install @google/genai`. Quickstart uses `client.interactions.create(model=..., input=...)`; models shown: `gemini-3.8-flash` (default), `gemini-3.8-pro` (reasoning), `gemini-3.1-flash-image` (images). Model names as of 2026-10-02 fetch; re-check.
- Docs: https://ai.google.dev/gemini-api/ | quickstart https://ai.google.dev/gemini-api/docs/quickstart | cookbook https://github.com/google-gemini/cookbook
- Other capabilities in the docs: image understanding, function calling, Live API (real-time streaming), structured output (JSON).

## Verified 2026-10-03 (proposal research)

**Gotchas:** Most crowded track, so a Gemini wrapper won't stand out. Maps grounding is English-only, not in all regions, and has strict attribution rules: sources must immediately follow the content, be viewable within one interaction, and carry unmodified 'Google Maps' text and links. The documented fields include NO routes, travel times or opening-hours structure; it grounds place facts, not routing. It cannot be used inside the Live API (per the Live tools table), so a realtime voice loop must call a separate generateContent with the google_maps tool via function calling. The Live tools doc only lists 3.1 and 2.5 Live models; verify 3.8-live tool support before relying on it. Robotics-ER is a preview model, so expect rate limits.

**What judges rewarded at other 2025-2026 events:** The most crowded track. Wins go to multimodal or spatial reasoning that is visibly essential (vision, grounding, verification), not text chat. Only worth targeting if Gemini is truly the core reasoning engine.

Examples: BRH 2025: Bear Escape (also Design). DivHacks 2026: Fit Check (LiDAR room scan, furniture listings texted via iMessage, Gemini as a 'conversational spatial assistant' that checks physical feasibility). Gemini appears in the large majority of winners at every event checked.

Sources: https://ai.google.dev/gemini-api/docs/maps-grounding | https://ai.google.dev/gemini-api/docs/pricing | https://ai.google.dev/gemini-api/docs/live | https://ai.google.dev/gemini-api/docs/live-tools | https://ai.google.dev/gemini-api/docs/live-session | https://ai.google.dev/gemini-api/docs/models/gemini-robotics-er-2-preview
