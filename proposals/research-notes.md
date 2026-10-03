# Research notes (field intel)

Gathered 2026-10-03 while generating proposals. Sponsor-specific gotchas live in each [track file](../resources/tracks/README.md). Rejected ideas: [other-ideas.md](other-ideas.md).

## Field size and what won at BRH

FIELD SIZE (BRH is small): 2025 had 174 registered and 54 Devpost submissions; 2024 had 135 registered and 40 submissions. The BRH 2026 Devpost showed only 17 registrants on Oct 2, but Devpost sign-ups lag, so expect roughly 45-75 submissions. The closest comparable is DivHacks 2026 (Columbia, Sep 26-27, 2026): 220 participants, 65 submissions, and nearly the same sponsor slate (Capital One Nessie, SpaceXAI "Make it Legendary", Photon, MLH Gemini/ElevenLabs/Solana/Tiger Data). Each niche sponsor track at BRH will probably get 2-10 real entries.

WHAT WON AT BRH:
- BigRed 2025: Lead Zeppelin (draw on paper, CV + Gemini turn it into music lessons), wubwub (webcam hand-gesture DJ with an Arduino), Duelingo (live AI-generated language duel game). All three are playful, camera- or physical-input driven, and easy to demo live at a table.
- BigRed 2024: WellBite (class schedule synced with dining), Vitae (wearable health data drives a calendar), Nocturne (mood-to-song). Practical student life plus creative AI.
- Design: games with visual polish (Bear Escape rhythm game, Road Rage gesture driving with Three.js; Rabbit Hole lifebook in 2024).
- Hardware: low bar so far. A 3D-printed kendama in 2025, a posture pendant in 2024. A system with working sensors and actuators would stand out.
- Software 2025: SERENDIPITY, an AI-security CTF RPG with RAG. Judges valued depth and novelty.
- People's Choice: crowd-pleasers with social or music hooks (pulse. hum-to-music in 2025, pomopals in 2024).

STACKING: one project winning several prizes happens at BRH. Bear Escape won Design + MLH Gemini (2025). Pathway won Beginner + MLH DEI (2024). No BRH year shows a BigRed winner also taking a sponsor prize, so whether BigRed stacks with other prizes is unverified. Ask organizers.

THEME HISTORY: 2021 (exploration/space) winners included Inneroute (weather-aware indoor Cornell routing). 2024 Pathway was an accessibility-review map. Judges have already rewarded literal campus and accessibility navigation, so a repeat looks stale.

JUDGE TASTE: interactive live demos (camera, gesture, physical input), a visible "wow" in under 2 minutes, a polished UI, and Gemini or LLMs used as a creative engine rather than a chat box. 2025 had at least 6 location/discovery apps (SeekOut, LocalLens, LocalLore, mQuest, QuestAR, Geko) and none won BigRed. Generic map apps lose here.

## Track competition

Assumes a field of about 45-75 submissions, from BRH 2024/2025 and DivHacks 2026 data.

LOW COMPETITION (a solid integration that carries the core function has a real shot):
1. MLH Presage. Native-only SDK (iOS/Android/C++/Node), plus API-key and model-loading failures (DREAD), scare most teams off. At TAMUhack 2026 (176 submissions) a WSL C++ build won. With a Mac, iPhone or Linux box, it is likely 0-3 real competitors. Check early whether the C++ SDK runs on the DGX Spark (ARM64 Linux); otherwise use an iPhone or Mac. A REST upload path exists as a fallback.
2. MLH Tiger Data. Most teams use it only as storage, if at all. Real hypertables, continuous aggregates and compression over time-series location or sensor data with a latency number would stand out. Prior winners were spatio-temporal (snow reports, traffic forecasting).
3. Hardware track. The BRH bar has been a kendama and a posture pendant. A working sensor-and-actuator system from a dedicated hardware person is a strong contender.
4. MLH GoDaddy domain. Nearly free lottery ticket, so always enter.
5. MLH Solana. Few teams build on-chain at a navigation event, and the bar is low (ExitNow won with an undocumented role). But the integration must not feel forced or off-theme.
6. SpaceX Make it Legendary. Requires both Cursor (provable) and Grok Imagine or Voice. Most teams use other LLMs and will not satisfy both. Winners so far have been non-space civic or campus tools built around Grok Voice. Moderately low.

