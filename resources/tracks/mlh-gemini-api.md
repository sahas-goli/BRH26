# MLH: Best Use of Gemini API (sponsor, via MLH)


## Challenge
Push the boundaries of AI with Google Gemini. Examples: chatbots for personalized advice, apps that summarize complex research papers, creative generation (code, scripts).

## Requirements
Integrate the Google Gemini API.

## Judging
Not specified; innovative use of Gemini capabilities.

## Resources / claiming
- Partner page: https://www.mlh.com/partners/gemini (https://mlh.link/gemini). MLH login: not needed.
- **Free perks:** students get a 1-year free Google student plan (https://gemini.google/students/) plus $10/month credits via Google Program Benefits (https://developers.google.com/program/my-benefits); non-students: $300 new Google Cloud credit.
- API key: https://aistudio.google.com/apikey (env `GEMINI_API_KEY`). Prototype in AI Studio: https://aistudio.google.com/prompts/new_chat
- Install: `pip install -U google-genai` | `npm install @google/genai`. Quickstart uses `client.interactions.create(model=..., input=...)`; models shown: `gemini-3.8-flash` (default), `gemini-3.8-pro` (reasoning), `gemini-3.1-flash-image` (images). Model names as of 2026-10-02 fetch; re-check.
- Docs: https://ai.google.dev/gemini-api/ | quickstart https://ai.google.dev/gemini-api/docs/quickstart | cookbook https://github.com/google-gemini/cookbook
- Useful for Navigation: image understanding, function calling, Live API (real-time streaming), structured output (JSON).
