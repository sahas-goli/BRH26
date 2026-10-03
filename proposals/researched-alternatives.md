# Researched alternatives

Shortlist research dated **2026-10-02**, captured from the project discussion. These ideas ranked below [RouteRepair](route-repair.md) for a team of three coders and one hardware person seeking several credible prize targets. They are retained as alternatives, not equal recommendations.

The rankings are qualitative judgments about differentiation, sponsor fit, and weekend execution. They are not win probabilities. The competitive review is bounded to the cited sources and does not guarantee product novelty.

## Family scam simulator

**Concept:** Let a family practice recognizing and responding to a simulated financial scam before a real incident occurs.

A participant receives a simulated suspicious call, discusses it with a trusted family member, and decides whether to authorize a mock transfer. The debrief explains the warning signs and whether their verification process prevented the payment. Use consenting participants and synthetic or permissioned voices.

| Potential track | Natural contribution |
| --- | --- |
| ElevenLabs | Realistic spoken scam scenarios and conversational practice. |
| Photon | Trusted-contact verification and family coordination through iMessage. |
| Nessie | Simulated banking actions and transaction consequences. |
| Presage | An optional experiment observing physiological responses during training; difficult to justify as a core feature. |

**Originality concern:** [TrustboxAI](https://trustboxai.com/) already offers simulated family voice-clone calls and family verification follow-up. [Cyber Shield](https://cybershield.cascadecybercare.com/) already offers AI voice scam scenarios and team analytics. The training loop has substantial existing product overlap.

Adding mock banking or pulse measurements would not, by itself, establish a distinctive product. Presage also introduces measurement constraints that complicate a demonstration involving conversation and movement.

**Why it ranked lower:** Several sponsor integrations fit, but the central experience risks being a feature of existing scam-training products. It also gives the hardware teammate a weak role.

**What would need to change:** Identify an underserved user and a specific failure in existing verification workflows, then demonstrate a new, measurable recovery or coordination capability. More realistic voices and additional scenario types are insufficient differentiation.

## Bioadaptive space mission simulator

**Concept:** A small team navigates a simulated space mission while physical controls, telemetry, and physiological signals affect the experience.

Players take different crew roles, respond to an injected equipment failure, and coordinate a recovery. A sensor stream could influence task pacing or assistance, with the mission timeline showing how conditions and decisions changed.

| Potential track | Natural contribution |
| --- | --- |
| SpaceX | A space-themed experience using the required Cursor and Grok Imagine/Voice combination, subject to confirmed rules. |
| Presage | Physiological signals informing an explicit gameplay or assistance decision. |
| Tiger Data | Time-series mission events, sensor observations, and replay. |
| Hardware | Physical mission controls and instrumented props. |

**Originality concern:** [NASA APACHE](https://ntrs.nasa.gov/citations/20240007334) combines planetary environments, crew biosensors, multiple roles, and injected failures. [Space Connection](https://www.scitepress.org/papers/2016/59484/59484.pdf) establishes multiplayer space biofeedback precedent. Space missions with physiological adaptation already have substantial research precedent.

**Why it ranked lower:** It could make an engaging demonstration, but the proposed core has weak differentiation and several demanding systems to integrate. Movement and conversation also complicate physiology-based interactions. The repository records conflicting written and spoken guidance about the SpaceX track's space component; verify eligibility before building around it.

**What would need to change:** Develop a specific cooperative mechanic whose value can be demonstrated without claiming that bioadaptive space simulation itself is new. Establish that the physiological input changes a meaningful decision and works reliably during the intended interaction.

## Plan B: accessible journey with a funded fallback

**Concept:** When an accessible journey fails, coordinate an alternative and the person authorized to pay for it.

A traveler encounters a blocked route. The system contacts a caregiver or organizer, proposes replacement transport, obtains a spending decision, and tracks the fallback journey. A hackathon prototype could use mock banking to demonstrate the funding decision without moving real money.

| Potential track | Natural contribution |
| --- | --- |
| Photon | Coordinate the traveler, caregiver, and organizer through iMessage. |
| Nessie | Simulate funding approval and the resulting payment state. |
| Tiger Data | Preserve the disruption, approval, and journey event timeline. |

**Originality concern:** [Uber Caregiver](https://www.uberhealth.com/us/en/caregiver/) already combines coordinated transportation, payment delegation, and communication. A funded fallback risks being an extension of that existing product category.

**Why it ranked lower:** Funding adds a second product story to accessible navigation, with limited distinctive value unless the team solves a coordination problem existing transport services cannot handle. The hardware contribution is also less central than in RouteRepair.

**What would need to change:** Show a concrete recovery workflow across services, permissions, or physical constraints that cannot be reduced to booking and paying for another ride. Demonstrate why those constraints require a separate product.

## Why the route idea evolved

A passive accessible-route monitor also failed the subfeature test: accessible routing, obstacle reports, and human visual assistance already exist. Relevant overlaps and sources are documented in [RouteRepair's originality analysis](route-repair.md#originality-analysis).

RouteRepair's proposed distinction is to compare feasible physical interventions, secure a responsible person's commitment, verify the resulting change, and only then release the restored route. Preserve that complete workflow if pursuing it; a map that reports a barrier and notifies facilities loses the strongest differentiation.
