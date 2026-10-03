# MLH: Best Use of Gemini API (sponsor, via MLH)

- **Winners:** 1
- **Prize:** MLH swag kits (Devpost). 2025 prize was a mechanical keyboard.
- **Listed on:** Devpost + MLH prizes page (https://www.mlh.com/events/bigred-hacks-2026/prizes). Not in the organizer doc.

## Challenge
Push the boundaries of AI with Google Gemini. Examples: chatbots for personalized advice, apps that summarize complex research papers, creative generation (code, scripts).

## Requirements
Integrate the Google Gemini API.

## Judging
Not specified; innovative use of Gemini capabilities.

## Resources / claiming
- Partner page: https://www.mlh.com/partners/gemini (https://mlh.link/gemini). Prize claim: no login.
- **Free perks:** students get a 1-year free Google student plan (https://gemini.google/students/) plus $10/month credits via Google Program Benefits (https://developers.google.com/program/my-benefits); non-students: $300 new Google Cloud credit.
- API key: https://aistudio.google.com/apikey (env `GEMINI_API_KEY`). Prototype in AI Studio: https://aistudio.google.com/prompts/new_chat
- Install: `pip install -U google-genai` | `npm install @google/genai`. Quickstart uses `client.interactions.create(model=..., input=...)`; models shown: `gemini-3.8-flash` (default), `gemini-3.8-pro` (reasoning), `gemini-3.1-flash-image` (images). Model names as of 2026-10-02 fetch; re-check.
- Docs: https://ai.google.dev/gemini-api/ | quickstart https://ai.google.dev/gemini-api/docs/quickstart | cookbook https://github.com/google-gemini/cookbook
- Useful for Navigation: image understanding, function calling, Live API (real-time streaming), structured output (JSON).

## Spoken (MLH coach Farhan)
Prize: Google swag kit. Use Gemini anywhere in the project. Workshop: Intro to Google AI Studio, Sat after the Copilot workshop. His live demo used Gemini through the Cline VS Code extension to build and tunnel a chat app in about a minute.
