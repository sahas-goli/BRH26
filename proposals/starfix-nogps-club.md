# Starfix (nogps.club) - A GPS lie detector you aim at the sky

**Recommendation: build a 3D-printed handheld that gets a position fix from starlight, gravity and a clock, then continuously tests a real GPS feed against that independent fix and explains the verdict by voice without ever inventing a number.**

Researched 2026-10-02 for a team of three software engineers and one hardware person. Priorities below reflect sponsor fit, execution cost and demonstration quality; entrant counts and win probabilities are unknown.

## The idea

The users are mariners, small-aircraft pilots, drone operators and expedition teams working where GNSS signals are jammed or spoofed. Before pitching, cite a current, sourced figure for Baltic or Eastern Mediterranean interference rather than one quoted from memory. When GPS is spoofed, every downstream system (chartplotter, autopilot, SOS beacon, AI assistant) reports the wrong position with full confidence. The traditional independent check is a sextant sight, which needs a visible horizon, an almanac and a trained navigator. Consumer sky apps solve the inverse problem: they trust GPS and use it to label the stars.

Starfix reverses that dependency. An untrained person points it up, and in about 30 seconds it tests the GPS claim against physics:

1. **Automatic sighting.** A printed body rigidly holds a Logitech webcam (focus and exposure locked, lens calibrated with an OpenCV checkerboard) and a Grove IMU. On "mark", OpenCV extracts star centroids and tetra3/cedar-solve runs a lost-in-space solve against a Hipparcos database built for the measured field of view. Nobody picks a star, finds a horizon or opens an almanac.
2. **Position from gravity and time.** The averaged gravity vector gives the zenith in the camera frame. Latitude is the zenith declination; longitude is the zenith right ascension minus Greenwich sidereal time from Skyfield. Each fix carries a timestamp and an uncertainty ellipse.
3. **Voice-coached self-calibration.** Camera-to-IMU misalignment is the dominant error source in published rigs. Grok Voice coaches four marks at 90-degree turns of a detented cradle ("next click... mark"). Averaging across azimuth cancels the misalignment, and the ellipse visibly shrinks on screen.
4. **Continuous integrity test.** The GPS position, streamed as NMEA from a real phone, is treated as a hypothesis and tested against the ellipse at every mark. A residual-slope fit back-dates the onset of a spoof, and a drag detector catches a slow pull-off once it leaves the ellipse. The LED ring turns red and the grip vibrates.
5. **Grounded speech.** Grok produces text responses with tool calls (`get_fix`, `get_integrity`, `explain_confidence`, `next_mark_heading`). A guard compares every number and every direction word (north/south, east/west, left/right) against the solver JSON before Grok TTS speaks it; rejected drafts are logged on screen. The mark timestamp comes from the camera frame, so voice latency cannot corrupt the fix.

**Accuracy, stated plainly.** With a MEMS IMU and a webcam, the target is about one degree (roughly 60 nautical miles): region, not street. Starfix catches gross spoofs and drags once they leave the ellipse, not a 50 m offset. Higher-accuracy devices exist and need a trained navigator, a horizon or a 4.7 kg rig.

The theme document opens with "Before Google Maps, we had people navigating through understanding the stars." Starfix turns that line into a working instrument aimed at a current navigation failure. It also takes the keynote's correctness problem in the [Navigation theme notes](../resources/02-theme-navigation.md) to its hardest case: when the precise database (GPS) is itself wrong, the conversational layer must arbitrate with independent physics, and the language model is never trusted to originate a coordinate or a direction. Freshness appears as fix age ("my last fix is three minutes old").

**Indoor proof: a hardware-in-the-loop sky table, which is how star trackers are bench-tested.** A flat, non-PWM monitor under a printed matte hood renders the real current sky above a chosen location, in gnomonic projection about the lens center. A one-time ArUco calibration at setup measures where the lens sits over the screen. To answer the circularity critique physically, the console and renderer run on a laptop in airplane mode. The solver machine receives only camera pixels, IMU readings, its own clock and the phone's NMEA. The location can cross from one side to the other only as light. A real-sky fix outdoors is a bonus clip if Ithaca is clear, not a dependency.

## The two-minute demonstration

