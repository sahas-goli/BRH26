# Preflight - Rehearse tomorrow's trip, then change it

**Recommendation: build a rehearsal of one real bus trip that works out why a step is hard for this traveler, then changes the real plan to remove that cause. The gate is the Presage SDK streaming on our laptop by hour two, with a final go/no-go at hour three.**

Researched 2026-10-02 for a team of three software engineers and one hardware person. The priorities below reflect sponsor fit, execution cost and demonstration quality. They are not predicted wins.

## The idea

Preflight is for autistic teens and adults, people with anxiety or agoraphobia, and people with cognitive disabilities who are learning to travel independently. It also serves the travel trainers, occupational therapists and families who support them. Today a trainer rides along for weeks, or the traveler studies static step cards. Products such as Bosch VR Bus Ride and Floreo already let people rehearse bus travel in VR. Rehearsal can show that a step is hard. The trainer still has to guess why, and rebuild the plan by hand.

Preflight rehearses one real trip, finds the likely cause of the hard step, and changes the trip:

1. **Trip.** We author one TCAT trip, Collegetown to the Commons, from TCAT's GTFS timetable and OpenStreetMap walking segments. Gemini rewrites each step as a plain-language social-story card.
2. **Content from real photos.** On Saturday morning the team photographs every step and logs timestamped crowd counts at the stop. Grok Imagine animates two hero steps (the bus arriving, boarding) as image-to-video. The other steps are Grok Imagine image edits of our photos (the next step highlighted), shown with gentle parallax. Everything is pre-generated. Gemini compares each generated frame to its source photo and rejects frames where the turn arrow switched sides, the frame is mirrored, or the signage changed.
3. **Separable layers.** Each step is a stack of layers we can switch on or off independently: the clip, an ElevenLabs Sound Effects soundscape (brakes, crowd) at graded loudness, an ElevenLabs conversational agent playing the driver ("Where you headed?"), and calm ElevenLabs narration.
4. **Signals.** The traveler squeezes the 3D-printed Pebble whenever something feels hard. This is the primary label, and it works for nonverbal users. Presage SmartSpectra reads two things from a webcam while the traveler sits. The first is pulse deviation from the traveler's own baseline. The second is talking status, which shows whether and how quickly the traveler answered the driver. Presage is corroboration, never a stress score.
5. **Variant replay.** When a step stays hot, Preflight replays it with one layer changed: the driver muted, the soundscape at 30%, or an alternate walking segment. The step is tagged with a likely factor (social exchange, noise, crowd, or not knowing where to go) based on which variant drew fewer squeezes and stayed closer to baseline.
6. **Plan diff.** A rule table maps each factor to real alternatives for this trip, and every proposal cites its source:
   - another departure: GTFS timetable
   - a different boarding method: TCAT's published fare options, or "show the driver your trip card", which needs no speaking
   - a quieter segment: OSM
   - crowding: our logged counts, stated as a single observation

   The output is an old-versus-new step diff and a printable trip card. The new step is rehearsed again.

The traveler owns the data. Sensing is opt-in and can be turned off, leaving the Pebble alone. The trainer view shows exceptions only. Video is processed on-device, and none is displayed or stored.

The theme fit is the Accessibility prompt in the [Navigation brief](../resources/02-theme-navigation.md). The organizers also asked aloud for "audio-adaptive navigation for accessibility". Preflight's output is a changed route, departure or boarding method, not a score. It also applies Kleinberg's grounding problem to generative media: previews are anchored to photos taken this weekend, and they are checked for exactly the left/right error he described before a traveler sees them.

## The two-minute demonstration