MODERATE:
7. Capital One Nessie. About 2 winners per 65 submissions at DivHacks. Fintech is off-theme for navigation, so few BRH teams will try, but Capital One reps attract a few dedicated fintech teams. It works if Nessie moves real (mock) money inside the product loop.
8. Design (2 slots). Depends on polish. Games and visually rich 3D or map UIs have won.
9. ElevenLabs. Many teams bolt it on, but few make voice the interface, so voice-first plus hardware wins.

CROWDED / HARD:
10. Photon. A cash prize, reps on site, Photon doubling prizes, and Spectrum is easy to set up. At DivHacks 2026 at least 8 of about 28 winners used it. Expect 10+ BRH entries. Winning needs proactive, multi-person, real-world depth.
11. MLH Gemini. Ubiquitous.
12. BigRed (3 of about 60), Software (1), People's Choice (driven by upvote mobilization, so plan a share push right after 8:30 AM Sunday).

STACKING OBSERVED: same-event multi-wins are common (Bear Escape Design + Gemini at BRH 2025; transPEAKtation Tiger Data + AWS; Halo Waymo + State Farm; bubl Most Popular + DeepSpace). So one project with 3-4 integrations that each carry real weight (e.g. Presage + Tiger Data + hardware + Grok Voice/Photon + domain) is a realistic plan.

## Navigation cliches to avoid

