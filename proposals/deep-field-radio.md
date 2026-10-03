# Deep Field Radio - A radio that cannot know the future

**Recommendation: build a 3D-printed radio that navigates 30+ years of astrophysics by topic and by year, and that never speaks a sentence unless a paper published by the year on its dial supports it.**

Researched 2026-10-02 for a team of three software engineers and one hardware person. Priorities below reflect sponsor fit, build cost and demonstration quality. They are not predicted wins; entrant counts are unknown.

## The idea

**Who it is for:** students choosing a research area, science-curious visitors, and library or museum kiosks. Cornell is a natural home: it has run arXiv since 2001.

**The problem:** search only helps if you already know what to ask, and the astrophysics literature is too large to browse. LLMs converse well but blend eras: asked about 1996, they answer with what was learned later. Telling a model to "pretend it is 1996" does not fix this; prompted models still leak post-cutoff knowledge ([Simulated Ignorance Fails](https://arxiv.org/html/2601.13717)). This is the freshness and correctness problem from Jon Kleinberg's keynote ([theme notes](../resources/02-theme-navigation.md)) applied to knowledge: every fact has a date.

**How it works:**

- **Two dials.** The Topic dial tunes through about 150 idea "stations", with static in the gaps. The Year dial is a large detented knob with a 4-digit year display and an LED signal meter; it sets what the radio is allowed to know. A servo needle shows the current station.
- **Corpus.** About 400k astro-ph abstracts from the Kaggle arXiv metadata snapshot. Each paper is dated by its arXiv v1 submission (`versions[0].created`), never by `update_date`, later versions or journal-ref, which are known leak paths. Abstracts are embedded overnight on the DGX Spark with a small 384-dimension model that also runs on a laptop for live queries, then clustered into stations. Call signs come from c-TF-IDF distinguishing terms, which is Kleinberg's trick of labeling dense map regions with their characteristic words; the top 30 are named by hand. A nearest-neighbor chain over cluster centroids assigns frequencies so adjacent stations are related.
- **Ask, verify, then speak.** Push-to-talk audio goes to Grok speech-to-text, then to a Grok text model with three tools: `tune`, `ask` and `route`. `ask` retrieves only papers with a v1 date on or before the end of the dial year. Before Grok text-to-speech says anything, a verifier checks the draft: (a) no term whose first appearance in the corpus is after the dial year; (b) every sentence cites a retrieved paper dated on or before the dial year and is semantically close to that paper's abstract. A failed draft is regenerated with the reason. After two misses the radio refuses in character: "That hasn't been discovered yet in 1996" or "Nothing on my 1996 shelf covers that."
- **Watching ideas get born.** Sweeping the Year dial fires short "first heard" bulletins, computed with Kleinberg's burst-detection automaton ("Bursty and Hierarchical Structure in Streams", 2002) over yearly term counts. The meter reads a station-by-year continuous aggregate in Tiger Data.
- **Routing through idea space.** "Route me from hot Jupiters to fast radio bursts" makes the needle hop station to station using the greedy rule from Kleinberg's small-world navigation work: each hop moves to the neighboring station closest to the destination, with a shortest-path fallback if greedy stalls. Stations with no papers yet at the dial year are off the air and cannot be routed through.
- **Measured leak rate.** A 15-question eval asks time-sensitive questions (dark energy, hot Jupiters, fast radio bursts, gravitational waves) at one dial year before and one after each discovery. It compares raw Grok prompted with "answer as of year X" against Deep Field. Both measured rates appear on screen and in the Devpost.

Grok Imagine paints cover art for the top stations. Everything is built in Cursor.

**Navigation fit:** the theme's Exploration and Discovery prompt asks teams to "reimagine how we search, surface, and stumble upon information", and organizers said navigation can be "metaphorical, like internet search". The radio uses three of Kleinberg's own ideas (region labeling, burst detection, greedy routing) and answers his open problem by enforcing as-of correctness. The claim is not "a map of arXiv" or "chat with papers". It is verified, cited correctness at any year, navigated with your hands.

## The two-minute demonstration

1. **Hook (0:00).** "AI can't stop knowing the future. We built a radio that can't."
2. **Tune (0:10).** A judge turns the Topic dial through static until a station locks: "Station 91.3, Exoplanet Atmospheres", with call-sign terms, cover art and three cited papers.
3. **Sweep time (0:25).** The judge turns the Year dial back to 1994 and the meter nearly dies. Turning forward, the meter climbs and bulletins fire as terms such as "hot Jupiter" begin to burst.
4. **Payoff (0:45).** At 1996 the judge holds the button and asks, "What is the expansion of the universe doing?" The screen shows "checking the 1996 shelf". The radio answers that the open question is how fast expansion is slowing, with every sentence cited to a paper from 1996 or earlier. Beside it, raw Grok told to answer as of 1996 mentions "dark energy", and the same verifier flags the term in red with the year the corpus first saw it.
5. **Turn the year (1:10).** Without re-asking, the judge turns the dial to 1999. The answer flips to accelerating expansion and dark energy, citing the 1998 supernova preprints.
6. **Proof (1:25).** The eval card shows the measured leak rates of raw Grok and Deep Field on the same questions.
7. **Navigate (1:35).** The judge spins the Year dial to 2026 (fast radio bursts are off the air until 2007) and says, "Route me from hot Jupiters to fast radio bursts." The needle hops across the band by itself, naming each station, and locks on.
8. **Close (1:50).** Corpus size, live Tiger latency, DGX embedding, built in Cursor.

**The payoff is the same question giving two different, correctly cited answers as a judge turns a physical year dial, while a raw model's leak is caught beside it.**

In Q&A, invite judges to ask their own question. It runs the same verifier on screen: they get a cited answer or an in-character refusal, never an unchecked sentence.

## Prize strategy

| Track | Priority | Substantive contribution |
| --- | --- | --- |
| **[SpaceX](../resources/tracks/spacex-make-it-legendary.md)** | **Primary** | Requires building with Cursor plus the Grok Imagine or Grok Voice API; this plan uses both APIs. Real space data: decades of literature no human can read. Grok speech-to-text, tool calls and text-to-speech are the radio's voice, and tool calls physically move the needle. Grok Imagine paints the stations. Built end to end in Cursor, with commit trailers and exported transcripts as evidence. |
| **[Tiger Data](../resources/tracks/mlh-tiger-data.md)** | **Primary** | A papers hypertable chunked by v1 date with year-filtered pgvectorscale search; a station-by-year continuous aggregate driving the physical meter; term-first-seen and burst tables feeding the verifier and bulletins; an events hypertable whose `percentile_agg` aggregate shows live p95 latency. The knob makes performance visible. |
| **[BigRed](../resources/tracks/bigred-main.md)** | **Primary** | Three of Kleinberg's own ideas in a tangible object, plus a direct answer to his freshness and correctness problem. |
| **[Hardware](../resources/tracks/hardware.md)** | **Primary** | A printed enclosure with real input (two dials, push-to-talk), real actuation (a voice-driven needle) and a live data meter. The hardware teammate owns it end to end. |
| **[Design](../resources/tracks/design.md)** | Secondary | Industrial design of the radio and a matching retro screen: call signs, cover art, citation cards and a red/green verifier panel that needs no explanation. |
| **[Software](../resources/tracks/software.md)** | Opportunistic | Embedding and clustering at 400k scale, as-of retrieval, a two-stage verifier, burst detection and a published leak eval. Enter without adding features for it. |
| **[People's Choice](../resources/tracks/peoples-choice.md)** | Opportunistic | A short clip of the needle moving on its own and the answer flipping between 1996 and 1999. |
| **[GoDaddy Registry](../resources/tracks/mlh-godaddy-registry.md)** | Opportunistic | Register **whatweknew.us** (backups: notdiscoveredyet.us, deepfield.study) through GoDaddy Registry with the MLH claim code (tech.study, then checkout at the registrar) and point it at the Devpost. The TLD list and availability are unverified. |

That is four primary targets and four lower-priority entries, not a prediction of eight wins. Showing Grok Bot in planning is a cheap SpaceX bonus if the team uses it.

### Integrations to skip

- **Photon:** a radio is one shared object in one place; an iMessage channel would be a bolt-on.
- **ElevenLabs:** the radio already speaks through Grok Voice (one of the two APIs SpaceX accepts), so a second voice stack would have no distinct job.
- **Gemini:** a second LLM stack, in the most crowded track, adds nothing the Grok pipeline lacks.
- **Nessie:** there is no banking problem here.
- **Presage:** physiology has no role in browsing or verifying knowledge.
- **Solana:** there is no settlement or shared-trust requirement.
- **Beginner:** enter only if every teammate is at their first hackathon.

## Originality analysis

**Qualified pass. No product or project found runs the full loop, so the whole is not a subfeature of anything reviewed. Year-gated literature Q&A alone does fail the subfeature test (it is one parameter on Consensus), so the pitch must lead with verified as-of correctness, the measured leak rate and the year dial as an instrument.**

| Existing product or research | Existing capability | Required differentiation |
| --- | --- | --- |
| [Pathfinder (UniverseTBD)](https://github.com/UniverseTBD/Pathfinder) | Same astro-ph corpus; semantic search, LLM answers, embedding browsing, recency weighting. | Hard cutoff on v1 dates, claim-level verifier, measured leak rate, physical controls. Cite it up front. |
| [Consensus year_max](https://docs.consensus.app/search-basics/find-high-quality-recent-papers) | Research answers from papers with a year ceiling. | A year filter does not stop the model's own knowledge from leaking. Never pitch filtering alone. |
| [DatedGPT](https://arxiv.org/html/2603.11838) | Public demo comparing answers across 12 models with yearly cutoffs. | Any dial year by retrieval, with every sentence cited and verified. |
| [History LLMs](https://github.com/DGoettlich/history-llms) | Widely shared models that know only up to a fixed year. | A movable cutoff over a scientific corpus, with citations. |
| [Andon FM](https://andonlabs.com/blog/andon-fm) | Two-dial retro radio fronting AI stations, one run by Grok. | It has no corpus, time axis or Q&A. Make the year control look different: big knob, year display, meter. |
| [Radiooooo](https://en.wikipedia.org/wiki/Radiooooo), [Time Machine Radio](https://magazine.raspberrypi.com/articles/time-machine-radio) | Place-plus-decade music browsing; decade-dial maker radios. | Here the year limits what the AI may assert. |
| [Nomic Atlas](https://atlas.nomic.ai/use-cases/chat-with-arxiv), [Arxiv Research Explorer](https://devpost.com/software/arxiv-research-explorer), [ArXivAtlas](https://github.com/Jaluus/ArXivAtlas) | Embed-and-cluster maps of arXiv with chat or search; a repeated hackathon pattern. | Do not pitch the map. Stations are the serendipity input, not the claim. |
| [WizMap](https://arxiv.org/pdf/2306.09328) | Year-animated embedding maps showing a field emerge. | Spoken burst bulletins, a physical meter and year-gated answers. |
| [All Leaks Count / TimeSPEC](https://arxiv.org/html/2602.17234), [date-filtered retrieval leakage](https://arxiv.org/html/2602.00758) | Claim-level audits of temporal leaks; evidence that date filters leak. | Cite them. Claim a lightweight applied version, not a novel checker. |
| [AstroMLab 5 concepts](https://arxiv.org/html/2511.12353v1) | Concept emergence per year across 400k astro-ph papers. | Optional seed for the term tables; cite it as an asset. |

The defensible claim is the integration: physical navigation of idea space and time, with as-of correctness that is enforced and measured. This was a bounded search of the sources above, not proof of novelty or a patent claim. See [researched alternatives](researched-alternatives.md) for ideas rejected after competitive checks.

## 32-hour build plan and ownership

H0 is Friday midnight; submission closes at about H32.5 (Sunday 8:30 AM).

| Team member | Ownership |
| --- | --- |
| Software engineer 1 | Corpus: Kaggle download, astro-ph filter, v1 dates, DGX embedding, clustering, call signs and top-30 names, frequency chain, station graph and greedy route, burst detection, Grok Imagine art batch. |
| Software engineer 2 | Tiger schema and bulk load, year-filtered search, continuous aggregates, term-first-seen table, verifier with one assert self-check (a 1996 draft containing "dark energy" must fail), leak eval, latency numbers. |
| Software engineer 3 | Voice pipeline (Grok STT, text tools, verifier hook, Grok TTS), answer cache and neighbor-year prefetch so the year flip is instant, refusals, screen UI, pre-rendered call-sign and bulletin audio. |
| Hardware engineer | Enclosure panels, dials with printed detents, year display, LED meter, servo needle with calibration table, push-to-talk, Arduino serial firmware, cardboard backup faceplate. |

1. **H2:** the early checks below pass. The first enclosure panel is printing by H3.
2. **H8, prove first:** on a 20k slice of 1994-2000 astro-ph in Tiger (subject classes such as astro-ph.CO only start in 2009, so 1990s papers are tagged plain "astro-ph"), the 1996 and 1999 dark-energy answers differ, cite correctly, and the verifier flags raw Grok's 1996 leak. Text only. If this fails, rethink before building more. In parallel, both dials and the button reach the laptop over serial, and the full corpus finishes embedding.
3. **H14:** turning the knob locks a real station and the meter reads the continuous aggregate. The full corpus is in Tiger.
4. **H20:** voice ask, tune and route work end to end through the verifier; bulletins fire on year sweeps.
5. **H24, feature freeze.** After that: the 15-question eval, fallbacks (cached answers for rehearsed questions, pre-rendered audio), three full rehearsals, the Devpost with Cursor evidence, eval numbers and cited prior art, the video and the domain.

Cut in this order if behind: Grok Imagine art (to 20 stations, or to none once the SpaceX table confirms STT plus TTS counts as Grok Voice), the route feature, burst detection (fall back to first-seen terms), then corpus scope (all pre-2009 astro-ph plus astro-ph.CO, astro-ph.EP and astro-ph.HE after 2009, which keeps the cosmology, exoplanet, fast-radio-burst and gravitational-wave eval topics).

## Early checks (first two hours)

- **xAI:** get a key and prepay a small amount; free credits are unverified. Prove STT, a text call with a tool call, and TTS in one round trip, and time it. Keep the key on the laptop service, never in a browser. Ask the SpaceX table whether STT plus TTS counts as Grok Voice; if they want the realtime agent, test whether its output can be text-only so the verifier still runs before speech.
- **Cursor:** every teammate codes in Cursor Agent. Keep the default "Co-authored-by: Cursor" trailers, commit often, export transcripts into the repo and screen-record for the video. Shared transcript links need a Teams seat, and the free plan limits Agent requests.
- **Tiger:** claim the MLH credits, create a service, and enable pgvector and pgvectorscale on it. In-database embedding (pgai) was removed, so embed outside the database. Load a 10k slice, test year-filtered search and one continuous aggregate, and measure COPY speed on venue Wi-Fi; plan a hotspot bulk load with halfvec vectors. pg_cron needs a support request, so use refresh policies.
- **Corpus and DGX:** start the multi-GB Kaggle download now and confirm `versions[0].created` is present. Confirm laptops can reach the DGX on the venue network. Measure embedding throughput by H1 and size the model so the job finishes overnight.
- **MLH hardware:** the rental list only says "assorted Grove components". Confirm a servo, LED bar, button, 4-digit display and rotary sensors. Grove rotary angle sensors are potentiometers, not detented encoders, so print detent rings. After a voice tune, an absolute knob regains control only once it moves past the needle's station (soft takeover). If resolution is too coarse, reduce the station count. Any missing part is to be sourced. Audio runs through the laptop mic and speaker (or a Logitech webcam mic); a speaker inside the enclosure would also need to be sourced.
- **GoDaddy and rules:** get the claim code, check the TLD list in a real browser and register early. Confirm prize-stacking limits with organizers.

## Success criteria and risks

- At two dial years, rehearsed questions give different answers, and every sentence cites a paper with a v1 date on or before the dial year.
- The verifier flags raw Grok's leak live, and the dark-energy self-check passes.
- Leak rates for both systems are measured on a published question set and shown on screen.
- An unrehearsed question gets a verified answer or an in-character refusal; nothing unchecked is spoken.
- Dial-to-meter updates feel instant, and live p95 latency for filtered search and aggregate reads is on screen.
- Voice tune and route move the needle to the right station.
- The demo fits in two minutes three times in a row, including once with Wi-Fi off using cached answers.

**Theme and impact are the main ceiling.** BigRed judges may weight literal wayfinding. Rehearse the answer: navigation through idea space and time, built on Kleinberg's labeling, burst and routing work, with his freshness problem made enforceable. For impact: kiosks, students entering a field, and as-of grounding for any AI that answers questions about a changing world.

**The verifier is a proxy.** The term check misses paraphrased leaks ("expansion is speeding up"); the citation-support check narrows that gap but does not close it. Say so, and label the eval answers by hand.

**Other risks:** several seconds of latency across STT, retrieval, generation, verification and TTS (show the "checking the shelf" state, play static, prefetch neighbor years); 400k vectors over venue Wi-Fi (384-dim halfvec, hotspot load, smaller scope if slow); potentiometer resolution, servo jitter and failed prints (calibration table, hysteresis, early panels, cardboard faceplate); ugly station names (hand-name the top 30 and route only through named stations).

Protect the core demonstration: a judge turns the year dial and watches what the radio is allowed to know change, with every sentence cited and every leak caught.
