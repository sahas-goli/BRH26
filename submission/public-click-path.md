# Public-site read-aloud click path (AL-14)

Host: [https://brh26-brh-26.vercel.app](https://brh26-brh-26.vercel.app)  
Checked 2026-10-03. No local server, no `seed:demo`, no filming. Spoken lines are for a person clicking live.

Product facts (do not invent past these): friend-to-friend bounty; forward ≤ 3; depth capped; attributes-only city-level hints; claim is an introduction and the poster confirms before pay; no hardware/badges/venue game.

## `/` — home

**On screen:** Brand **SIX HOPS**, headline “Find your person. One friend at a time.”, short how-it-works copy (hint card → up to three people → at most eight hops → opt-in → chain paid). Primary CTA **Start a search** → `/post`. Link **Watch the search** → `/live`. **FEATURED SEARCH** block titled “A connection in the making” with empty line: “No featured search is available right now.” Demo note about test/simulated money.

**Spoken:** “This is Six Hops: you describe who you need, friends pass the card closer, and only the successful chain gets paid.”

## `/post` — start a search

**On screen:** Form “Who do you need to connect with?” Free-text box plus attributes-only hint fields (city, field, skill, language, experience, organization type). Cap and duration inputs. Copy that names and street addresses are stripped. Button **Create search →**. Nav links back to `/` and `/live`.

**Spoken:** “Here you post a search with attributes only—no names, no street addresses—and set a reward cap.”

## `/live` — demo board

**On screen:** Full demo dashboard: **CASCADE** graph, **BRANCHING FACTOR B** gauge (example reading around 1.00 with threshold 2.0), per-minute flow, Nessie balances panel, attack slider (ours vs MIT), replay/sweep charts, winning salts, watch/bounty id. Shows a replay-style bounty such as `r_0000` (status expired in this visit).

**Spoken:** “Live is the cascade board: you see the graph, the branching gauge, and the attack comparison while a search runs.”

## Missing clicks

No public `/h/[token]` or `/claim/[token]` link appears on `/`, `/post`, or `/live` in this visit, so a hop or claim click path is **missing** until a real token is shared. Do not invent a token. `/h/` and `/claim/` without a token return 404.
