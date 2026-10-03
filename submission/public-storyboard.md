# Six Hops public-site demo storyboard

**Preflight.** Film from `https://brh26-brh-26.vercel.app`. The URL redirected to a Vercel login when this shot list was prepared, so first remove deployment protection or use the authorized public production URL. Do not substitute local pages or expose a private link. Start with the seeded featured cascade selected on `/live`.

| Time | URL / path | What is on screen | Voiceover |
|---:|---|---|---|
| 0:00–0:12 | `/` | The Six Hops landing page and its featured bounty card: attribute-led target, current reward, and **Follow this search**. | “The person you need is usually only a few friends away. Six Hops turns that local knowledge into a search without copying anyone’s social graph.” |
| 0:12–0:25 | `/post` | The bounty form: a city-level, attribute-only hint, reward cap, deadline, and the create action. | “A poster describes attributes, never a name or street address. They fund one fixed cap, then receive a personal first-hop link.” |
| 0:25–0:48 | `/live` | The cascade graph fills the main panel; depth colors make the route legible. The branching-factor dial and `b` readout are visible. | “Each holder picks up to three people who may be closer. The live cascade shows the search moving through those choices. When branching factor `b` falls below two, a search is at risk of stalling.” |
| 0:48–1:02 | `/live` | Stay on the dial, controller step, and received/forwarded time series. | “The controller reacts before the search dies: nudge, widen the hint, then raise the reward only when needed.” |
| 1:02–1:22 | `/h/<public-token>` | A holder’s wanted card, attributes-only chips, remaining-forward count, and the one-to-three recipient form. | “This is the private hop view. A holder sees only the hint card and can forward to at most three people; the chain stops at depth eight.” |
| 1:22–1:34 | `/claim/<public-token>` | The target’s introduction form, followed by the found-state confirmation message. | “Claiming is an introduction, not an automatic payment. The poster must confirm before the chain is paid.” |
| 1:34–1:52 | `/h/<poster-token>` then `/live` | Poster confirmation, then the cascade’s paid state and payout evidence. | “After the poster confirms, every winning hop is paid from one fixed bounty. The poster never learns who forwarded through the chain.” |
| 1:52–2:00 | `/live` | Attack slider at `k=0`, then move it once to `k=1`; keep the paired Six Hops and MIT bars in frame. | “Adding a fake recruiter changes nothing under our split: Six Hops gives the finder zero extra gain while the older rule rewards padding.” |

## Hop-shot contingency

There was no public `/h/<token>` link visible at preparation time, and the deployed site was login-protected. The missing click is: create or select the seeded featured bounty, open its poster link, forward once, then film the resulting child `/h/<token>` URL. If that access is still unavailable at filming time, omit the hop interaction rather than showing a local URL; retain the `/live` explanation and say that the protected deployment must be made public before the final recording.

## Framing rules

- Keep the cascade, `b` dial, and attack comparison legible at projector and phone scale.
- Say “attributes only” once; do not display names, street addresses, contact handles, badge flows, HOTP, or a hardware game.
- Use only test/demo funds language for the payout, and do not imply a live bank balance when Nessie remains in mock or record mode.