- Smart cane, haptic belt or vest, or Joy-Con wrist buzzers for blind or low-vision obstacle avoidance (ultrasonic plus buzz). Examples: Haptick, Occucane, Cane-Eye, MakeMIT Smart Cane; Paradise won 3rd at ShellHacks 2026. Judges have seen it dozens of times, and the theme brief itself suggests it, so many BRH 2026 teams will build it.
- 'Safest route home' from crime, lighting or 911 data, or a walk-home check-in companion. Examples: Safeny, SafeRoute, SafeWalk, Safe Streets. Nook already won DivHacks 2026 Photon doing exactly this over iMessage.
- Accessibility review map or wheelchair-accessible routing. Pathway won BRH 2024, and the team's RouteRepair proposal is in the same space.
- 'Describe your day, get an AI itinerary' trip or day planners and group outing planners: mQuest (BRH 2025), PlaNYt, Detour food-crawl, PlansAroundUs, unsaid.
- Comfort, shade, quiet or 'scenic route' routing (ComfiMap, DivHacks 2026). Kleinberg's 'what's the scenic way?' keynote example will be copied by many BRH 2026 teams.
- A plain 'LLM + Google Maps' directions chatbot. Kleinberg said on stage that a Gemini+Maps mashup still gets left and right wrong. A generic version will read as the baseline he criticized, unless it adds verifiable grounding or freshness.
- Campus navigation, class finder or indoor wayfinding apps (Inneroute at BRH 2021, CampusLoop at ShellHacks 2026, countless 'Cornell map' apps).
- Location-based social drops, gamified city exploration and campus scavenger hunts. Examples: bubl, Hermi, Know York, SeekOut, QuestAR, Touch Grass, CU Touch Grass, LocalLore, LocalLens. BRH 2025 alone had about 6.
- Cyclist rear-radar or smart-helmet blind-spot warnings: BuzzBike (DivHacks 2026) and Halo (ShellHacks 2026) both just won. Saturated.
- AR arrow navigation, AR first-responder or firefighter guidance, AR find-my-stuff: Ember AR (Hack Canada 2026), Ember robot (HackPrinceton '26), cortex (TAMUhack 2026).
- Traffic or transit congestion prediction, subway ETA notifiers, ER or emergency routing: transPEAKtation, ExitNow, Transit Planner, ERoute.
- Gesture or phone-controlled driving and 'self-driving car interface' demos: Road Rage already won BRH 2025 Design, and 'drive a car with your phone' is a slide prompt every team saw.
- Parking finders and lot-occupancy trackers (CarPort, TAMUhack 2026).
- Lost item or lost pet finders (Find My Pet at BRH 2024, cortex item tracking).
- Historical or time-travel street views and AI tour guides narrating landmarks (Julia's Time Machine won DivHacks 2026 1st; PAC-MANhattan).

## Sources

- https://bigred-hacks-2025.devpost.com/project-gallery
- https://bigred-hacks-2025.devpost.com/project-gallery?page=2
- https://bigred-hacks-2025.devpost.com/project-gallery?page=3
- https://bigred-hacks-2025.devpost.com/
- https://bigred-hacks-2024.devpost.com/project-gallery
- https://bigred-hacks-2024.devpost.com/
- https://bigredhacks2026.devpost.com/
- C:/Users/sahas/Github Repos/BRH26/resources/past-winners.md
- C:/Users/sahas/Github Repos/BRH26/resources/02-theme-navigation.md
- C:/Users/sahas/Github Repos/BRH26/resources/tracks/photon-imessage-agents.md
- C:/Users/sahas/Github Repos/BRH26/resources/tracks/spacex-make-it-legendary.md
- C:/Users/sahas/Github Repos/BRH26/resources/tracks/mlh-presage.md
- https://divhacks-2026.devpost.com/
- https://divhacks-2026.devpost.com/project-gallery?winner=true
- https://divhacks-2026.devpost.com/project-gallery?page=2&winner=true
- https://devpost.com/software/nook-r37zlo
- https://devpost.com/software/unsaid-zm8w5v
- https://devpost.com/software/news-next-door
- https://devpost.com/software/rentescrow-nthfwb
- https://devpost.com/software/nova-hzgjy0
- https://devpost.com/software/scoop-smdxjl
- https://devpost.com/software/get-ready-with-mirror-grwm
- https://devpost.com/software/exitnow
- https://devpost.com/software/adaptive-room-planner
- https://devpost.com/software/keyo
- https://devpost.com/software/in_process
- https://devpost.com/software/planyt
- https://devpost.com/software/julia-s-time-machine
- https://devpost.com/software/leaf-on-read
- https://devpost.com/software/hermi
- https://devpost.com/software/bubl-1nvjz3
- https://devpost.com/software/detour-x98yvt
- https://devpost.com/software/buzzbike
- https://devpost.com/software/pac-manhattan
- https://devpost.com/software/knowyourbuilding
- https://devpost.com/software/ellipsis-6ws72b
- https://devpost.com/software/glassledger-rzjmy0
- https://devpost.com/software/avmos
- https://devpost.com/software/fuse-76qwx1
- https://hackprinceton-spring-26.devpost.com/project-gallery?winner=true
- https://devpost.com/software/wavelength-9bzr06
- https://devpost.com/software/shomi
- https://devpost.com/software/wisebuys
- https://th26.devpost.com/project-gallery?winner=true
- https://devpost.com/software/helm-o7vdq6
- https://devpost.com/software/haggle-admqhc
- https://devpost.com/software/pff
- https://devpost.com/software/cortex-67ueyq
- https://hack-canada-2026.devpost.com/project-gallery?winner=true
- https://devpost.com/software/w-enxoy9
- https://hackhive-2026.devpost.com/project-gallery?winner=true
- https://devpost.com/software/t-5xam82
- https://devpost.com/software/focusflow-xwvdha
- https://shellhacks-2026.devpost.com/
- https://shellhacks-2026.devpost.com/project-gallery?winner=true
- https://devpost.com/software/transpeaktation
- https://devpost.com/software/paradise-n0i7of
- https://devpost.com/software/halo-1q59hf
- https://devpost.com/software/guardian-loop
- https://dev.to/dronzer2code/the-system-never-checked-if-you-slept-ours-reads-your-pulse-first-2hai
- https://github.com/leozh0u/dread
- https://github.com/Presage-Security/SmartSpectra
- https://www.mlh.com/events/prizes
- https://photon.codes/weekly-update/may-14-2026
- https://www.basenor.com/blogs/news/xai-grokathon-2026-4-standout-moments-that-reveal-groks-range
- https://devpost.com/software/money-hog
- https://github.com/Alexlgvcode/ellipsis/issues/55
- WebSearch summaries only (pages not fetched directly): HackCMU 2026 SpaceXAI winner Gotchu (x.com/SERobinsonJr/status/2099897963938263072 returned HTTP 402); smart-cane and safest-route cliche examples (devpost.com/software/haptick-the-walking-stick-for-tomorrow, devpost.com/software/safe-walk-0427ew, devpost.com/software/safe-streets-ai-powered-women-s-safety-navigator, github.com/phil-kt/safeny)
