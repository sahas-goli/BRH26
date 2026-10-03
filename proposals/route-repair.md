# RouteRepair - Make an inaccessible route usable

**Recommendation: build a navigation system that coordinates people and hardware to restore a route when no usable path currently exists.**

Researched 2026-10-02 for a team of three software engineers and one hardware person. The objective is to maximize credible opportunities to win multiple tracks. Rankings below reflect sponsor fit, execution cost, and demonstration quality; entrant counts and win probabilities are unknown.

## The idea

A traveler needs a step-free route to a campus event, but both available paths are blocked:

- The short path requires an entrance that only an unavailable building manager can unlock.
- The other path requires an available event volunteer to move a temporary barrier.

RouteRepair compares restoration plans against staff availability, permissions, and route constraints. It asks a specific volunteer through iMessage, obtains their acceptance, and waits for physical confirmation that the barrier has moved. Only then does it provide the restored route.

The central question is: **What is the smallest feasible intervention that would let this person reach their destination?**

The initial audience is staffed venues: campus events, conferences, and temporary installations. The product covers intervention planning, task ownership, completion verification, and maintaining the resulting route. It directly addresses the freshness and grounding problem in the [Navigation theme and keynote notes](../resources/02-theme-navigation.md).

## The two-minute demonstration

Build a small physical model with two routes, movable barriers, sensors, and illuminated paths. Physical changes must drive the working system.

1. A judge blocks both paths. The interface shows that no currently verified route exists.
2. The system compares two restoration plans. One requires an unavailable staff member; the other needs one available volunteer.
3. A real iMessage arrives: "Can you clear the east passage? Reply accept if you can do it."
4. Acceptance changes task status, but does not open the route.
5. The volunteer physically removes the barrier. A sensor confirms the change, the route lights up, and spoken directions become available.
6. The judge closes the route again. The system withdraws it immediately. A late "done" message cannot override the newer physical observation.

The payoff is a physical change that makes an initially impossible journey possible. The demonstration distinguishes a promise, an observation, and the current state.

The model has known accessibility constraints. A sensor establishes a particular barrier's state; it does not certify that an entire real building is accessible. A photograph alone must not certify passability.

## Prize strategy

| Track | Priority | Substantive contribution |
| --- | --- | --- |
| **Photon** | **Primary** | Coordinate real human work through Spectrum/iMessage; track acceptance and completion; handle unavailable people and late replies without unnecessary messages. |
| **Tiger Data** | **Primary** | Store timestamped sensor observations and task events; reconstruct what the system knew at any moment; show why newer evidence invalidates an instruction. Measure actual query performance. |
| **Hardware** | **Primary** | Judges manipulate physical barriers and observe sensors, route indicators, and software respond. The dedicated hardware teammate owns this functioning mechanism. |
| **Gemini** | Secondary | Translate requests and staff messages into structured constraints; interpret a photographed sign or barrier as a proposed observation. Explicit rules determine route validity. |
| **ElevenLabs** | Secondary | Provide an eyes-free interaction explaining the blockage, accepted assistance plan, and updated directions. |
| **Design** | Secondary | Make blocked, help accepted, awaiting verification, and ready states immediately understandable, with simple traveler and volunteer interfaces. |
| **GoDaddy Registry** | Low-cost opportunity | Register a memorable navigation-related domain through the qualifying program. Check supported suffixes and availability first. |