1. **Hook (0:00).** "Before Google Maps, people navigated by the stars. Today GPS is spoofed at sea every day. You can jam GPS. You cannot jam the sky."
2. **Secret city (0:15).** A judge taps any city on the offline console, which Starfix cannot see. The sky table redraws the real sky above that city right now.
3. **Calibrating sight (0:25).** The judge sets Starfix in the cradle. Grok Voice coaches four quarter-turn clicks; the judge pulls the trigger at each click while the ellipse shrinks on screen.
4. **Payoff one (0:55).** Matched stars are labeled. Voice: "Twenty-three stars. Fix: 59 north, 18 east, within about 110 kilometers. Nearest city: Stockholm." The console reveals the judge's pick.
5. **Integrity watch (1:10).** The console switches to the current sky over Ithaca. The phone's real GPS agrees with the sky fix and the status turns green. The cradle now auto-marks every few seconds, reusing the calibration from step 3.
6. **Payoff two (1:20).** The judge turns the red spoofer dial, which offsets the phone's NMEA in transit and drags it about 410 km to Montreal while the residual chart climbs. LED red, grip buzzes. Voice: "GPS is 410 kilometers from the sky fix, outside my 110 kilometer ellipse. Drift began about 20 seconds ago."
7. **Grounding (1:40).** The judge asks "how sure are you?" The answer comes from the covariance, and the guard log shows every spoken number verified, including any real rejected draft. Do not stage a rejection.
8. **Close (1:50).** A prior-art slide: "Sextant apps need a navigator. Research rigs give no verdict. Starfix closes the loop for anyone."

The payoff is a judge's secret location recovered from light alone, then the same instrument catching a real GPS feed being pulled away. Keep a recorded backup of three successful secret-city runs. Use the two minutes of Q&A for the clock trick: offset the solver clock by four minutes and the fix moves one degree of longitude.

## Prize strategy

