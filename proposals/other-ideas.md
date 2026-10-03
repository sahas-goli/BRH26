# Other ideas (not selected)

Researched 2026-10-03. A 7-lens brainstorm produced 21 raw ideas. A selection pass merged and cut them to 8 candidates. Each candidate had two independent originality searches (commercial products; research, Devpost and GitHub) and a skeptical verdict, then a 3-judge panel scored it. The top four by expected track wins became full proposals ([index](README.md)). Everything else is kept here so the research is not lost.

"Panel" numbers are the average of the 3 judges' per-track win probabilities. They are rough priorities, not predictions. "E" is the sum across tracks (expected number of wins). "BR" is the BigRed score out of 10.

## Screened runners-up

### Fingerpath (E 0.89, BR 7.3; originality: qualified)
**A tactile map that guides your hand.** A servo linkage moves a blind traveler's fingertip along a 3D-printed relief of tomorrow's route (Kleinberg's own Collegetown Bagels to Gates Hall walk). The narrating voice cannot say "left" unless the route geometry says left. An orientation-and-mobility instructor can report a change by iMessage, and the narration attributes it with its age.

- **Panel strengths:** Hardware 0.25, ElevenLabs 0.16, BigRed 0.15, Design 0.10. Second-highest BigRed score of all eight, and the strongest literal answer to Kleinberg's left/right problem.
- **Originality:** no well-known product does it, but every component has research precedent: [Jiang et al. LLM Trip Preview Assistant with fingertip feedback](https://www.sciencedirect.com/science/article/abs/pii/S1071581925002393), [Touching Space (Gemini + OSM pre-travel preview)](https://arxiv.org/html/2604.14637), [Nomura's Fingertip Guiding Manipulator](https://link.springer.com/chapter/10.1007/978-3-540-70540-6_126), [Cobot Tactile Display](https://pmc.ncbi.nlm.nih.gov/articles/PMC9230892/), [PantoGuide](https://dl.acm.org/doi/abs/10.1145/3373625.3418023). Claim novelty only for the **claims ledger**: every spoken spatial claim must be GEOMETRY (computed), HUMAN (source, timestamp, expiry), or UNCONFIRMED; a deterministic verifier blocks untagged spatial words before speech. The arm is that ledger's physical output.
- **Why it lost:** all three judges named the same fatal risk. Hobby servos on a 5-bar linkage under a resting finger are jerky and imprecise, and a stuttering arm kills both the Hardware win and the wow. The tile is a single overnight print. Nobody on the team is blind or an O&M instructor, so expect credibility questions. Revisit if the hardware teammate is confident in smooth motion (better servos or a 2-axis gantry).

### LastSwipe (E 0.90, BR 5.7; originality: qualified)
**Posted hours say open; payments say whether they will still serve you.** An iMessage errand navigator that treats card payments (Nessie purchases mirrored into Tiger Data) as proof of service. It predicts each place's real last-service time tonight, routes errands against those deadlines, and refuses to name a place it has no fresh evidence for.

- **Panel strengths:** Capital One Nessie 0.30, Tiger Data 0.21, Photon 0.10. The best Nessie fit of any idea, with a direct Kleinberg hook ("closed since 2018").
- **Originality:** the inference method is the sponsor's own prior art: [Capital One's hours-from-authorizations patents](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10621522), [Mastercard Places API](https://developer.mastercard.com/places/documentation/use-cases/use-cases-1/), [Visa Back to Business Locator](https://www.visa.ca/en_CA/support/small-business/back-to-business-project.html), [Google live busyness and "may be closed by the time you arrive"](https://blog.google/products-and-platforms/products/maps/maps101-popular-times-and-live-busyness-information/), [Gemini Maps grounding](https://ai.google.dev/gemini-api/docs/maps-grounding). Differentiation: answer "will they still serve me when I arrive?" (a deadline) rather than "is it open?" (a label), and abstain below a k-anonymity floor.
- **Why it lost:** every interesting signal is synthetic history the team writes, so judges cannot validate the key claim at the table. Nessie writes are untested in the shared sandbox, and plain HTTP to Nessie resets on the Cornell network. Hardware is thin. Absorbed: **Receipts** (same transaction-heartbeat core plus a Solana bounty for human verifiers; the second ledger was confusing).

### YieldFarm (E 0.82, BR 4.8; originality: qualified)
**A right-of-way market for self-driving cars.** At an intersection the car in a hurry pays and the car that waits gets paid, settled on Solana in about a second, shown live on a tabletop intersection of 3D-printed robot cars. Revised to be "farm-proof": the waiting car is paid only for a wait the intersection controller physically saw and signed.

- **Panel strengths:** Solana 0.33 (the best Solana fit found), Hardware 0.13, GoDaddy 0.11, Tiger Data 0.10.
- **Originality:** the core loop already exists. [Chorus Mobility won MOBI Grand Challenge 2019](https://devpost.com/software/chorus-mobility-decentralized-technology-msg-project) with nearly the same auction; see also [US 11017665 B1](https://patents.google.com/patent/US11017665B1/en), [GM Cruise US 11373521](https://patents.google.com/patent/US11373521), [Lin & Jabari 2022](https://arxiv.org/abs/2001.01813), [ETH Zurich karma mechanisms](https://arxiv.org/pdf/2207.00495). Only the signed proof-of-presence layer is new.
- **Why it lost:** weakest BigRed fit (does not help anyone navigate today), the "rich people buy green lights" objection at every table, and printed-car propulsion depends on unknown MLH stock. Mostly a single-sponsor (Solana) play.

### Same Sky, lookupwith.us (E 0.80, BR 5.5; originality: **fail**)
**See the same planet or satellite as someone far away, at the same moment.** An iMessage agent finds a time when a target is up, dark and clear at both sites; 3D-printed pan-tilt pointers in each home aim at it and pulse together when both people are looking. Absorbed: **Flyby** (Starlink/ISS pass planning with friends, Grok Voice guide, live satellite pointer).

- **Originality:** fails the subfeature test. [Night Sky's Connected Stargazing](https://apps.apple.com/us/app/night-sky/id475772902) (also [Space.com review](https://www.space.com/night-sky-stargazing-app-review)) already lets remote users on a FaceTime call find the same object with LLM voice guidance; [TogetherMoon](https://togethermoon.com) checks two-city Moon visibility; [Moon Post Service](https://www.moonpostservice.com/) and [AGSatTrack Mutual Observer](https://agsattrack.com/) cover the rest. The only surviving angle is zero-install (partner never installs anything), asynchronous scheduling, and a physical pointer.
- **Why it lost:** originality fail, indoor daylight judging forces a simulated sky, and its navigation link is the thinnest of the eight.

## Merged into a finalist or runner-up

| Idea | One-liner | Went into |
|---|---|---|
| Starfix (3 lens versions) | Check GPS against the stars with a 3D-printed star tracker | Starfix (nogps.club) proposal; the versions contributed the timekeeper "mark" role, clock-skew trick, pistol grip, spoofer drag pattern, and a stretch CelesTrak satellite-geometry check |
| Shhortcut | Ask for the calm way through a building; route built only from what sensors saw seconds ago, every left/right checked against your facing | Halflife. "Calm route" is a cliche the keynote invites, and the tabletop floor plan resembled RouteRepair. Kept: facing-encoded left/right checks, stale-sensor "I don't know" |
| Quietway | iMessage agent routing sensory-sensitive people around live noise, crowding and light | Halflife. Near-duplicate of Shhortcut; overlaps Calm Routes, SENSEA, Louie |
| Receipts | Walking guide that names a place only with fresh evidence it is open; pays a nearby human on Solana to check | LastSwipe |
| Flyby | Turn the next visible Starlink/ISS pass into a plan with friends; Grok Voice guide and pointer | Same Sky |

## Dropped

| Idea | One-liner | Why dropped |
|---|---|---|
| Recalculating | Turn-by-turn directions through a cash shortfall: cheapest route to payday, executed in your bank, bridge from a friend over iMessage | Strong Nessie play, but metaphorical "GPS for money" scores lower on theme, the hardware teammate is idle, and the co-pilot funding resembles the team's funded-fallback idea. **Runner-up if a pure fintech entry is wanted.** |
| Common Ground | iMessage agent picks where a group goes from private constraints (budget read from bank, diet, mobility) | Near-copy of *unsaid*, the DivHacks 2026 Photon + Nessie winner; Roamly also covers private group preferences |
| Baton | Self-driving-car navigation that plans the handoff to the driver; camera reads readiness; printed wheel stays retracted until ready | Acted drowsiness reads as a cliche and an existing L3-car feature; Presage is unreliable on a talking, moving driver |
| FeltPath | Clip-on wheelchair kit learns which routes hurt this rider from chair vibration plus camera vitals | False sensor assumption: Presage needs a still face and 12-30 s windows, so it cannot attribute a response to a 2-second bump. Accessibility routing is also covered ground (Pathway won BRH 2024) |
| Point Taken | Wearable turns a stranger's pointing and spoken directions into checked haptic guidance for blind travelers | Overlaps Fingerpath's users with a riskier demo (blindfolded walk across a loud science fair); haptic-wearable cliche |
| Runaround | Turn-by-turn directions through bureaucracy (SSN to driver's license) for international students, re-verified by students who were just there | No hardware, only Photon (the most crowded sponsor track), legal/immigration liability, echoes RouteRepair's verify-before-release loop |
| Chase the Light | Voice CAPCOM plans a lunar south-pole traverse that stays in sunlight and radio view, on screen and on a 3D-printed Moon | Third SpaceX + Tiger + printed-terrain candidate; NASA Moon Trek already does lighting and traverse planning; one long terrain print is the critical path |
