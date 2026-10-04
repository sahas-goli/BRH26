# Six Hops — table-judging slide outline

This is a 2-minute deck outline for the BigRed//Hacks table. Capture fresh screenshots from the public app before presenting; use the backup video if the network is unreliable.

## Slide 1 — Six Hops: find your person, one friend at a time

- **Team:** team names: fill at the table.
- **One-line premise:** a bounty for someone you cannot search for travels through people who may know the next person.
- **Visual:** the Six Hops home page at [sash.select](https://sash.select/), with the “find your person” headline visible.

**Speaker notes — 0:00–0:20:** “The person you need is usually two to four hops away in someone’s private contacts. Jon Kleinberg showed local knowledge can navigate social networks. We made the chain pay correctly.”

**BigRed criterion:** **theme adherence** — navigation is the product’s core action; **creativity** — people route a search without Six Hops copying their social graph.

## Slide 2 — The problem: private networks are useful but hard to search safely

- Search engines and professional directories cannot see the trusted, private connections that often lead to the right person.
- A relay chain normally dies because forwarding takes effort and has no reason to continue.
- The design constraint: show only attribute-level hints (city-level location, field, skill, experience), never a name or street address; the target must opt in.

**Speaker notes:** “We need the usefulness of local knowledge without building a directory of everyone’s contacts. The poster does not see the chain, and the target decides whether to introduce themselves.”

**BigRed criterion:** **overall impact** — helps a requester reach people they cannot search for while keeping the network private; **design** — privacy is part of the interaction model.

## Slide 3 — The solution: a bounded, private forwarding loop

- A poster creates a bounty and an attribute-only hint card at `/post`.
- A holder opens a personal `/h/[token]` link, sees their depth, and forwards to one to three people they think are closer.
- The chain stops at depth eight. A target uses `/claim/[token]` to send an introduction; the poster confirms before payout.
- **Screenshot:** use `/post` beside a fresh `/h/[token]` page, with the depth indicator, forward rows, and “this is me” link visible.

**Speaker notes — 0:20–0:50:** “The demo follows a cascade and its depths. When branching drops below two, the controller can widen the hint before the search dies. At the table, a judge can forward from a fresh link; iMessage is an optional delivery path.”

**BigRed criterion:** **design** — a mobile-first, one-screen hop flow makes the next action clear; **theme adherence** — every forward is a navigation decision using local knowledge.

## Slide 4 — What a six-hop chain pays

Use a $16 reward (1,600 cents). The poster gets nothing. The $16 never grows. One paid person, the match, gets all $16. From two people on, the match's share stays at $9. Every passer except the last gets $1. The last passer gets what is left.

| Chain | Paid |
| --- | --- |
| Riley is the match | Riley $16 |
| Riley passed to Sam, and Sam is the match | Riley $7, Sam $9 |
| Riley passed to Sam, Sam passed to Alex, and Alex is the match | Riley $1, Sam $6, Alex $9 |
| A full chain of 8 | six early passers $1, the last passer $1, the match $9 |

If every person passes the card to three friends, six rounds ask 1,092 people. The same $16 is the entire payout, so someone who only sees the card expects about a cent and a half. A chain longer than eight pays nobody.

A last passer who adds one hop they control collects the same total. An earlier passer who adds one hop they control gains $1, taken from the last passer, and can lose the payout if the chain never finds the person. The match who adds one hop they control keeps $9 on the new phone and also collects the new last-passer share. The MIT split would pay that person 50% more for one fake recruiter, 75% for two, 88% for three, and 94% for four.

**Speaker notes:** “Sixteen dollars. Riley alone gets sixteen. Riley to Sam: seven and nine. Riley to Sam to Alex: one, six, and nine. Eight people: six early passers get a dollar, the last passer gets a dollar, and the match gets nine. Ask a thousand people and the expected payment per ask is about a penny and a half, because only the winning route is paid.”

**BigRed criterion:** **technical** — the payout is a fixed split, not a growing pot; **creativity** — local routing is paid from that fixed reward.

## Slide 5 — Make the chain worth completing, without rewarding fake hops

- One fixed poster-funded bounty is split across the winning chain after target opt-in and poster confirmation.
- The `/live` demo presents cascade depth, branching factor, and an attack slider.
- The attack comparison shows the MIT-style rule can reward a finder for inserting fake recruiters (+50%, +75%, +88%, +94% for one through four fakes). Six Hops keeps the poster total fixed. The match who adds one hop keeps the match payout and also collects the new last-passer share. A last passer who adds one hop collects the same total.
- **Screenshot:** `/live` with the cascade, branching display, and attack comparison.

**Speaker notes — 1:15–1:40:** “A teammate plays the target, sends an introduction, and the poster confirms. The payout path is a single devnet multi-payee transaction when available. The match who adds one hop keeps the match payout on the new phone and also collects the new last-passer share. A last passer who adds one hop collects the same total.”

**BigRed criterion:** **technical** — the split, depth cap, and attack simulation turn a social-routing idea into a testable incentive system; **creativity** — combines search navigation with anti-sybil payout design.

## Slide 6 — What is actually in the repo

- **Next.js + TypeScript:** public pages for `/`, `/post`, `/h/[token]`, `/claim/[token]`, and `/live`; API routes for bounties, forwarding, claims, confirmation, graph, stats, controller, and attack simulation.
- **Tiger/Postgres:** bounty, holder, payout, and event data; event analytics and continuous aggregates support the live cascade and controller measurements.
- **Solana devnet:** per-edge memo commitments and an atomic multi-recipient payout implementation.
- **Sponsor integrations behind honest flags:** Nessie escrow/transfer records, Photon iMessage agent flows, Gemini hint-card sanitization, and xAI Grok voice / wanted-card generation. The table demo labels any unavailable live rail as mock rather than claiming settlement.
- **Simulation:** a replay and sweep data support the scale and branching-factor demonstration.

**Speaker notes:** “This is a working web product plus the systems behind it. We use mocks when a sponsor rail has not passed its go/no-go, but the same product flow and event records remain demonstrable.”

**BigRed criterion:** **technical** — real application routes, database analytics, payout logic, tests, and replay; **design** — the system degrades to a usable link flow when an optional integration is unavailable.

## Slide 7 — Demo close: why it matters and what comes next

- **Impact now:** a requester can ask a trusted network for help without exposing a target’s identity or importing anyone’s address book.
- **Near-term next steps:** complete live sponsor-rail verification, register table phones for the iMessage path, and collect real cascade metrics alongside the labeled synthetic replay.
- **Success measure:** short, consenting routes to the right person, with an explainable payout and no gain from fake hops.
- **Closing visual:** return to the homepage or the live cascade with the final winning path highlighted.

**Speaker notes — 1:40–2:00:** “Use the attack slider to close: MIT’s finder gains from fake recruiters; ours gains zero and the poster’s total never changes. Six Hops makes decentralized search navigable, private, and worth finishing.”

**BigRed criterion:** **overall impact** — useful access to hard-to-reach people without a central social graph; **theme adherence** — every outcome is a transparent route through human knowledge.

## Slide 8 — Q&A / table backup

- **“Is this a pyramid scheme?”** Nobody pays to join; one poster funds a fixed total, depth is capped at eight, and money flows only after the target opts in and the poster confirms.
- **“Does this expose contacts?”** No: the product uses attribute-only hint cards and personal links; it does not expose chain members or contact handles to the poster.
- **“Why not LinkedIn?”** LinkedIn centralizes a graph; Six Hops asks people to route using their own local knowledge without copying that graph.
- **“What if an integration is down?”** Demonstrate the `/h` link flow and the backup video, and state whether the shown payout or bank rail is live or mock.

**Speaker notes:** Keep this slide hidden unless asked. Answer with the current demo state, then return to `/live` or the backup video rather than improvising unsupported results.

**BigRed criterion:** reinforces **technical**, **design**, **creativity**, **overall impact**, and **theme adherence** with concrete, honest answers.