| Track | Priority | Substantive contribution |
| --- | --- | --- |
| **[SpaceX](../resources/tracks/spacex-make-it-legendary.md)** | **Primary** | Real space data drives every fix: the Hipparcos catalog, Skyfield sidereal time and ephemerides, and spacecraft star-tracker technique. Grok Voice is load-bearing because the user's eyes and hands are on the instrument: it runs the calibration protocol and explains integrity verdicts. All code is written in Cursor, with evidence kept. |
| **[Hardware](../resources/tracks/hardware.md)** | **Primary** | A calibrated optical-inertial instrument, a hardware-in-the-loop sky table, a detented calibration cradle, a physical spoofer dial and haptic and LED alarms. Judges hold it and get a position from starlight. |
| **[BigRed](../resources/tracks/bigred-main.md)** | **Primary** | A literal answer to the theme's first sentence, a live real-world stake, the keynote's correctness problem in adversarial form, and a game the judge plays. |
| **[Software](../resources/tracks/software.md)** | Secondary | Lost-in-space plate solving, gravity-attitude fusion, uncertainty propagation, onset back-dating and a speech guard over LLM output. Not contorted for this track. |
| **[Design](../resources/tracks/design.md)** | Opportunistic | Instrument industrial design, a red-light night interface, and a shrinking ellipse and residual timeline that make the verdict legible at a glance. |
| **[People's Choice](../resources/tracks/peoples-choice.md)** | Opportunistic | A 15-second Devpost hero clip: "judge picks Tokyo, the stars find Tokyo." Push upvotes right after 8:30 AM Sunday. |
| **[GoDaddy Registry](../resources/tracks/mlh-godaddy-registry.md)** | Opportunistic | Register **nogps.club** ("the No-GPS Club") through tech.study with the MLH claim code; backup **skycantlie.us**. Point it at the Devpost and demo video. |

These are **three primary targets, one secondary and three opportunistic entries**, not a prediction of seven wins. SpaceX has the strongest fit because space data and Grok Voice are both load-bearing, but eligibility depends on actually building in Cursor. Enter Beginner only if every teammate is at their first hackathon.

### Integrations to skip

- **Photon:** the user's hands and eyes are on an instrument at night; an iMessage thread adds nothing to the fix or the verdict.
- **Tiger Data:** a few hundred marks per session is not a performance-driven time-series workload.
- **ElevenLabs:** a second voice stack beside Grok Voice reads as a bolt-on.
- **Gemini:** a second LLM muddies the "model never originates a number" story, and the track is crowded.
- **Nessie, Solana, Presage:** no banking, settlement or physiology role in this product.
- **Grok Imagine:** generated imagery would be decoration; use Grok Voice only.
- **DGX Spark:** the solver runs on any laptop. Do not add local inference for its own sake.

A sponsor integration earns its place when improving it also improves the core demonstration.

## Originality analysis

**Qualified pass: not a subfeature of a well-known product (no Google, Apple, Garmin or sky-app feature does this), but each half of the loop exists, so the differentiation must be shown live.** The nearest "trivially addable" risk is PiFinder, a niche open-source finder.

| Existing product or research | Existing capability | Required differentiation |
| --- | --- | --- |
| [GPS Anti Spoof Pro](https://apps.apple.com/us/app/gps-anti-spoof-pro/id1379926231) | Checks sextant sights against GPS-predicted altitudes and flags a mismatch as spoofing. | No sextant, horizon or training: automatic plate solve with a gravity vertical, tested continuously with onset back-dating. |
| [Celestial Programming Digital Sextant](https://www.celestialprogramming.com/apps/celestialfix/sextant.html) | Phone camera, accelerometer and clock give a two-star fix, with a manual GPS compare. | Automatic star identification, azimuth-averaged calibration, and a continuous integrity monitor with a calibrated ellipse and alarm. |
| [CamSextant](https://www.tecepe.com.br/nav/CamSextant/) | Horizon-free star altitudes from phone sensors, then a position after two sights. | Zero-skill sighting and a GPS verdict rather than a position alone. |
| [Digital Sextant DS-10](https://www.bluewatersuperyacht.com/digital-sextant) | Civilian handheld marketed as an un-hackable backup to jammed or spoofed GPS. | Horizon-free and automatic, with an integrity verdict and onset time; concede that it is less accurate. |
| [PiFinder](https://github.com/brickbots/PiFinder) | Handheld with camera, IMU, cedar-solve and GPS, using GPS to label the sky. | Distrust GPS by design; build the vertical calibration and integrity UX a telescope finder lacks. |
| [Izadmehr & Khakian Ghomi](https://arxiv.org/abs/1806.00607) | Portable camera plus inclinometer gives latitude, longitude and north at about 150-200 m. | Do not claim the estimator. Claim the handheld integrity loop and the grounded voice layer. |
| [Teague & Chahl, MDPI Drones 2024](https://www.mdpi.com/2504-446X/8/11/652) | Cheap camera, AHRS gravity and clock give about 4 km on drones; cancels boresight bias across azimuth. | Turn their azimuth trick into a voice-coached protocol a handheld user can follow, feeding a live GPS verdict. |
| [Compass Star Tracker](https://www.researchgate.net/publication/224346871_Compass_star_tracker_for_GPS-like_applications) | States the gravity-referenced star-sensor position principle. | Credit it; the math is not the claim. |
| [Honeywell Celestial-Aided Navigation](https://www.honeywellaerospace.com/us/en/products-and-services/products/navigation-and-sensors/navigation-systems/celestial-aided-navigation) and [Sodern Astradia](https://www.gpsworld.com/astradia-star-tracker-designed-to-fill-in-for-gnss/) | Fielded star trackers for spoof-immune positioning in avionics. | A hand-held civilian cross-check whose every spoken claim is solver-verified. |
| [Visual/inertial/GNSS spoof detection, Sensors 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8539116/) | Residual tests between an independent sensor solution and GNSS. | Same pattern with a celestial witness; credit it for the residual logic. |
| [Generic GPS spoofing detectors](https://github.com/rahulvotarkar/GPS-Spoofing-Jamming-Detection-System) | Telemetry-only impossible-speed and ML checks. | An independent physical witness catches a self-consistent spoof that GPS-only checks miss. |

Put GPS Anti Spoof, Celestial Programming, Izadmehr and Teague on a slide before a judge names them. Claim the loop and the experience, not the math. This is a bounded search of products, papers, repositories and hackathon entries, not proof of novelty or a patent opinion.

## 32-hour build plan and ownership

| Team member | Ownership |
| --- | --- |
| Software engineer 1 | Solver: undistortion, centroids, tetra3/cedar-solve database for the measured FOV, zenith inversion, sky-table mode (one image mirror and one gravity-sign flip), mark averaging, misalignment estimate, covariance ellipse. One `assert` self-check renders a synthetic sky in both modes and must recover the location, catching mirror and sign bugs. |
| Software engineer 2 | Offline console and renderer (Skyfield, Hipparcos, gnomonic projection about the calibrated lens center, magnitude ladder of Gaussian stars), secret-city picker, ArUco setup helper, phone NMEA relay with spoof offsets, and the integrity monitor (ellipse test, onset back-dating, drag detector). |
| Software engineer 3 | Voice path (push-to-talk speech into Grok STT, Grok text responses with tools, guard, Grok TTS, local TTS fallback of the same guarded text), push-to-talk on the trigger, night interface with ellipse, residual timeline and guard log. Owns Cursor evidence and the Devpost. |
| Hardware engineer | Instrument body (webcam cradle and hood, rigid IMU mount, trigger, LED ring, vibration motor, Arduino with Grove shield over USB), six-face accelerometer calibration cube, detented turntable cradle with the lens on its axis, sky-table hood, red spoofer box with a Grove rotary dial. A servo needle on a printed world map only after H18. Real-sky capture whenever the sky is clear. |

Hardware sources: the Logitech webcam, Arduino with Grove base shield and Grove IMU, rotary dial, vibration motor, LED ring and servo come from the MLH rental list (Grove parts depend on table stock; confirm in the first two hours). The body, cradles, turntable, calibration cube, hoods and spoofer box are 3D-printed. The flat monitor, laptops, phones, headset mic and light-box parts are team-supplied or to be sourced; none are MLH rentals.

All three software engineers write every line in Cursor from minute one.

1. **H0-H3, prove the gate first.** SWE1 renders a synthetic Hipparcos frame and solves it directly; it must recover the location within about 0.1 degree at perfect attitude. SWE2 and the hardware engineer point the calibrated webcam at the monitor (exposure locked, maximum brightness, stars at least 3 px, frame cropped to the screen) and measure the solve rate across 20 random rotations. The hardware engineer gets the IMU streaming at about 100 Hz. SWE3 gets one Grok tool call through to TTS.
2. **H3 go/no-go.** Continue if at least 16 of 20 camera frames solve. Otherwise switch to a backlit light box with printed transparencies of real catalog fields, keeping the real IMU. Solving the rendered frame directly is the last resort because it guts the Hardware story.
3. **H12:** first camera-plus-IMU fix in the level cradle. **H16:** measure whether the four-turn protocol shrinks the error; if not, use a boresight calibrated at setup and keep voice as coach only. **H18:** spoof alarm on the real phone feed. **H22:** voice and guard end to end.
4. **H25 (about 1 AM Sunday), feature freeze.** Spend the rest on rehearsals with strangers, the backup video, the Devpost with Cursor evidence, and the domain. Cut the servo map and any satellite-geometry stretch before cutting rehearsal time.

## Early checks (first two hours)

- **IMU availability:** confirm a Grove accelerometer or IMU at the MLH table and note its model. Fallback: strap a second phone to the body and stream its accelerometer.
- **Monitor and webcam:** check the monitor for PWM flicker with a phone slow-motion camera. Confirm the Logitech webcam accepts manual exposure and focus through OpenCV on the solver machine's OS.
- **Phone GPS:** confirm an Android NMEA-over-TCP app gets a fix in the hall. If indoor reception fails, record a real NMEA log outdoors tonight and replay it through the same relay, and say so.
- **xAI:** signup credits are unverified, so prepay $10-20 or ask the SpaceX table. Confirm the realtime voice agent can return text instead of audio; if not, use Grok STT, a Grok chat model with tools, and Grok TTS. Ask the SpaceX table whether that combination satisfies "Grok Voice API". Keep the key server-side.
- **Cursor:** the Hobby plan limits Agent requests; budget Individual seats if needed. Leave the `Co-authored-by: Cursor` trailer on (Settings > Agents > Attribution), commit often from Agent, and export transcripts into the repo. Public shared transcript links need a Teams seat.
- **Weather:** check Ithaca cloud cover for tonight and Saturday night. If it is clear at any point, capture timestamped frames and IMU data outdoors.
- **GoDaddy Registry:** get the real claim code from the MLH prizes page or a coach, confirm .club and .us are offered and the names are not premium, and register early.
- **Prize stacking:** one teammate confirms current limits with organizers.

## Success criteria and risks

- A judge's secret city is recovered to within the stated ellipse from pixels, IMU readings and the clock alone, with the console provably offline.
- The four-turn protocol visibly shrinks the ellipse, or the team states that a setup calibration replaced it.
- A real GPS feed is accepted when honest and flagged within a few marks of a 400 km or larger drag, with an onset estimate.
- Every number and direction spoken is traceable to solver JSON in the guard log.
- The live demonstration fits in two minutes, with a recorded backup.

**Risks.** The camera-on-monitor solve is the single technical gate; the H3 check and light-box fallback contain it. Small rotations off the lens axis cost degrees (1 cm of translation at 30 cm is about 2 degrees), so the level cradle, lens-on-axis turntable and ArUco calibration matter more than extra features. A late sign or frame bug can kill the demo; the dual-mode synthetic assert runs on every commit. Spoof detection is a simple comparison once a fix exists, so the pitch must lead with the independent witness, the calibration protocol and onset back-dating. Hall noise can break voice input; use push-to-talk, a headset mic and the trigger as the authoritative mark. An October real-sky clip in Ithaca is unlikely. Prior art is substantial, so the prior-art slide is part of the pitch, not a defense.

Protect the core demonstration: a judge hides a location, the sky table encodes it only as light, and the instrument recovers it and then catches GPS lying.
