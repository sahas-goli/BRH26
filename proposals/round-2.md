# Round 2 ideas (2026-10-03)

Bar for this round, from team feedback on round 1: the core mechanism must itself be interesting. Not "LLM + API with a twist" (Deep Field Radio) and not an old technique that real navigators already have (Starfix vs. a sextant). It must also be useful. Research precedent is fine; a well-known product is not.

Each idea has a go/no-go test in the first 2-3 hours so we can bail early.

## 1. Inner Map: watch an AI get lost (recommended)

**Trick.** An LLM stores a literal world map in its activations. A linear probe on the hidden state of a place name reads out its latitude and longitude ([Gurnee & Tegmark, ICLR 2024](https://github.com/wesg52/world-models)), and intervening on that representation changes what the model says ([More than Correlation, 2023](https://arxiv.org/pdf/2312.16257)). We read that map live, use it, and edit it.

**What it does**
- **Read:** for any place, show where the model *believes* it is next to where it really is. The result is a warped "alien's Earth" map plus error by region, which shows where AI directions will fail first (measure it; don't assume).
- **Catch:** before an LLM gives directions, check each landmark it mentions against its own internal map. If the internal map is blurry for that landmark, that leg goes to a real map tool. This answers Kleinberg's open problem (when to trust the LLM and when to trust the map) using the model's own head, before it speaks.
- **Steer:** roll a 3D-printed globe trackball and the new location is written into the model's activations. Then the model narrates where it thinks it is standing, which teleports the AI's sense of place.

**Demo (2 min).** A judge names their hometown and a dot shows where the model thinks it is. Then we ask for the walk from Collegetown Bagels to Gates Hall, and the screen flags the landmark the model has misplaced *before* it is said. Last, the judge spins the globe and the AI starts describing a street market in Lagos.

**Build (DGX Spark).** Run Llama 3.1 8B with HF transformers (70B in FP8 if time allows; the Spark is why we can probe a 70B at all). Dump the residual stream at place tokens for about 40k places from the world-models CSVs plus Ithaca POIs from OSM, then fit a ridge probe (takes minutes). Steer by adding pinv(W)·(target − current) at middle layers, with mean-activation patching as the fallback. The map UI uses deck.gl. The globe is a 3D print with a gutted USB optical mouse as the rotation sensor.

**Split**
- SWE1: probes and steering.
- SWE2: hallucination-catch eval (probe error vs. the model's verbal coordinate error over about 500 places) and the trust-or-map router.
- SWE3: map UI.
- HW: globe trackball and enclosure.

**Go/no-go (hour 3):** the world-places probe reaches R² ≥ 0.7 on the 8B. Steering is the risky part. If it only half works, Read and Catch still stand.

**Tracks**
- BigRed: Kleinberg's "alien looking down at Earth," made literal.
- Software: interpretability depth.
- Design: the warped map.
- SpaceX: probe the model's map of Mars and the Moon from the [IAU planetary nomenclature](https://planetarynames.wr.usgs.gov/) (real space data). Grok Voice is the alien's voice, Grok Imagine paints a "postcard from where the AI thinks it is," and the build is done in Cursor.
- GoDaddy and People's Choice.
- Hardware is weak.

**Precedent:** research only, no product.

## 2. Echo Mesh: phones map each other with sound

**Trick.** Two phones can measure the distance between them to about 2 cm with no clock sync ([BeepBeep, MSR 2007](https://www.microsoft.com/en-us/research/wp-content/uploads/2007/11/demo_sensys07_beepbeep.pdf)). Each phone records both beeps, its own and the other's, in one recording, so the clock offsets cancel. Do that for every pair, then multidimensional scaling turns the distance table into a map ([multi-phone version](https://arxiv.org/pdf/1512.05103)). It needs no GPS, Wi-Fi, UWB or app install, only a web page.

**What it does.** Open a URL and your phone joins the mesh and chirps near-ultrasonic sound (17-21 kHz). A live map of every phone in the room appears. Pick a friend and your phone shows an arrow and a distance. It works indoors, on any phone, with iPhones and Androids mixed (Find My Precision needs UWB on both ends and Apple on both).

**Use:** find a person in a packed hall, concert, hospital or subway; rescue teams in GPS-dead buildings; a classroom seat map that builds itself.

**Demo.** Judges scan a QR code and their phones pop up on the big screen, in the right places around the table. One judge walks off and their dot follows.

**Build**
- A server schedules the chirps over WebSocket.
- Phones record raw audio with getUserMedia, with echoCancellation, noiseSuppression and autoGainControl all off, and upload windows around each chirp.
- The server matched-filters the audio, computes two-way ranges, runs MDS, and uses the compass heading for orientation.
- MLH Echo Dots or Google Homes at known spots act as fixed anchors that pin the map to the floor plan.

**Go/no-go (hour 3):** two phones 3 m apart range with < 15 cm error in hall noise, iPhone Safari included.

**Tracks**
- BigRed and Software.
- People's Choice: the judges become part of the demo.
- Photon: "where's Sam?" gets the reply "9 m, your 2 o'clock" over iMessage.
- Tiger Data: the ranging stream as a hypertable.
- GoDaddy: mic access needs an HTTPS URL anyway.
- Hardware (the anchors) is weak.

## 3. Corner Sight: see around corners with a webcam

**Trick.** The floor at the base of a wall edge acts as a camera. Each floor point sees a wider slice of the hidden side as you sweep around the corner, so differencing intensity by angle recovers a 1-D video of what is behind the wall ([Bouman et al., ICCV 2017](https://openaccess.thecvf.com/content_ICCV_2017/papers/Bouman_Turning_Corners_Into_ICCV_2017_paper.pdf)). The signal is about 0.1% of brightness, and averaging thousands of pixels pulls it out.

**What it does:** a blind-corner radar for wheelchairs, robots, cars, or anyone turning a corner. "Person behind the wall, 40° left, coming toward you."

**Demo.** A judge walks behind a partition at the table and the screen tracks them live. In the miniature version, a 3D-printed intersection has a robot car that stops before a hidden toy car appears.

**Build.** Start from MIT's open code ([vye16/corner-camera](https://github.com/vye16/corner-camera); OpenCV, works on a live webcam). Our work: lock the exposure, run it in real time, use two corners for 2-D position, add the approach warning, and make the car stop.

**Go/no-go (hour 2):** the trace shows a person moving under venue lighting. Lighting is the big risk.

**Tracks:** BigRed, Hardware (strongest hardware story here), Software. Weak sponsor fit.

## 4. Bat Time: hear the room like a bat

**Trick.** Echoes arrive too fast for human hearing; a wall 1 m away answers in 6 ms. Record a click's echoes with two mics set in 3D-printed ears, then play them back 10-20x slower. Distance becomes an audible delay, and the left/right delay between ears stretches from a fraction of a millisecond to several milliseconds, so direction becomes obvious. You hear walls, doorways and people. Sonic Eye (Berkeley, 2015) did this with ultrasound.

**Use:** an echolocation aid and trainer for blind travelers, instead of a buzzing belt.

**Demo:** a blindfolded judge points to where another judge is standing.

**Risk: parts.** It needs a speaker and two decent mics sampled together at 48 kHz or more (a USB stereo interface or a phone's stereo mic). None of this is in the MLH list. Check at hour 0 and drop the idea if the parts aren't there.

**Tracks:** Hardware, BigRed.

## Wildcard: Pull, a handheld that tugs you

Asymmetric vibration (fast push, slow return) from a voice coil makes the hand feel a steady pull in one direction, even though nothing is pulling (Traxion, Rekimoto 2013; NTT Buru-Navi). The result is a puck that leads you like a guide-dog harness. It needs a voice-coil actuator or LRA plus an amp. The MLH Grove vibration motors are ERM and will not work, so this is only an option if the hardware person already has the parts.

## Pick

**Inner Map.**
- It has the best BigRed story: it answers the keynote's own question with a mechanism, not a prompt.
- It reaches the most tracks.
- The only risk is software.
- The DGX Spark is the reason we can do it at all.

**Echo Mesh** has the best table demo and the best People's Choice hook. Pick **Corner Sight** if the Hardware track matters most.