Setup: a laptop, a Logitech webcam (MLH rental) and a ring light (to be sourced) in a 3D-printed mount, the Pebble, and a speaker (to be sourced, or the laptop's own). Presage capture is already running and the judge sits down at 0:00, so the roughly 12-second pulse warm-up finishes during the framing.

1. **0:00 Frame.** "Trainers teach the first solo bus ride by riding along. Bosch and Floreo let you rehearse a bus. Nobody changes the trip." The screen shows tomorrow's real trip from TCAT GTFS.
2. **0:15** A small sidebar trace has settled to the judge's baseline. "Squeeze the stone whenever something feels like too much."
3. **0:25 Rehearsal, 30 seconds.** The judge sees the walk to the stop and the stop, both from our own photos. The bus arrives in a Grok Imagine clip with ElevenLabs brakes and a crowd. The driver agent asks "Where you headed?" and the judge answers aloud. Presage talking status records how quickly they answered.
4. **0:55 Live variant.** The boarding step replays with the driver muted. The timeline shows both variants side by side: squeezes, deviation from baseline, and answer latency.
5. **1:10 Payoff.** Preflight loads a teammate's three real recorded rehearsals with their variants. Muting the driver brought the boarding step back near baseline every time; softening the soundscape did not. The tag reads "social exchange, not noise". The plan diff replaces "tell the driver your stop" with "show your trip card", and swaps the departure for the later trip, citing GTFS and our Saturday count. One tap swaps in the new step, ready to rehearse again, and opens the printable trip card.
6. **1:35 Grounding.** A side panel shows a generated frame that Gemini rejected because its turn arrow pointed the opposite way from the source photo.
7. **1:50 Close.** "They rehearse a bus. We find why a step is hard for you, and change tomorrow's trip."

The payoff is the plan diff, with its cited sources. The vitals trace is never the centerpiece.

## Prize strategy

| Track | Priority | Substantive contribution |
| --- | --- | --- |
| **[Presage](../resources/tracks/mlh-presage.md)** | **Primary** | Per-step pulse deviation from the traveler's own baseline, plus talking status for answer latency. Both feed variant replay, which changes the real plan. The judge's own face drives the demo. |
| **[ElevenLabs](../resources/tracks/mlh-elevenlabs.md)** | **Primary** | Three separately controllable layers: graded Sound Effects soundscapes, the conversational driver agent, and narration. Variant replay works by switching these layers, so without ElevenLabs there is nothing to compare. |
| **[BigRed](../resources/tracks/bigred-main.md)** | **Primary** | Accessibility navigation whose output is a changed trip, plus generated previews checked for left/right errors. |
| **[SpaceX](../resources/tracks/spacex-make-it-legendary.md)** | Secondary | Grok Imagine turns our route photos into the rehearsal visuals. All code is written in Cursor, and git history keeps the Cursor attribution trailers. There is no space data; the ceremony said space data is optional. |
| **[Design](../resources/tracks/design.md)** | Secondary | A low-stimulation interface: social-story step cards, an amber outline for hot steps instead of alarm red, reduced motion, the plan diff, the trip card, and an exceptions-only trainer view. |
| **[Hardware](../resources/tracks/hardware.md)** | Secondary | The Pebble produces the primary label and runs a slow paced-breathing vibration. A printed camera and light mount keeps Presage signal quality consistent. |
| **[Gemini](../resources/tracks/mlh-gemini-api.md)** | Opportunistic | Writes the step cards and runs the frame grounding check (turn side, mirroring, signage) with structured output. |
| **[Software](../resources/tracks/software.md)** | Opportunistic | A clean sidecar architecture, a deterministic variant comparison, and one assert self-check. We will not add features for this track. |
| **[People's Choice](../resources/tracks/peoples-choice.md)** | Opportunistic | A short Devpost video of a rehearsal with real sound. |
| **[GoDaddy Registry](../resources/tracks/mlh-godaddy-registry.md)** | Opportunistic | `preflight.study` (rehearsal as study), with `rideitfirst.us` as the fallback. Premium names are excluded from the offer, so check both. |

### Integrations to skip

- **Photon:** a trip-day agent is a second product. On the Pro plan, judges' numbers must be registered before they can text it. The printed trip card covers trip day.
- **Tiger Data:** rehearsal history is a few hundred rows. SQLite is enough, and any performance claim would be invented.
- **Grok Voice:** ElevenLabs owns all audio, and a second voice stack would read as a bolt-on.
- **Nessie, Solana:** neither banking nor settlement has a role here.

## Originality analysis

**Qualified: not a subfeature of any product reviewed, but only because Preflight changes the real trip.** Rehearsing real bus routes, measuring physiology during transit rehearsal, and adapting an experience to vitals all exist already. The pitch must lead with the plan diff.

| Existing product or research | Existing capability | Required differentiation |
| --- | --- | --- |
| [Schmidt and Glaser 2023, University of Missouri](https://cehd.missouri.edu/2023/12/virtual-reality-simulations-can-help-autistic-people-complete-real-world-tasks-mu-study-finds/) | A VR replica of a real campus shuttle system, with gaze tracking to find which stimuli pull autistic learners' attention away. | Attribute the hard step by variant replay and change the real itinerary, not the simulation. |
| [Bosch VR Bus Ride](https://www.bosch-softwaretechnologies.com/en/explore-and-experience/a-vr-journey-in-rodovre/) | VR rehearsal of a local bus route for autistic students, with gradual exposure customizable per student. | Content generated from photos for each trip, plus a sourced plan diff. |
| [Floreo with Easterseals](https://floreovr.com/learning-center/blog/ambitious-socal-initiative-taps-vr-to-help-youth-with-autism-develop-safe-travel-skills) | Customized VR transit-safety lessons, including communication and social skills. | The driver is one switchable layer. Muting it is how the no-speaking alternative gets tested. |
| [JMIR Serious Games 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5883078) | VR bus training with a skin-conductance wristband. The game cut noise and stimuli when anxiety peaked, and anxiety trended down across sessions. | Physiology selects a change to the real trip, not to the simulation. |
| [XRHealth / Psious](https://voicesofvr.com/overcoming-fears-vr-exposure-therapy-psious/) and [gameChange](https://www.psych.ox.ac.uk/news/psychological-therapy-automated-in-virtual-reality-gamechange-vr-program) | Therapist-controlled graded exposure, including agoraphobia, or automated VR therapy with a trial-tested bus scenario. | The traveler's own route, a webcam only, and a changed itinerary as the output. |
| [Kuriakose and Lahiri](https://link.springer.com/article/10.1007/s10803-014-2240-5) | Real-time anxiety estimates adapt VR for autistic users. | Do not claim the closed loop as new. Claim the travel-plan output. |
| [AbleLink WayFinder](https://play.google.com/store/apps/details?id=com.ablelinktech.WayFinder&hl=en_US) | Caregiver-authored photo-and-audio steps for real bus routes. | The trip card is the result of rehearsal, not hand authoring. |
| [Google Maps Immersive View](https://blog.google/products-and-platforms/products/maps/google-maps-october-2023-update/) | Route previews with a departure-time slider. It does not cover transit and is not personal. | Answer "isn't this Immersive View?" in the first 15 seconds. |
| [UnderPressure](https://devpost.com/software/underpressure) and [Webcam Stress Meter](https://devpost.com/software/webcam-stress-meter) | The same Presage, Gemini and ElevenLabs stack has already won the Presage prize, and webcam stress meters are common at hackathons. | Never show a stress score. Keep the trace small and make the plan diff the hero. |
| [Naver Seoul World Model](https://seoul-world-model.github.io/) | Video generation grounded in real street imagery. | The grounding check is an application component, not a novelty claim. |

Cite the Missouri shuttle study and the JMIR study in the Devpost as the research basis. This was a bounded search, not proof that no similar product exists. See [researched alternatives](researched-alternatives.md).

## 32-hour build plan and ownership

The scope is one trip, five steps, two hero video clips, and a rule table of three factors mapped to alternatives. There is no general trip planner.

| Team member | Ownership |
| --- | --- |
| Software engineer 1 | The Presage Node sidecar, which owns the webcam and streams metrics to the UI over a local WebSocket. Presage has no web SDK, so the browser UI cannot run it directly. Also baseline, per-step deviation, answer latency, and the variant comparison with one assert self-check. |
| Software engineer 2 | The content pipeline: the photo walk, Grok Imagine stills and hero clips, the Gemini grounding check and step cards, ElevenLabs narration and soundscapes, and GTFS/OSM alternatives with their sources. |
| Software engineer 3 | A local web UI covering the rehearsal player, step timeline, plan diff, trip card and trainer view. Also the ElevenLabs driver agent, the SQLite history and the rule-table replanner. |
| Hardware engineer | The Pebble (Arduino and Grove over serial: squeeze events, vibration pattern, LED) and the camera and light mount. Joins the photo walk, tests lighting at the judging table, and records the backup video. |

1. **H0-H2 (Fri midnight-2 AM):** prove that Presage streams pulse and talking status on the judging laptop and webcam. In parallel, produce one Grok Imagine clip from a phone photo, one ElevenLabs sound effect and one agent turn, download TCAT GTFS, and set up Cursor on every engineer's machine.
2. **H2 decision:** if no metrics arrive, try `sdk.useCustomInput()` with frames we capture ourselves, then the DGX Spark (Linux arm64, untested), until H3. If those also fail, switch candidates while the cost is only three hours.
3. **H8:** a skeleton runs end to end with placeholder photos: three steps play, squeezes attach to the right step, and the deviation strip renders. The camera mount is done.
4. **H8-H10 (Saturday 8-10 AM):** the photo walk, with timestamped crowd counts at the stop.
5. **H14:** the Pebble is finished. Variant replay and the plan diff work.
6. **H16:** all content is pre-generated and grounding-checked, and a rejected frame is saved for the demo. If the team is behind, run the check on the hero clips only.
7. **H18-H22:** the teammate records three real rehearsals with variants. Seek feedback from a travel trainer or disability-services contact if one is reachable, and never fabricate a quote.
8. **H26 (Sun 2 AM): feature freeze.** Test 10 different faces under hall lighting, record a backup video, write the Devpost with Cursor evidence, and register the domain.

## Early checks (first two hours)

- **Presage:** get a key from physiology.presagetech.com and run `npm install @smartspectra/node-sdk` (Windows x64 is supported). Confirm the cardiac model loads, because a previous key failed at that step. Use monotonic timestamps (`process.hrtime.bigint()/1000n`). The SDK needs at least 25 fps and diffuse, flicker-free light. Pulse warms up in about 12 s and breathing in about 30 s. Talking corrupts breathing, so use pulse and talking status during the driver beat.
- **xAI:** signup credits are unverified, so prepay a small balance or ask the SpaceX table. Video generation is asynchronous and can take several minutes per clip, and clips are 1-15 s long. Set `generate_audio=False`, because ElevenLabs owns the audio. Generation runs from an offline script, so the API key never reaches the browser.
- **ElevenLabs:** redeem the MLH promo code before generating anything. The free 10,000 credits run out in about ten minutes of speech. Sound effects run up to 30 s per generation and can loop.
- **Cursor:** the Hobby plan limits Agent requests. Keep the `Co-authored-by: Cursor` trailers, commit often from Agent, export transcripts into the repo, and screen-record Cursor for the video.
- **TCAT data:** confirm the GTFS feed and whether a no-speaking boarding option exists. If the feed is missing, hand-enter one route's timetable from TCAT's published schedule.
- **Grove inventory:** confirm that a touch or button module and a vibration motor exist at the rental table. If not, fall back to a large button plus an LED.
- **GoDaddy:** get the claim code from the MLH prizes page or an MLH coach, check the TLD list on tech.study in a browser, and register through tech.study.
- **Prize stacking** is unverified. One teammate should ask the organizers.

## Success criteria and risks

- A judge's squeeze and answer latency are captured against the correct step during a live 30-second rehearsal.
- A live variant replay of the boarding step runs, and the recorded history explains the tag "social exchange, not noise".
- The plan diff cites a source for every change, and the swapped-in step is re-rehearsed.
- The grounding check rejects at least one real mirrored or side-flipped frame.
- The full demo fits in two minutes, with a backup video ready.

**Risks.**

- **Presage gate.** If Presage fails, there is no Presage track and the main differentiator weakens. Decide by H3.
- **Noisy signals.** A few BPM of change over 60 seconds proves nothing. Attribution therefore rests on squeezes, answer latency and repeated recorded runs. Say "closer to your baseline", never stress, anxiety or a cause.
- **Ethics.** Autistic self-advocates may object to biometric monitoring. Prepare the answer: sensing is opt-in, the traveler owns the data, it works without sensing, processing is on-device, and the product is non-medical.
- **Content time.** Grok generation can eat hours. Animate only the two hero clips and pre-generate everything by H16.
- **Overlap with our other proposals.** Do not use an astronaut hook, which would read as the team's existing bioadaptive space simulator proposal.