These are **three primary targets and four secondary opportunities**, not a prediction of seven wins. The [current MLH prize page](https://www.mlh.com/events/bigred-hacks-2026/prizes) confirms the relevant sponsor categories; the [Photon brief](../resources/tracks/photon-imessage-agents.md) particularly rewards contextual human collaboration and credible fallback behavior.

Enter **BigRed** and **Software** without adding features solely for those awards. Pursue **People's Choice** through a demonstration people enjoy trying. Enter **Beginner** only if every teammate qualifies.

### Integrations to skip

- **Presage:** physiology does not solve the central problem, and measurement constraints complicate a moving, talking demonstration.
- **Nessie:** paying volunteers or adding a transport fund creates a second product story. The funded-fallback alternative also has substantial existing-product overlap.
- **Solana:** this workflow has no compelling shared-trust or settlement requirement.
- **SpaceX:** Cursor plus Grok Imagine/Voice would consume effort without strengthening this concept. The [track notes](../resources/tracks/spacex-make-it-legendary.md) also record conflicting written and spoken guidance about a space component.

A sponsor integration earns its place when improving it also improves the core demonstration.

## Originality analysis

**Qualified pass, provided physical restoration is the core.** Accessible maps, live obstacle reports, and AI directions already exist.

| Existing product or research | Existing capability | Required differentiation |
| --- | --- | --- |
| [MazeMap](https://www.mazemap.com/accessibility) | Accessible routing and updates for temporary obstacles. | Choose and execute an intervention when no usable route currently exists. |
| [AccessNow Verified](https://accessnow.com/verified/) | Expert accessibility assessments and verified information. | Coordinate a specific, immediate restoration task for a particular journey. |
| [Be My Eyes](https://www.bemyeyes.com/bme-app/) | Human and AI visual assistance. | Reason over alternative routes, staff permissions, task ownership, and completion evidence. |
| [AUTOCRYPT mobility platform](https://autocrypt.io/wp-content/uploads/2023/05/2023.05-AUTOCRYPT-Mobility-Solutions-Brochure-v1.0_c.pdf) | Barrier reporting, accessible routing, and sharing barriers with governments for removal. | Close the immediate loop between choosing a feasible repair, securing a commitment, observing completion, and releasing the route. |
| [Robot-assisted obstacle removal research](https://sites.psu.edu/real/projects/interactive-and-collaborative-robot-assisted-emergency-evacuation/) | Planning and physically clearing navigation obstacles. | A human coordination product for staffed venues; do not claim the underlying obstacle-removal planning is a new invention. |

"Report obstacle, notify facilities, update map" is readily recognizable as a maps or maintenance feature. The stronger product compares competing restoration plans under limited staff availability, obtains commitments, verifies physical outcomes, and keeps the traveler informed throughout.

The research did not find that complete workflow in the products reviewed. This is a bounded competitive analysis, not proof that no similar product exists or a claim of patent novelty. See [researched alternatives](researched-alternatives.md) for ideas rejected after competitive checks.

## Weekend scope and ownership

Limit the build to **one authored venue map, two alternative routes, a few obstacles, and two staff roles**.

| Team member | Ownership |
| --- | --- |
| Software engineer 1 | Route and intervention planning; Tiger Data event history. |
| Software engineer 2 | Photon conversations, commitments, expiry, and late-reply handling. |
| Software engineer 3 | Traveler and staff interfaces; Gemini and ElevenLabs after the core works. |
| Hardware engineer | Physical model, sensors, route indicators, and reliable event delivery. |

Use the DGX Spark only if a specific local inference task needs it. Its presence alone is not a competitive advantage. Select sensors and indicators from verified available hardware; keep the fixture simple enough to finish and demonstrate repeatedly.

Prove hardware-to-route updates and a real Photon message exchange first. Build the complete blocked-route, accepted-task, verified-restoration loop before secondary integrations. Reserve the final six hours for reliability, presentation, and submission. The [judging format](../resources/01-general-info-doc.md) allows only two minutes for the initial pitch.

## Success criteria and practical risks

- Start with no usable route and select a feasible intervention using the actual staff availability and permissions in the scenario.
- Receive a real human acceptance through Spectrum/iMessage.
- Keep the route unavailable until the physical completion condition is observed.
- Withdraw the route when fresh evidence invalidates it; reject obsolete task completions.
- Show what happens when nobody accepts or evidence is insufficient: no verified route yet, with a clear status.
- Replay the observation and task sequence that explains the decision.
- Complete the live demonstration within two minutes.

**Photon account capability is an early check.** Pro does not support creating group chats or receiving group membership changes. Existing-group support has limitations; Business dedicated lines support fuller group workflows. Use only behavior proven on the actual account. [Photon connection and routing documentation](https://photon.codes/docs/spectrum-ts/providers/imessage/connection-and-routing)

**Prize stacking remains unverified for this event.** The repository records historical stacking, but permission to enter multiple tracks does not necessarily imply unlimited simultaneous awards. Have one teammate confirm current limits with organizers while the others begin.

Protect the core demonstration: the judge creates a situation with no usable route, and the system coordinates a physical change that makes the journey possible.
