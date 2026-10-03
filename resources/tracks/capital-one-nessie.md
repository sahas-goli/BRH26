# Capital One: Best Use of Nessie (sponsor)

Pitched as "How will you reimagine banking?"

## Challenge
Reimagine the banking experience with Capital One's hackathon API **Nessie** (http://api.nessieisreal.com): mock accounts, merchants, bills, peer-to-peer transactions. Creatively integrate Nessie's endpoints to improve users' financial lives.

## Requirements
Use the Nessie API. Judging: innovative financial application (no published rubric).

## Links
- Nessie API: http://api.nessieisreal.com | Capital One: https://www.capitalone.com/
- Key signup steps not in the organizer materials; get a key from the Nessie site.

## Verified 2026-10-03 (proposal research)

**Facts:** LIVE as of 2026-10-03 ~03:50 UTC (tested with curl from the Cornell network). The HTTPS API at https://api.nessieisreal.com runs on AWS API Gateway, with keys passed as ?key=. GET /atms returned 13 ATMs, all in Arlington VA, with geocode, hours, accessibility and languages; lat/lng/rad filters were ignored. /branches returns Arlington branches with addresses, hours and notes. /accounts, /customers and /merchants return [] for a fresh key. /enterprise/accounts, /enterprise/customers (1,321), /enterprise/merchants (1,417, each with geocode lat/lng and category), /enterprise/bills (1,640) and /enterprise/transfers (274) return everyone's shared sandbox data. Other teams are actively using it; accounts are dated 2026-09-19. Unknown top-level paths (/bills, /purchases, /loans) return API Gateway 'Missing Authentication Token'. In the classic API those are nested under /accounts/{id}/..., which matches what I saw. Key signup per secondary sources: GitHub login on the api.nessieisreal.com web portal, then the key is shown on the profile page. Official SDKs exist on GitHub under nessieisreal (JS, Python, Ruby, Go, iOS).

**Gotchas:** Plain HTTP (port 80), where the docs and signup portal have historically been served, RESETS the connection from the Cornell network. HTTPS works. Connections to example.com over HTTP were fine, so this is specific to Nessie (blocking or an outage). Signing up for a key may need another network or a phone hotspot, or ask the Capital One table. GETs with a bogus key ('test') returned 200 data. Key validation looks lax but writes (POST customers/accounts/transfers) are UNTESTED; I did not write to the shared sandbox. No key gave a 502. /enterprise/deposits timed out once. ATM and branch data is DC-area only and useless for Ithaca. Create your own merchants with Ithaca geocodes and your own purchases and transfers for the demo. No published judging rubric beyond 'reimagine banking'. Since everything is mock data, make Nessie load-bearing through transfers, bills or purchases that drive the product's logic.

**What judges rewarded at other 2025-2026 events:** Nessie used as a real money mechanism inside a non-banking workflow (escrow, a split, a holdback, a funded commitment) rather than a spending dashboard. Visible account, transfer or bill calls in the demo. A 'reimagine banking' story. A trust or guardrail element (authorization before money moves) shows up in both 2026 DivHacks winners.

Examples: DivHacks 2026 (2 winners): unsaid, where each friend DMs a personal iMessage agent their private budget, diet and commute limits; agents negotiate in rounds and post a native iMessage poll of 3 venues; Nessie supplies spending-pattern analysis. Also RentEscrow, which simulates an escrow account in the Nessie sandbox for tenant-landlord repair disputes with a guarded settlement flow. TAMUhack 2026 (176 submissions): Drift, which builds customer profiles and transactions from Nessie and runs a Monte Carlo goal simulator. Older generic winners and entries are budgeting dashboards (Money Hog, SpendSmart), which is the low bar.

Sources: https://api.nessieisreal.com/atms?key=test (curl) | https://api.nessieisreal.com/enterprise/merchants?key=test (curl) | https://api.nessieisreal.com/enterprise/accounts?key=test (curl) | https://nessieisreal.com/ | https://github.com/nessieisreal/nessie-javascript-sdk
