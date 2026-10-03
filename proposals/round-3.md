# Round 3 ideas (2026-10-03)

Bar for this round: win as many sponsor tracks as possible with one project, copying the Phantom Pool pattern (one core product with a clever mechanism, plus one spoke per sponsor where that sponsor's specific properties make it the right tool for a real, working sub-feature). The core must still clear the round 1 and 2 bar: fundamentally interesting (not "LLM + API with a twist", not a technique practitioners already use by hand), useful to a real someone, not an obviously well-known product, and buildable by 3 SWEs and 1 hardware person in the roughly 20 build hours left (H0 = 04:00 Saturday, submit by 08:15 Sunday).

> **Clock note (07:30 Sat):** every schedule below assumes work started at 04:00 Saturday. The workflow finished at 07:27, so shift each plan by about +3.5 h, keep the 05:00 Sunday code freeze and 08:15 submit, and take the lost time out of sleep blocks and the cut-order spokes, not the critical path. Go/no-go tests marked "by 7:00" now mean "by 10:30".

## Summary

| Rank | Proposal | One line | E raw | E adjusted | Feasibility | BigRed /10 | Interesting /10 | Tracks |
|---|---|---|---|---|---|---|---|---|
| 1 | [Six Hops (milgram.study)](#1-six-hops-milgramstudy) | A bounty for a person you can't search for moves friend to friend by greedy forwarding; one Solana transaction pays the chain with a split under which a finder gains nothing by faking hops | 2.3 | 1.9 | 0.7 (was 0.6) | 7.5 | 8 | 12: Solana, Tiger, Photon, BigRed, Nessie, SpaceX, GoDaddy, Software, Hardware, People's Choice, Design, Gemini (long shot) |
| 2 | [Hum](#2-hum-a-time-fix-for-any-recording) | The grid's frequency wander, read from a recording's hum, says when and on which grid a clip was made; a capture link plus a Solana anchor gives a two-sided proof of time | 1.95 | 1.65 | 0.6 | 6.5 | 8 | 13: Tiger, Solana, Hardware, SpaceX, Presage, Software, GoDaddy, Photon, BigRed, ElevenLabs (gated), Design, Gemini (stretch), People's Choice |
| 3 | [Saywhere](#3-saywhere) | A Bayes filter over map cells and heading asks the question worth the most bits and turns a lost caller's answers into a pin with an honest confidence ring | 2.1 | 1.6 | 0.55 (was 0.65) | 7.8 | 7.8 | 13: BigRed, SpaceX, ElevenLabs, Tiger, Photon, Gemini, GoDaddy, Hardware, Design, Software, People's Choice, Presage (gated), Solana (gated) |
| 4 | [Felt Horizon](#4-felt-horizon) | A live inner-ear model forecasts your next vestibular illusion seconds before your body produces it, proven in a swivel chair | 2.0 | 1.5 | 0.6 | 7 | 8 | 10: Presage, SpaceX, Tiger, Hardware, BigRed, Design, Software, GoDaddy, Photon, People's Choice |
| 5 | [Neither Home](#5-neither-home) | Two people who must not learn each other's address get a fair meeting place through blinded yes/no questions with a phone-enforced leakage bound, then a signed-QR kiosk and bank escrow | 1.7 | 1.25 | 0.6 | 6.5 | 7.5 | 11: Solana, Nessie, Hardware, Software, Photon, Tiger, BigRed, SpaceX, GoDaddy, Gemini, Design |

**How the numbers work.**
- **E raw** is the sum of the one-pager's per-track p_win, cut by 15% for correlated failure (one bad integration night hurts every spoke). Six Hops and Saywhere already carried that cut in their one-pagers. Hum, Felt Horizon and Neither Home did not, so their E raw here is lower than the figure in their own write-ups.
- **E adjusted** = feasibility × E raw + (1 − feasibility) × fallback E, where fallback E is what still wins if the core gate fails:
  - Six Hops 1.0 (replay, split, Tiger, GoDaddy and Design survive a dead live loop);
  - Hum 1.2 (narrowed to mains-powered recorders; stations, Tiger, Solana, Hardware and GoDaddy unchanged);
  - Saywhere 1.0 (lunar-led demo keeps SpaceX, Hardware, Tiger and Design);
  - Felt Horizon 0.7 (pivot at 07:00 with shared setup carried over);
  - Neither Home 0.6 (pivot at 09:00, five hours lost).
- **Feasibility changes.**
  - Six Hops 0.6 to 0.7: it has no physics or perception gate. Every piece is a web, chain or database API of the kind the team shipped in Phantom Pool, and the idea dies only if Photon and Solana both fail.
  - Saywhere 0.65 to 0.55: it has the widest integration surface of the five (Grok Voice, ElevenLabs on a Twilio number, Photon, Gemini text and vision, a raycast raster, a relief print, a pan-tilt laser, a lunar map). Its 07:00 real-map gate was also scheduled before the line-of-sight masks (09:00) and gazetteer (11:00) exist; fixed in its go/no-go below.
- Differences under about 0.2 are noise. BigRed stacking with sponsor prizes is unverified (ask organizers at 04:00).

## Pick

**Build Six Hops.**
1. **Highest adjusted expected wins (1.9),** and the clearest lead once everything is discounted the same way.
2. **Lowest kill risk.** Hum depends on phones picking up mains hum, Felt Horizon on a chair rig and perception test, Saywhere on a hand gazetteer and human trials. Six Hops depends on code and APIs. Its weakest point (thin live data) weakens the demo but cannot kill it, because the 1M-node replay carries the numbers.
3. **Closest copy of Phantom Pool.** The core is mechanism design with a provable property (a finder's fake hops earn exactly zero, shown live against MIT's +94%), as Phantom Pool's core was commit-reveal. The spokes are load-bearing in the same way:
   - Solana: one atomic multi-payee transaction plus per-edge commitments, which an EVM chain would need a contract for;
   - Photon: forwarding inside iMessage is the core user action, not a side channel;
   - Tiger: a continuous aggregate of the branching factor drives the controller;
   - Nessie: real escrow, refund and release in the loop.
4. **Theme.** "Navigation in a small world" is the keynote speaker's own Nature paper. No other finalist answers the brief that directly.
5. **Known weak spots,** with answers in its Risks section: the Hardware spoke is the weakest of the five (p 0.20); the overnight game will be small; and "pyramid scheme" is the first thing a judge may say.

**Runner-up: Hum.** It has the most surprising core ("your phone recorded the power grid", with the judge's own pitch timestamped by it) and the strongest Tiger spoke of any finalist, and its three best spokes survive its main physics risk. Pick it instead if the team would rather lead with a physical wow and accept the 05:00 signal gate. Expect one objection that echoes the Starfix rejection: forensic labs have used ENF since 2005. The answer is that journalists and witnesses lack the reference, not the technique; Hum supplies an open US reference its operator cannot backfill.

**Switch rule.** Start Six Hops at 04:00. If its go/no-go A (Photon) and B (Solana) both fail by 07:00, switch to Hum. The shared setup (Tiger service, Solana devnet keys, Cursor seats, xAI credits, domain code) carries over.

**Likely objections to the others.** Saywhere: "phones have GPS" and "Akinator on a map". Felt Horizon: "pilots are already trained to trust the attitude indicator". Neither Home: a two-minute pitch cannot carry blinded questions, the K-cell guard, a kiosk, escrow and a stalker rerun.

---

## 1. Six Hops (milgram.study)

Post a bounty for a person you can't search for. It moves friend to friend, each holder passing it to up to three contacts they think are closest to the target. When the target opts in, the whole chain is paid in one Solana transaction, using a split under which a finder gains nothing by faking extra hops.

### Trick

A short path from you to almost any stranger already exists, but nobody can see it. Six Hops gets strangers to find it by combining three published results. Kleinberg, the keynote speaker, wrote two of them.

1. **Navigability** (Milgram 1967; Kleinberg, Nature and STOC 2000). People who see only their own contacts can still find short paths by greedy forwarding, as long as each hop knows something about where the target sits. Each hop sees a hint card (city, organization type, skill, language, experience) and forwards to at most 3 contacts, ranked closest first. Kleinberg's result says greedy routing needs only one; the other two are insurance. Dodds, Muhamad and Watts (Science 2003) showed that chains die mostly from attrition, not because no path exists.
2. **Payout along the chain** (Pickard et al., Science 2011; Babaioff, Dobzinski, Oren and Zohar, "On Bitcoin and Red Balloons", EC 2012). Payment fixes attrition. MIT's DARPA rule paid the finder X, the recruiter X/2, and so on. Under that rule a finder can invent fake recruiters above themselves: 4 fakes raise their take by 94%. We use the paper's (β,H)-almost-uniform rule with max depth H=8 and β=1/H. Each relay gets β units. The finder gets 1+β(H−h+1) units, where h is the chain length. The finder's bonus equals what fake hops would have paid them, so **a finder who adds fakes gains exactly zero**, and the poster always pays exactly 1+Hβ = 2 units, whatever the chain length. Chains longer than H pay nothing and the poster is refunded. A *relay* who adds fakes does move money from the finder to itself, but each fake uses up one level of the depth its own subtree needs. The paper proves that this is dominated in equilibrium. It also proves (Theorem 3.1) that no payout rule can make it dominated outright when H ≥ 3. We state this rather than overclaim.
3. **The branching threshold** (Kleinberg and Raghavan, FOCS 2005). Let b be the effective branching factor (active forwards per holder, at most 3 here). If b > 2, the reward needed grows linearly with search depth; if b < 2, it grows exponentially. Money alone cannot rescue a dying search. A controller measures b per bounty per minute. When b stays below 2 for 10 minutes, it first raises b: it nudges holders past the p75 hop latency and widens the hint card. It raises the reward from the poster's escrowed reserve only when the predicted cost fits.

The surprising part: nobody uploads contacts, every hop is chosen by a human, the target stays anonymous until they opt in, and the system never sees the network.

### What it does

- **Who it's for:** international and first-generation students who need a specific person and lack a dense LinkedIn network. Examples: "someone who can refer me into Jane Street", or "a Mandarin-speaking immigration lawyer near Ithaca". A group post reaches only that group. The person you need is usually 2-4 hops out in someone's private contacts, and a group post gives nobody a reason to pass it on.
- **Post:** free text goes in, and Gemini compiles it into a hint card from a fixed attribute schema. The schema has no name or street-address field, so you cannot post a bounty on a named individual. The poster escrows a budget cap; the bounty starts at 60% of the cap and the rest is reserve.
- **Forward:** each holder gets a personal tokenized link (and, if registered, an iMessage thread) and forwards to up to 3 people. Every edge is logged to Tiger and committed to Solana as a salted-hash memo.
- **Find:** the target opts in on the link page. For the venue run, the target also enters the code from their hardware badge. The requester is introduced, and the chain is paid in one Solana transaction, or by Nessie transfers for hops who chose a bank. If the bounty expires, the poster is refunded.
- **Hardware:** HOTP "target badges", plus a table gauge whose needle shows the live b with the threshold at 2.

### Demo (2 min)

- **0:00-0:20.** The problem, plus one line: "Jon Kleinberg proved strangers can find each other with local knowledge; we made it pay correctly."
- **0:20-0:50.** The overnight "Six Hops BRH" run: 5 volunteer *people* as targets, each with a hint card ("has interned at a launch company", "speaks Amharic", "has hand-soldered a QFN chip"). Real numbers are shown as they are, next to the 1M-node Kleinberg-lattice replay. Point to the moment b fell below 2 and the controller widened the hint. The physical gauge on the table moves with it.
- **0:50-1:15.** A judge, registered when they walked up, gets a fresh bounty in iMessage: "someone who has worked on a launch team at Starbase". The link preview shows the Grok Imagine wanted card. The judge taps a thumbs-up and shares a contact card, or types a first name. The agent replies with a personal link to forward, and a new edge appears on the graph.
- **1:15-1:40.** A teammate plays the target. They press their badge, enter the 4-digit code and opt in. Within about 2 seconds, one devnet transaction pays every hop, and we open it in Explorer: N transfers plus a memo.
- **1:40-2:00.** Attack slider: the finder adds 1-4 fake recruiters. MIT's rule pays them +50/75/88/94%; ours pays +0, and the total is unchanged. One sentence on relays and Theorem 3.1. The Nessie tab shows the same split as bank transfers.

### Sponsor tracks

| Track | Spoke feature powered by that sponsor | p_win |
|---|---|---|
| MLH Solana | One atomic multi-payee payout; per-edge salted commitments that settle "who invited whom" | 0.45 |
| MLH Tiger Data | Live b and frontier caggs drive the controller; percentile_agg hop latency drives nudges; 1M-event replay benchmark | 0.35 |
| Photon iMessage | Agent for registered holders: tapback to pass it on, contact card to personal link, p75 nudges, found and opt-in messages, deterministic privacy rules | 0.28 |
| BigRed (main) | Decentralized search as navigation, built on the keynote speaker's papers | 0.24 |
| Capital One Nessie | Escrow account, refund on expiry, bank payouts released only after opt-in and poster confirmation | 0.22 |
| SpaceX Make it Legendary | Built in Cursor; Grok Voice "talk instead" relay with 3 tools in 20+ languages; Grok Imagine wanted card as the link preview | 0.22 |
| MLH GoDaddy Registry | milgram.study hosts the join page and visualizer | 0.22 |
| Software | Babaioff split plus brute-force test_split.py, query-incentive controller | 0.22 |
| Hardware | HOTP target badges (EEPROM counter, no clock) and a servo gauge of live b | 0.20 |
| People's Choice | The venue plays; one opted-in "your chain found them, vote here" message after 8:30 AM | 0.20 |
| Design | d3-force cascade colored by depth, b gauge in red/amber/green, replay scrubber, mobile join page | 0.15 |
| MLH Gemini API | Structured-output hint-card compiler (long shot) | 0.05 |

The p_win values sum to 2.8. Expected wins are about 2.3 after discounting for correlated failures and because BigRed stacking with sponsor prizes is unverified. ElevenLabs and Presage are skipped: there is no honest fit.

### Why <sponsor> specifically

**Solana**
1. One transaction carries up to H SystemProgram transfer instructions plus a Memo, all or nothing, for a single ~5,000-lamport fee and with no custom program. Paying 8 people atomically on an EVM chain needs a deployed contract.
2. Each forward is anchored as a memo when it happens (~400 ms slots, a fraction of a cent each). After a target is found, nobody, including us as operators, can backdate or splice an edge into the winning chain; slot order settles disputes. Babaioff's paper is about exactly this attack surface in Bitcoin, which was too slow and costly to anchor every edge.
3. Privacy and verifiability together: losing branches stay hidden as salted hashes. At payout, the winning chain's salts are published and their hash goes in the payout memo, so anyone can recompute the split from chain data. Hops are per-bounty pseudonymous keys, not phone numbers. The minimum bounty is 0.015 SOL, so every share clears the rent-exempt minimum.

**Tiger Data**
1. Every 30 s the controller reads per-bounty, per-minute b and frontier size from a continuous aggregate with real-time aggregation on (materialized_only=false). The read stays cheap as the append-only event stream grows, which a plain Postgres GROUP BY rescan does not.
2. timescaledb_toolkit percentile_agg in the cagg gives p75 and p95 hop latency by hop index. The sketches roll up from 1 minute to 1 hour through a hierarchical cagg and drive the nudge rule.
3. Closed cascades go to compressed columnstore. Three numbers on screen: cagg versus raw scan in ms on the 1M-event replay, compression ratio, and refresh lag.

**Photon (Spectrum)**
1. People already pass on asks in their own iMessage threads. A tapback means "I'll pass it on", and a shared contact card becomes a personal link the user forwards, so the agent never stores an address book.
2. It is a proactive, multi-person agent with a human at every hop: one bounty spans many 1:1 threads, a holder who stalls past p75 gets nudged, the chain hears when the target is found, and the target is asked to opt in.
3. The privacy rules are deterministic code kept separate from the LLM: the requester never sees chain members, the target stays anonymous until they opt in, and attributes come only from the schema. Honest scope: Pro messages only registered numbers, so the team, friends and judges get the agent, and everyone else uses the link page.

**Capital One Nessie**
1. The escrow is made of real accounts: the poster's checking account funds an escrow account on post, a refund transfer runs on expiry, and bank payouts are released only after the target opts in and the poster confirms (authorization before money moves).
2. Most people in a chain have a bank account, not a wallet (think of the grandparent who knows the Amharic speaker). The split is computed once and paid on whichever rail each hop picked.
3. It adds a bank primitive: a payout that follows a path through people. A concrete use is an employer referral bonus split along the intro chain.

**SpaceX (Cursor + Grok)**
1. Grok Voice speech-to-speech with client tool calling runs in one browser WebSocket session (ephemeral token, no Twilio). The "talk instead" button reads the hint card aloud in the holder's language (20+ languages) and calls get_bounty, forward_to and claim. Chains cross language communities, which is the point.
2. Grok Imagine renders each bounty's wanted card ($0.02 per image) as the og:image, so the card appears in the preview of every forwarded link.
3. The whole team builds in Cursor: Co-authored-by trailers, exported transcripts committed to the repo, and a screen recording. Space flavor comes from the Starbase demo bounty.

**Gemini (long shot)**
1. Structured output against a JSON schema turns free text into the hint card, and the schema itself enforces attributes only. This is interchangeable with other LLMs; we enter it as a lottery ticket.

**GoDaddy Registry**
1. On .study, "milgram.study" reads as "Milgram study", the 1967 experiment this replicates. It also provides the HTTPS host the link previews need. Fallback: sixhops on any offered TLD (the tech.study TLD list is unverified).

### Build plan

H0 = 4:00 AM Saturday. Code freeze 5:00 AM Sunday; submit by 8:00 AM. Everyone works in Cursor.

**Critical path:** split function + test_split.py (SWE2, by 7 AM) → join page, state machine and forward events (SWE1, live by the 2 PM game launch) → claim endpoint + one-transaction payout (SWE2, by 9 PM) → cascade UI and gauge reading the cagg (SWE3, by 9 PM) → end-to-end, 9-11 PM. Every other spoke hangs off this path and can be cut. If behind at 9 PM, cut in this order: Gemini, Grok Voice (keep Imagine), Nessie, gauge, contact-card intake.

- **SWE1 (flow + Photon):** 4-7 go/no-go A. 7:15-11:15 sleep. 11:15-2 PM bounty state machine (open, forwarded, accepted, paid, expired, refunded), tokenized per-hop join page (fan-out of 3 or fewer, ranked), target opt-in page, Grok Imagine og:image on bounty creation; deploy to Vercel plus a cloudflared tunnel and test from cellular. 2 PM launch with HW. 3-6 PM Spectrum agent: delivery, tapback, contact-card intake (only if verified), nudges, found and opt-in messages, privacy rules. 6-7 PM Gemini hint-card compiler. 9-11 PM end-to-end. Nap 12-2 AM. Morning: fixes, backup video, Photon and Gemini write-ups.
- **SWE2 (money + mechanism):** 4-6 go/no-go B and D. 6-7 split() plus test_split.py, a brute force over every h ≤ 8 and every k ≤ 8−h asserting: total equals budget, the finder's take is unchanged by k fakes, and chains past H refund; it also prints MIT's gain. 7:15-11:30 salted edge memos, batch payout with an idempotency key (no double pay on retry), minimum-budget floor. 11:30-3:30 sleep. 3:30-6:30 Nessie escrow, payout and refund. 6:30-9 PM claim endpoint triggers the payout, attack endpoint, controller rules (b < 2 for 10 min: nudge, then widen, then raise from reserve). 9-11 PM end-to-end. Morning: Solana, Nessie and Software write-ups, Explorer screenshots, mechanism slides.
- **SWE3 (data + UI + voice):** 4-7 go/no-go E and G. 7:15-11:30 Kleinberg-lattice generator (1M nodes, fan-out-3 greedy cascades with attrition), COPY into Tiger, cagg with percentile_agg, compression, recorded ms numbers; register milgram.study around 10 AM once the MLH code is in hand. 11:30-3:30 sleep. 3:30-7 PM Next.js d3-force cascade, b gauge, attrition curve, attack slider. 7-9 PM serial bridge feeding b to the HW gauge. 9-10:30 PM Grok Voice "talk instead" page. Morning: data refresh, polish, Tiger, SpaceX and Design write-ups, Cursor transcript export.
- **HW:** 4-7 count Grove stock (TM1637 4-digit displays, buttons, LEDs, servo), flash HOTP firmware on one Uno (HMAC-SHA1 over an EEPROM counter, no clock), server validation with a look-ahead-window knob (default 10) and resync, power-cycle test, 30-min power-bank test, start printing a small lanyard badge case. 7:15-11:15 sleep while the printer runs. 11:15-1:30 build 2-3 badges (printed one-time code cards for any extra targets), get organizer approval, recruit 5 volunteer targets and write their hint cards. 2 PM launch in the BRH Discord. 2-10 PM run the game; build the servo + LED gauge in a lull. 10 PM-2 AM sleep. 2-3:30 AM collect badges and export data. 3:30-6:30 AM main deck and Hardware write-up. 6:30-8 AM rehearsal. Return rentals after judging.

### Go/no-go

Run by 7:00 AM unless noted. A failed test cuts its spoke, not the project. **Kill the whole idea only if A and B both fail by 7 AM**, because then the two strongest spokes are gone and Hum would score higher.

- **A (Photon, by 6:30):** a Spectrum agent on the HACKWITHPHOTON Pro plan receives a text and a tapback from a registered number and replies within 5 s. A sent URL renders as a rich link. Log what a shared contact card arrives as. Confirm an unregistered number gets "Target not allowed". If it fails, drop Photon and keep the web links as the only path.
- **B (Solana):** a devnet transaction with 6 transfers to fresh keypairs plus a Memo confirms at "confirmed", with a median under 2 s over 5 runs. A deliberate sub-rent transfer fails as predicted. The payer holds at least 5 devnet SOL; keep a Helius devnet RPC as backup.
- **C (split):** test_split.py passes. This is pure code, so a failure is a bug to fix, not a reason to cut.
- **D (Nessie, over HTTPS, key via a hotspot):** POST a customer, 2 accounts and a transfer; both balances change on GET within 2 min. If not, drop Nessie rather than fake it.
- **E (Tiger, from venue Wi-Fi):** create the hypertable, COPY 1M rows in under 2 min, refresh the cagg, and show the cagg at least 10x faster than the raw scan. If toolkit is missing, compute percentiles at query time.
- **F (hardware):** at least 2 TM1637 displays are in stock; a code validates and still validates after a power cycle; the power bank stays on for 30 min. If the displays are missing, use printed code cards and make the gauge the hardware piece.
- **G (Grok):** the key has credits (or prepay $10). A server mints an ephemeral token, and a browser voice session calls one client tool. The Co-authored-by: Cursor trailer shows in git log.
- **H (signal only, 2:00-2:45 PM):** the launch post gets at least 10 opens and at least 3 depth-2 forwards. If not, seed through team friends and lead the demo with the replay.

### Risks

1. **Thin live data.** Hackers are busy or asleep, so the real run will be small and shallow. The demo leads with the 1M-node replay and labels it as synthetic; real numbers are shown as they are.
2. **"Pyramid scheme".** Nobody pays to join, money flows one way from one poster, the total is fixed at the escrowed budget whatever the chain length, and depth is capped at 8.
3. **Relay sybils.** They pay off pointwise, and we say so. Answer with Babaioff's equilibrium result plus Theorem 3.1, flag fake hops whose forwards land within milliseconds of each other (visible in slot order), and require a distinct handle for iMessage payouts.
4. **Stalking.** Attributes only, no name or address fields, city-level places, target opt-in, and the requester learns nothing about the chain. The last forwarder knows who they sent it to, as with any forwarded message; acknowledge this.
5. **Play money.** Devnet and Nessie are mock money, so call the overnight run "incentive-shaped, not incentive-tested". Stretch goal, with organizer approval: a $20 real pot paid on mainnet through the same code (only the RPC changes) to hops who paste a wallet address.
6. **Photon limits.** Only registered numbers can be messaged, and one source reports a cap of 50 new conversations per day. The link page is the main path, and judges are registered at the table.
7. **Scope.** Seven spokes for 3 SWEs. Follow the cut order above and freeze at 5 AM.
8. **Pitch overload.** One sentence per paper. The attack slider carries the argument, because a judge can see it.
9. **Cliche match.** People are the targets, not balloons, and the pitch says "a replication of DARPA's Red Balloon experiment, with people".
10. **Network.** Nessie works over HTTPS only, the DGX sits behind NAT (so Vercel plus a tunnel), and link previews need public HTTPS OG tags. Test everything from cellular.

### Precedent

- Kleinberg, "Navigation in a small world", Nature 2000: https://www.nature.com/articles/35022643 and the STOC 2000 algorithmic version: https://www.cs.cornell.edu/home/kleinber/swn.pdf
- Dodds, Muhamad, Watts, "An experimental study of search in global social networks", Science 2003: https://www.science.org/doi/10.1126/science.1081058
- Pickard et al., "Time-critical social mobilization" (MIT, DARPA Red Balloon), Science 2011: https://www.science.org/doi/10.1126/science.1205869 and reflection: https://cacm.acm.org/magazines/2011/4/106587-reflecting-on-the-darpa-red-balloon-challenge/fulltext
- Babaioff, Dobzinski, Oren, Zohar, "On Bitcoin and Red Balloons", EC 2012: https://arxiv.org/abs/1111.2626
- Kleinberg, Raghavan, "Query Incentive Networks", FOCS 2005: https://www.cs.cornell.edu/home/kleinber/focs05-qin.pdf
- Arcaute et al., "On Threshold Behavior in Query Incentive Networks", EC 2007: https://theory.stanford.edu/~sergei/papers/qin-ec.pdf
- "Finding red balloons with split contracts", STOC 2012: https://dl.acm.org/doi/10.1145/2213977.2214047
- "Collusion-proof and Sybil-proof Reward Mechanisms for Query Incentive Networks", 2023: https://arxiv.org/pdf/2302.06061
- Products: GetBounty (https://www.get-bounty.com/) and Bounty Hunter World (https://bountyhunterworld.com/) split one hiring fee across one or two recommenders; a multi-level referral patent (https://patents.justia.com/patent/20130197983); LinkedIn intro paths (https://www.linkedin.com) need a central copy of everyone's graph. None of them combines blind greedy routing, a Sybil-aware split and branching-factor escalation.

### Review fixes applied

- **Split mechanism, corrected:** only a finder's fakes are provably neutral; relay fakes are dominated only in equilibrium, and Theorem 3.1 is stated. The demo compares against MIT's +94%.
- **Branching factor:** fan-out is now 3 or fewer, so b is meaningful, and the controller raises b before it raises money.
- **Targets:** balloons replaced by volunteer people wearing badges, which also removes unattended hardware.
- **Badges:** TOTP replaced by EEPROM-counter HOTP with a window knob; one small badge print instead of 5 balloon shells.
- **Solana:** a rent-exempt floor via the minimum budget; salted commitments with a winning-chain reveal resolve the privacy-versus-verifiability conflict.
- **Photon:** web links are the main path, contact-card intake is gated on go/no-go A, and losing Photon no longer kills the idea.
- **Tiger:** an app-side poller replaces "the refresh policy runs the logic", and real-time aggregation is on.
- **Cuts:** Grok Voice moves to a browser page, Grok Imagine is added cheaply as the link preview, the Gemini contact ranker and photo check are dropped, the Nessie holdback is replaced by an opt-in-plus-confirm release, and the domain changes to milgram.study.
- **Safety:** attribute-only schema and opt-in.

**Scores:** interesting 8/10, BigRed 7.5/10, feasibility 0.7, expected wins 2.3 raw, about 1.9 adjusted.

---

## 2. Hum: a time fix for any recording

**One line.** The power grid's frequency wanders at random, and every outlet on an interconnection wanders in step. That wander leaks into recordings as hum and as light flicker. Hum reads it back to say when a clip was recorded, which grid it was on, and where it was cut. It also gives witnesses a capture link whose proof of time does not depend on trusting us.

**What changed after review.**
- We removed the false claim that no journalist tool exists. Open ENF does exist, but only for Europe, so Hum is now positioned as the missing open US reference.
- Every result now states what it proves: a mismatch refutes a claim, a match supports it, and a capture proves it.
- We cut the family-scam use case, and Nessie with it. We cut Grok Voice. We dropped the Grove light sensor, because a photoresistor is too slow for 120 Hz.
- The matcher now works on absolute frequency, which makes Tiger's per-minute pruning valid. We load public grid history so the Tiger benchmark is real.
- We test the audio and video front ends side by side in hour 1.
- The "fakes have no hum" beat is gone. In its place are fakes prompted to contain hum and 2-minute fakes stitched from short clips.
- Presage is narrowed to a measured liveness check that covers the hole ENF leaves open.

### Trick

The US grid runs at a nominal 60 Hz, but its frequency drifts randomly by a few hundredths of a hertz as load and generation shift. The drift is the same at every outlet on one interconnection; Ithaca is on the Eastern Interconnection. It gets into recordings in three ways:
- hum from transformers, ballasts and motors at 120 Hz and its harmonics, which a phone mic picks up;
- electrical coupling into recorders that run on mains power;
- 120 Hz light flicker, which a rolling-shutter camera records as bands.

To date a clip, extract the hum's frequency track, slide it along a reference log of the grid, and take the best fit as the recording time.

The non-obvious part is what this proves. Nobody can know the grid's wander before it happens, so a clip whose hum matches minute T was recorded no earlier than T. A hash of the clip posted to Solana at upload shows the clip existed no later than slot S. Together, the two bound a capture from both sides. The hum runs through the whole clip, so every second is bounded, and a cut shows up as a jump in the hum's phase.

For a clip that someone else recorded, the logic is one-sided, and we say so:
- A mismatch refutes the claim. So does 50 Hz hum on a clip claimed to be from the US.
- A match supports the claim but cannot prove it, because anyone holding a published reference could synthesize hum for a past minute.
- No hum means "unverifiable", not "fake".

Forensic labs have used ENF since about 2005, with private references. What journalists and witnesses lack is the reference itself. Open ENF ships history only for Great Britain and Central Europe. FNET/GridEye shows live US frequency on a public display, but we found no open archive. Hum provides three things:
- an open Eastern Interconnection reference, recorded by two independent stations;
- a commit of each minute as it happens, so its operator (us) cannot backfill it;
- a capture link that gives a witness a two-sided proof of time.

### What it does

- **Reference network.** Two stations in different buildings measure grid frequency at 1 Hz, write it to Tiger, and commit each minute's Merkle root to Solana, each under its own key. Tiger also holds public 1 s history for Great Britain (from NESO). We use it to benchmark the search and to test the matcher against ground truth.
- **verify(clip).** Extracts the hum track from the audio or from the video flicker; the go/no-go test decides which. It matches the track on absolute frequency and returns:
  - the recording time with an error bar;
  - a peak-to-sidelobe confidence;
  - the grid: 50 or 60 Hz, and Eastern or not;
  - the hum's signal-to-noise ratio;
  - any splice markers.

  If there is no usable hum, it returns "unverifiable".
- **Capture link.** A page on our domain records with the browser's noise suppression, echo cancellation and gain control turned off. On upload, the clip's hash goes on Solana. The verdict gives "not before" from the hum and "not after" from the chain.
- **Liveness.** Presage measures the pulse of any face in the clip. This targets an attack the hum cannot catch: a fake played on a screen in a real room.
- **iMessage intake.** A reporter forwards a clip to the Hum agent and gets a verdict. If the answer is weak, the agent offers to text the source a capture link, and it reports back when the anchored clip arrives.

**Users.** Journalists and fact-checkers testing a claimed time or place, for example "filmed today" when the hum matches Thursday, or "filmed in Gaza" when the hum is 60 Hz. Also witnesses who need to show when they recorded something: tenants documenting conditions, people filming a police stop or a public meeting, insurance claimants.

**Theme fit.** OSINT investigators call this chronolocation: the time half of locating footage. Hum gives a recording a fix in time and a coarse fix in space. It also answers Kleinberg's question: where did this come from, and is it current?

### Demo (2 min)

Before the pitch starts, we open the capture link on the judge's phone (or on ours, if they prefer) and set it on the table beside a desk fan and a transformer lamp. Both are ordinary mains devices; nothing plays our reference back. The phone records the pitch itself.

1. **0:00-0:20.** The station's LED breathes with the grid's deviation. The screen shows this station's trace and the trace from the dorm station, 1+ km away, lying on top of each other, with the live correlation.
2. **0:20-0:50.** We play a clip recorded earlier today at a logged time. Its trace slides along the reference, the peak snaps into place, and the card reads "recorded 13:41:07 ±2 s, Eastern Interconnection, 60 Hz". The same clip with 10 s removed gets a red marker at the cut. The measured accuracy table sits beside it.
3. **0:50-1:20.** The red-team gallery:
   - A Grok Imagine "humming transformer room", made from a photo of this table, has a tone, but the tone matches no reference minute.
   - A 2-minute fake stitched from 15 s Imagine clips shows a phase jump at every seam.
   - A fake face replayed on a screen into the capture page passes the hum check, because the room is real. The Presage tab shows what pulse it found: the rates we measured, not a promise.
4. **1:20-1:50.** We stop the judge's capture. The verdict covers the pitch they just heard: start and end time, grid, no splices, the Solana slot of the upload, and the reference roots that were committed as each minute happened. One click opens the explorer.
5. **1:50-2:00.** The limits: "A mismatch refutes, a match supports, a capture proves. No hum means unverifiable."

If the live capture fails, step 4 uses a capture made during the previous judge's visit.

### Sponsor tracks

| Track | Spoke feature that this sponsor's tech powers | p_win |
|---|---|---|
| MLH Tiger Data | ENF archive hypertable (2 stations plus months of GB history); a per-minute envelope cagg that prunes the match search; compression ratio and latency benchmark on screen | 0.42 |
| MLH Solana | Per-minute Merkle roots signed with each station's own key; capture-anchor memo; browser verifier that recomputes the roots | 0.38 |
| Hardware | Two reference stations (a Pico zero-crossing timer and a laptop pickup rig); breathing LED; printed enclosure; measured resolution | 0.36 |
| SpaceX Make it Legendary | Whole repo built in Cursor; Grok Imagine red-team gallery (hum-prompted, image-to-video of our table, stitched) scored live | 0.27 |
| MLH Presage | Pulse and confidence on faces in uploaded and captured clips; screen-replay liveness test | 0.25 |
| Software | ENF extraction; absolute-frequency matcher with confidence; phase-jump splice detector; measured accuracy table | 0.17 |
| MLH GoDaddy Registry | Domain serving the HTTPS capture page | 0.12 |
| Photon iMessage | Reporter-to-source agent: forward a clip, get a verdict, request a capture from the source | 0.10 |
| BigRed main | Chronolocation framing; live physical demo | 0.08 |
| MLH ElevenLabs (only if the gate passes) | Voice Isolator residual that unmasks hum hidden under speech | 0.05 |
| Design | Trace-sliding animation and verdict card | 0.04 |
| MLH Gemini API (stretch) | Claim extraction from the clip and its caption, checked against the grid | 0.03 |
| People's Choice | Share post: "your phone recorded the power grid" | 0.03 |

The p_win values sum to 2.3; after the 15% correlated-failure cut used in the summary, about 1.95. Tiger, Solana and Hardware run on the reference network, which works even if phone clips do not. So the three strongest tracks survive the main physics risk.

### Why <sponsor> specifically

**Tiger Data**
1. **The data is time-series by nature.** The core data is an append-only 1 Hz sensor log from several stations, and verifying a clip is a similarity search over a time range. Hypertable chunk exclusion skips every chunk outside the search window, and time_bucket pulls only the candidate windows.
2. **A continuous aggregate prunes the search.** A per-minute aggregate of min, max and mean for each station acts as a lower-bound envelope (the LB_Keogh idea). If a minute's envelope, widened by the clock-error bound, cannot contain the clip's minute mean, the matcher skips that minute.
   - This is valid only because we match on absolute frequency rather than on normalized correlation.
   - Phone clock error is about 20 ppm, or about 2.4 mHz at 120 Hz, well inside the grid's tens of millihertz of wander.
   - On screen: "searched 90 days of GB history in X ms pruned vs Y ms raw".
3. **Compression keeps years of history affordable.** A useful reference must keep years of 1 Hz history for each station. Columnstore compression, segmented by station and ordered by time, packs a slowly varying float series tightly. We show the measured ratio on real data.

**Solana**
1. **It removes trust in the operator.** The party a verifier must not trust is the reference operator, which is us. A public ledger timestamps each minute's root within seconds, so we cannot edit the reference later to make a fake match.
2. **The cost fits an always-on network.** 1,440 memos per station per day at 5,000 lamports each is about 0.007 SOL a day.
3. **Fast slots make the anchor tight.** Slots of about 400 ms put a witness's "not after" within a second or two of upload. Each station signs with its own key, so two independent witnesses commit the same wander, and the verifier page shows that their roots agree.

**Presage**
1. **Pulse from a recorded file.** SmartSpectra reads pulse from ordinary video with no wearable. Its settings take a video file as input; we confirm this in hour 1. A file is the only way to check a person in a clip that someone has already recorded.
2. **It reports confidence.** The card can say "no reliable pulse" rather than guess, which matches how Hum reports everything else.
3. **It covers the hole ENF leaves.** A generated face played on a screen into the capture page picks up real room hum and passes the hum check. A pulse check on the face is a second physical signal. We report measured rates on 10 replayed fakes and 10 live teammates. If the fakes show pulses too, the tab says so.

**SpaceX (Grok Imagine and Cursor)**
1. **Imagine is the threat itself.** Grok Imagine generates video with synchronized audio by default, so it can fake room tone, including hum. That is the threat Hum has to beat, which makes Imagine the right adversary for a red-team set.
2. **It can fake our exact scene, cheaply.** Image-to-video from photos of our own table produces fakes of the scene the judge is looking at. At about $0.05 per second, 20-30 clips cost $10-20. Clips top out at 15 s, so a 2-minute fake must be stitched together, and each seam is a phase jump that the splice detector should flag.
3. **The whole repo is built in Cursor.** Every line is written in Cursor Agent, with the Co-authored-by trailers kept and the transcripts exported into the repo.

**Photon (Spectrum)**
1. **Clips already travel in iMessage.** Forwarding one into a thread costs a reporter nothing and needs no install.
2. **It works between two people over time.** At the reporter's request, the agent texts the source a capture link, then tells the reporter when the anchored clip arrives. Verdicts come from deterministic code; the LLM only words them, and tapbacks confirm.
3. **It has a fallback.** If Spectrum will not hand us video attachments, the reporter uploads the clip on the web page, and the agent still handles the capture request and the verdict links by text.

**GoDaddy Registry**
1. getUserMedia runs only in a secure context, so the capture page needs a real HTTPS domain anyway.
2. The name can carry the pitch. Candidates are wasthehumthere, gridwitness and humprint, depending on which TLDs tech.study offers.

**ElevenLabs (only if the gate passes)**
1. Voiced speech has its fundamental at about 85-255 Hz, so it sits on top of the 120, 180 and 240 Hz hum lines. Voice Isolator gives an estimate of the speech. Subtracting its magnitude spectrum in narrow bands around those lines leaves the hum.
2. We enter only if 10 speech-heavy clips show a median gain of at least 3 dB and a better match rate. Otherwise we make no claim.

**Gemini (stretch, after 21:00 only)**
1. Gemini takes the whole clip in one call (frames, audio, caption, any on-screen clock) and returns structured JSON with the claimed place and time. Hum then tests those claims against the grid. Gemini proposes and the grid decides.

### Build plan

H0 is 04:00 Saturday. Everyone writes code in Cursor. Each person sleeps about 5.5 h or more, in two blocks.

**Critical path:**
1. HW's pickup-wire reference is logging by 05:00.
2. SWE1's extractor and matcher pass the blind test by 06:30.
3. The verify() endpoint works by 11:00.
4. The capture page is live on the HTTPS domain, with the Solana capture anchor, by 15:00.
5. The accuracy table is done by 21:00.
6. Feature freeze at 02:00.

Everything else hangs off this line and can be dropped.

**SWE1 (signal; owns the go/no-go)**
- **04:00-06:30:** The extractor and matcher:
  - ffmpeg converts the clip to mono;
  - STFT with an 8 s window and a 1 s hop;
  - quadratic peak interpolation on the harmonics from 60 to 300 Hz, each divided by its harmonic number and fused, weighted by SNR;
  - a matcher on absolute frequency with a bounded clock offset, which reports the error and the peak-to-sidelobe ratio;
  - an assert self-check on synthetic hum.

  Blind test at 06:00.
- **06:30-11:00:** A phase-continuity splice detector on the strongest harmonic, which needs no reference. The "unverifiable" rule, based on line SNR. verify() as a FastAPI endpoint. If the go/no-go picked video, build the rolling-shutter row-mean front end instead.
- **11:00-15:00:** Sleep.
- **15:00-21:00:** The accuracy table: 20+ real clips at logged times and 200 synthetic slices of real GB data, broken down by clip length and search window.
- **21:00-02:00:** Score the red-team gallery and the synthetic-hum overlay attack. Handle edge cases.
- **02:00-05:00:** Rehearsals and a backup demo video, with HW.
- **05:00-06:30:** Sleep.

**HW (reference stations)**
- **04:00-06:30:**
  - Build reference v0, which needs no Pico: a 3.5 mm plug with a bare wire laid along a power strip, plugged into a laptop mic jack and logged with SWE1's code.
  - Set up a second laptop on another floor for the correlation test.
  - Collect the T1 clips.
  - Find natural hum sources (vending machine, fridge, bench supply, desk fan, fluorescent fixture) and a lamp whose flicker shows as bands on a phone camera.
  - Pick up a Pico when the MLH table opens. Start the enclosure print.
- **06:30-11:00:** Build the Pico station.
  - The pickup wire, with a mid-rail bias, feeds the ADC.
  - Firmware applies a threshold with hysteresis, times the zero crossings, averages over 60 cycles, and sends frequency at 1 Hz over USB serial.
  - The host stamps NTP time and inserts into Tiger.
  - Calibration knobs: the threshold and hysteresis, and a crystal ppm correction.

  Station 2 is the laptop rig in a dorm, with its own Solana key. Use a hotspot if the dorm network blocks Tiger's port.
- **11:00-15:00:** Sleep.
- **15:00-21:00:** The LED that breathes with the deviation. The enclosure. A plot of the residual between the two stations and the station's resolution, optionally checked against FNET's public live display. The table hum sources. A set of no-prop clips from the dorm.
- **21:00-02:00:** Demo table, cabling, backup reference.
- **02:00-05:00:** Rehearsals with SWE1.
- **05:00-06:30:** Sleep.

**SWE2 (data and chain)**
- **04:00-06:30:**
  - Tiger Cloud service and hypertable; test the connection from Cornell Wi-Fi, with a hotspot fallback.
  - Solana devnet keypair, airdrop, and one confirmed memo.
  - Start downloading the NESO monthly CSVs.
  - Run T5.
- **07:00-11:00:** Sleep.
- **11:00-15:00:**
  - Tiger: 1 h chunks; a compression policy, plus a manual compress_chunk to get the ratio; the per-minute cagg with a refresh policy; the NESO import (at least 3 months, about 8M rows); the envelope-pruned candidate query; the benchmark.
  - Solana: a per-minute root committer for each station; the capture-anchor memo; the verifier page.
- **15:00-21:00:** The Photon agent with the reporter-to-source loop. Register judges' numbers live.
- **21:00-02:00:** Verifier page showing that the two stations' roots agree. Benchmark numbers for the slide. Failure handling.
- **02:00-05:00:** Sleep.
- **05:00-06:30:** Per-track write-ups.

**SWE3 (interfaces and sponsor tabs)**
- **04:00-06:30:**
  - Get the Presage key and build the SDK on a Mac; run it on a recorded video file, and confirm that file input exists in the installed version.
  - Get an xAI key with a $10-20 prepay and run one Imagine job.
  - Claim the domain.
  - Set up Cursor seats.
  - Redeem the ElevenLabs promo.
- **07:00-11:00:** Sleep.
- **11:00-15:00:** The web app, deployed on the domain over HTTPS:
  - upload;
  - the capture page (raw PCM through an AudioWorklet, with browser processing off);
  - the trace-overlay chart and the verdict card;
  - one tab per sponsor.
- **15:00-21:00:** A Presage CLI (file in, pulse and confidence out) wired into the verdict. The Imagine batch: hum prompts, plus image-to-video of the table. The screen-replay recordings and the stitched 2-minute fakes.
- **21:00-02:00:** The ElevenLabs gate measurement. Gemini only if ahead. Animation polish.
- **02:00-05:00:** Sleep.
- **05:00-06:30:** Per-track write-ups.

**All, 06:30-08:00:** Deck, Devpost, Cursor transcript export. Submit by 08:15.

### Go/no-go

- **T1, signal presence (HW, by 05:00).**
  - Record 2 minutes on each team phone, in four capture paths, at a natural mains source and at a plain table. The paths are Camera video, Voice Memos with Enhance off, browser capture with processing off, and an iMessage voice note. The browser test runs over a cloudflared tunnel until the domain resolves.
  - Also record 2 minutes of phone video and Logitech webcam video under the flicker lamp.
  - Pass: a 120, 180 or 240 Hz line at least 10 dB above the neighbouring bins in some phone audio path, or a flicker peak in the video path.
- **T2, reference (HW and SWE1, by 06:00).** The pickup-wire rig logs 30+ minutes of 1 Hz ENF with plausible wander: smooth, with a standard deviation of about 10-20 mHz. A second outlet on another floor correlates with it at r > 0.9.
- **T3, self-check (SWE1, by 05:30).**
  - Synthetic random-walk hum plus noise at -10 dB, hidden at a known offset in a 1 h reference, is recovered within ±1 s.
  - A 10 s cut is flagged within ±1 s.
  - A clip with no hum returns "unverifiable".
- **T4, blind timestamp (SWE1, by 06:30).** Three 2-minute phone clips, recorded at times hidden from SWE1, are each placed within ±2 s against the last 60 minutes, with a peak-to-sidelobe ratio of at least 1.5. We also report results for 10-minute and 2-hour windows.
- **T5, ground truth without our hardware (SWE2, by 06:30).** Search 100 random 2-minute slices of real GB 1 s data, with noise added at the level seen in T4, over 1 h and over 24 h. Measure the unique-match rate.
- **T6, integrations (by 07:00).** Each is a single pass/fail:
  - a Tiger insert from venue Wi-Fi;
  - a Solana memo visible in the explorer;
  - the Photon bot receives and downloads a video from a registered number;
  - Presage returns a pulse with confidence above 0 on a file;
  - one Imagine video completes;
  - the domain is claimed.

**Decision at 06:30**
- **Audio passes T1 and T4:** full plan, with the audio front end.
- **Audio fails but video passes:** the video front end becomes primary, and the capture page records video.
- **Phone paths fail, but a laptop on mains power shows the line:** narrow the product to recorders on mains power (laptops on charger, wired cameras, desk mics), with capture from a plugged-in laptop. The stations, Tiger, Solana and Hardware are unchanged.
- **No line even on a laptop mic beside a humming transformer, or T2 fails:** kill Hum and pivot.
- **Spoke fallbacks:** if Presage is not running by 07:00, drop its tab. If Photon attachments fail, use the links-only flow. If xAI is not funded by 07:00, drop SpaceX.

### Risks

1. **Capture processing removes the hum.** Phone noise suppression, Voice Memos "Enhance", voice-note codecs and browser defaults all delete steady low tones. Mitigations:
   - the capture page records raw PCM with processing off;
   - the 180 and 240 Hz harmonics survive high-pass filters better than 120 Hz;
   - the video path is a second route;
   - T1 decides before we build.
2. **Ambiguous matches.** Two minutes of 1 Hz data with an 8 s window holds only about 15 independent samples. Mitigations:
   - ask for 2-3 minute clips;
   - match on absolute frequency;
   - search narrow windows;
   - show the peak-to-sidelobe confidence;
   - put the measured accuracy table on a slide.

   Capture mode narrows the search to seconds.
3. **What a match proves.** Public references let a careful faker add matching hum for a past minute, and a fake replayed into a real room picks up real hum. Hum proves when a recording was made, not that its content is real. Presage covers part of the replay case, to the extent we measure.
4. **Coverage.** Our Eastern reference starts Saturday at 04:00, so older US clips get only the grid check. That is the argument for starting a reference now that does not require trusting its operator.
5. **Staged signal.** The table's hum comes from mains devices, never from playback of our reference. The dorm station and a no-prop clip from the dorm show that the signal is the grid, not our setup.
6. **Presage platform.** The plan is the C++ SDK on a Mac. The DGX (arm64 Linux) is untested, and the reverse-engineered REST path (10 MB cap) is the fallback. We trim clips to a 20-30 s face segment at 480p and at least 25 fps.
7. **Scope and network.** Anything not working at 02:00 leaves the pitch. Tiger's port may be blocked on Cornell Wi-Fi and the dorm network, so keep a hotspot ready. Photon Pro messages only registered numbers.
8. **Theme.** "Navigation" may read as a stretch. We lead with chronolocation and treat BigRed as a long shot.
9. **Quality-bar objection.** "Forensic labs already do ENF." Answer: the technique is old; the open US reference that its operator cannot backfill, and the two-sided capture proof, are what journalists and witnesses lack.

### Precedent

- Grigoras 2005, the ENF criterion for audio forensics. The UK Met Police has used ENF since about 2005.
- Rodriguez, Apolinario and Biscainho 2010: ENF phase discontinuity for detecting edits.
- Garg et al. 2011, and Su, Hajj-Ahmad and Wu 2014: ENF from light flicker and from rolling-shutter video.
- Frijters et al. 2022, ENF in video for time estimation: https://onlinelibrary.wiley.com/doi/full/10.1111/1556-4029.15003
- Open ENF, an open ENF tool for OSINT, with references for GB and Central Europe only: https://github.com/openenf/openenf. Its GB grid data is on Zenodo: https://zenodo.org/records/7741427
- ENFormant: https://github.com/CargoCultScientist/ENFormant
- Bellingcat open questions, which lists ENF as an open problem: https://github.com/bellingcat/open-questions
- GitHub enf topic: https://github.com/topics/enf
- DeFakePro (Nagothu et al. 2022), ENF consensus on a blockchain for video calls; research only: https://arxiv.org/abs/2207.13070
- Deterring Deepfake Attacks with an ENF Fingerprints Approach (2022): https://doi.org/10.3390/fi14050125
- FNET/GridEye, a live US frequency display; we found no open archive: https://fnetpublic.utk.edu/
- NESO GB system frequency data at 1 s: https://www.neso.energy/data-portal/system-frequency-data
- The open multi-grid frequency database (Rydin Gorjão et al. 2020): https://www.nature.com/articles/s41467-020-19732-7 and https://power-grid-frequency.org/
- Capture-time provenance products. They sign at capture time, but they trust the device clock and their own server, and none uses a physical "not before" signal:
  - Truepic: https://truepic.com
  - ProofMode: https://proofmode.org
  - C2PA: https://c2pa.org
- Intel FakeCatcher, the source of the idea of using rPPG to detect deepfakes.

**Scores:** interesting 8/10, BigRed 6.5/10, feasibility 0.6, expected wins 1.95 raw, about 1.65 adjusted.

---

## 3. Saywhere

**One line.** Someone says "I don't know where I am," and the phone network offers only a wide location (a 250 m circle) or none at all. Saywhere picks the next question that is worth the most, scores each answer against map geometry, and narrows the area to a pin with an honest confidence ring. A dispatcher, search coordinator or friend reads the suggested question aloud, and the caller answers by voice, text or photo.

**What changed after review.** Every session now starts from a real wide fix, never from all of Collegetown. The bits budget is stated and reachable. The engine flags its own confident-wrong failures. Each answer type's error rate is measured, not assumed. The main user is the person receiving the call. Cut: the informal-directions automaton, the lunar DTM, the Grok Imagine postcard and Nessie. ElevenLabs gets a job Grok cannot do here, Grok becomes the main in-room interface, and the hardware claims match servo precision. In round 3 the real-map gate was moved to match when line-of-sight data exists.

### Trick

All inference is numeric. Gemini only turns words into typed clues.

1. **Sentences are sensor readings in a Bayes filter.**
   - The state space is every walkable 10 m cell in Collegetown and along the Cascadilla Gorge rim (about 4k cells), times 8 headings.
   - Each clue becomes a likelihood field computed from geometry:
     - Line of sight, from a raycast over a 2 m building-height raster: "I can see the clock tower."
     - Chirality: the sign of the cross product of heading and the vector to the landmark ("the gorge is on my right"). Heading is a hidden variable that is marginalized out and may drift between answers, since callers turn.
     - Distance kernels: "near the bridge."
     - DEM slope relative to heading: "the street goes downhill in front of me."
     - Negative evidence: "no bus stop."
   - This is Kleinberg's left/right failure handled by arithmetic instead of tokens.
2. **It asks the question worth the most bits.** For every candidate question that matters in the current posterior, the engine computes expected information gain. It considers three kinds:
   - yes/no;
   - checklists ("tap everything you can see: stone bridge, CVS, clock tower");
   - open requests ("read me any sign or street name").

   The bits budget is honest. A 250 m circle holds about 700 walkable cells (9.5 bits), and a 90% region of about 25 cells is 4.6 bits, so about 5 bits must come from answers. A noisy yes/no is worth at most about 0.4 bits. So the engine leans on:
   - checklists (about 1 to 1.5 bits each);
   - the opening description or a photo (2 to 4 bits);
   - a read sign (about 4 bits).

   Target: from a 250 m circle to a 30 m ring in 5 to 8 turns.
3. **It knows when it is lost.**
   - Every answer has a predicted probability under the current posterior. The engine tracks running log-evidence against what its own simulator says is normal.
   - A run of surprising answers means either the map is wrong (a store closed, a tree blocks the view) or the caller is confused. The engine then widens the posterior, raises that question type's error rate and switches to open questions, instead of returning a confident wrong pin.
   - Reliability per question type is measured, not guessed. Every practice game has a sealed true spot, so each human answer can be graded against geometry. A Tiger Data continuous aggregate feeds the measured error rates back into the likelihoods.

### What it does

- **Dispatcher console (the product).** A web console for the person taking the call. It shows a heatmap, a bits meter, the next best question in plain words, big answer buttons, and a final pin with a calibrated "90% within N m" ring.
  - Dispatchers already ask landmark questions from memory (IAED cellphone-trouble scripts). Saywhere chooses the question and does the bookkeeping.
  - It starts from whatever wide fix exists: a cell sector, a Phase II ellipse, a stale last-known point plus walking time, or a trail segment.
- **Relays for when no human is free.** Each speaks the engine's questions word for word and calls the same engine:
  - a phone line any phone can call (ElevenLabs);
  - an iMessage thread for people who must stay quiet (Photon);
  - an in-room voice call box (Grok Voice).
- **Honest scope.** When the phone has a tight fix, use it. The FCC wireless 911 benchmark (47 CFR 9.10) is 50 m for 80% of calls, so one call in five can arrive worse than that by design. Gorges, VoIP lines and old phones are worse still, and Ithaca has frequent gorge rescues.

### Demo (2 min)

- **0:00-0:15. The problem.** A call arrives with a 250 m circle, and the dispatcher has to guess which landmark to ask about. Kleinberg showed an LLM saying left when it meant right.
- **0:15-0:25. Deal a spot.** The judge presses "deal me a spot" on a laptop that faces only them.
  - The game page draws a random walkable spot and puts its SHA-256 commitment on the big screen, so we cannot cheat.
  - It hides Street View's address and road labels.
  - It sends the engine a simulated network fix: a 250 m circle centered 50-150 m from the truth.
  - The heatmap fills the circle and the meter reads 9.5 bits.
- **0:25-1:15. Localize.**
  - The judge holds the call-box button and describes the view. Grok Voice calls add_clue and the meter drops.
  - Then come 4 to 6 questions, spoken by Grok word for word and also shown on screen. The judge answers on Grove buttons (yes, no, not sure) or taps a checklist, about 3 s per answer. Each log line shows the bits that answer earned.
  - A laser dot on the 3D-printed relief wobbles wide, then settles as the posterior tightens.
  - Reveal: the hash checks out, the true spot drops onto the map, and the screen shows the error in meters and whether the truth fell inside the 90% ring.
- **1:15-1:35. Lunar clip (15 s, pre-recorded).**
  - Grok Voice listens to the real Apollo 14 EVA-2 audio and calls add_clue on the crew's observations, not on their beliefs about where they were.
  - The posterior over a hand-digitized Fra Mauro crater map moves to where LRO imagery later placed their turnaround: short of the Cone Crater rim they never found (sources say about 20-30 m).
- **1:35-2:00. One slide.** It shows the simulator convergence curve, the human-trial calibration number, one tab per sponsor, and the URL.
- **Q&A.** A judge can call the phone line in Spanish or text the iMessage agent a photo.

### Sponsor tracks

p_win is conditional on the engine gate passing.

| Track | Spoke feature powered by that sponsor | p_win |
|---|---|---|
| BigRed main | The whole loop: geometric left/right plus question planning, a direct answer to the keynote | 0.28 |
| SpaceX Make it Legendary | Grok Voice call box that drives the engine through tools; lunar replay from Apollo 14 audio; built in Cursor | 0.38 |
| MLH ElevenLabs | Real phone number (Twilio), webhook tools into the engine, language detection, warm transfer to a human dispatcher | 0.25 |
| MLH Tiger Data | Calibration loop: graded human answers feed a continuous aggregate that sets per-type error rates; aggregate vs raw latency shown | 0.30 |
| Photon iMessage | Text mode with tapbacks and photos; the friend's thread gets the live pin and can add clues; one session across call and text | 0.12 |
| MLH Gemini API | Schema-bound clue parsing; photo bounding boxes become a bearing constraint | 0.11 |
| MLH GoDaddy Registry | saywhere domain as the call-box, phone and game URL | 0.10 |
| Hardware | Relief printed from the engine's own height raster, a pan-tilt laser that tracks the posterior, a Grove call box | 0.30 |
| Design | Collapsing heatmap, bits meter, per-answer bits log, one visual language across console, iMessage and lunar | 0.22 |
| Software | Bayes filter over position and heading, an EIG planner, raycast precompute and a surprise monitor | 0.22 |
| People's Choice | Public "stump Saywhere" Street View game link | 0.08 |
| MLH Presage (gated) | Webcam pulse lowers answer reliability, so the planner picks easier questions | 0.25 if built (about 0.08 expected) |
| MLH Solana (gated) | Map bug bounty: sub-cent devnet payout to players who stump it and report the stale map fact | 0.08 if built (about 0.03 expected) |
| Capital One Nessie | Cut. The "last swipe" prior revived the rejected LastSwipe idea and moved no money | 0 |

### Why each sponsor specifically

**SpaceX / Grok Voice**
- One realtime WebSocket carries duplex speech, server voice activity detection and parallel client tool calls. The agent can call add_clue while the caller is still talking and fetch next_question in the same turn. The engine decides what to ask, and Grok is the ears and mouth, which is the "infrastructure, not chatbot" use judges reward.
- Server-minted ephemeral tokens let the call-box browser hold the audio session directly, so there is no audio relay to build. At $0.08 per minute, a full localization costs about a dime.
- The same agent can listen to archival audio. Feeding it the Apollo 14 EVA-2 recording turns real mission audio into clues through the product's own pipeline. Real space data goes in, not a themed skin.
- All three SWEs code in Cursor Agent with Co-authored-by trailers, committed .cursor/rules and exported transcripts.

**ElevenLabs**
- Native Twilio number import puts the agent on a real phone number. Anyone can call from any phone with no app and no data plan, and those callers have the worst device location.
- Server tools are typed webhooks. The agent forwards the caller's words to /clue and reads back the engine's question string, so its LLM never holds or guesses a location.
- Two system tools do work the Grok call box does not: language detection, and transfer to a number (confirm both names in hour 1). A Spanish caller is answered in Spanish. When the ring is tight, the call is warm-transferred to a human dispatcher's phone while their console shows the pin, ring and clue log. Grok would need a hand-built Twilio media bridge and transfer logic; ElevenLabs makes both configuration.

**Tiger Data**
- The calibration loop is a growing time series that must stay fresh. Each graded answer is a row: time, session, question type, feature, distance band, answer, predicted probability, graded correct, bits. A continuous aggregate with a refresh policy keeps per-type human error rates current, and the selector reads it on every question without scanning raw rows.
- Performance is shown on screen. About a million simulated answers (labeled simulated and excluded from the error rates) are used to show aggregate vs raw scan latency, plus the compression ratio with segmentby on question type.
- Time-valid features: a small table of validity intervals (closed businesses, construction fences, Street View imagery dates) and an as-of query that builds the feature layer for the call's timestamp. This is Kleinberg's freshness point, and it is the first Tiger piece to cut.

**Photon**
- iMessage is where the person coming to get you already is. The friend's own 1:1 thread receives the live pin and ring as it tightens, with no app on either side. Photon's Find My cards carry no lat/lng on shared lines (issue #53), and that missing coordinate is the gap Saywhere fills.
- Native affordances suit someone who cannot talk:
  - tapbacks answer yes/no (verify that Spectrum exposes reactions; otherwise accept "y"/"n");
  - checklists are answered with numbered replies;
  - photos go straight to Gemini vision.
- One session crosses channels. A call that starts on the phone line continues in iMessage when the caller must go quiet. The friend can add what they know ("she mentioned a fountain"), and it enters the same posterior. Safety decisions stay in the deterministic engine.

**Gemini**
- Structured output with a response schema bound to gazetteer IDs turns "the gorge is on my right and there's no bus stop" into typed clues. Left/right and negation are kept exactly. Gemini parses; it never infers location.
- Vision returns bounding boxes (box_2d). Their left-to-right order and angular spacing, combined with the camera's field of view, become a joint constraint on cell and heading. The log then shows "this photo was worth 3.8 bits."
- Stretch, off the critical path: Maps grounding resolves names that OSM has stale or missing ("the bagel place"), shown with the required Google Maps attribution.

**GoDaddy Registry**
- One domain carries every surface: the URL printed on the call box, the landing page with the phone number and iMessage link, and the public game. It is registered in hour 1 (saywhere.study, or a better-fitting TLD if tech.study offers one).

**Presage (gated)**
- SmartSpectra reads pulse from the call-box webcam with no wearable, the same video channel that 911 video platforms (Prepared, Carbyne) already open to callers.
- Pulse goes into the likelihood, not onto a dashboard. Answer rows carry a pulse band, and the aggregate measures error rate by question type and stress band. A stressed caller's left/right reliability drops, so expected information gain picks "can you see" questions on its own, with no special-case code.

**Solana (gated)**
- A stumped game produces a correction ("that bagel place is a Chipotle now"). Paying a few cents per correction only works with sub-cent fees.
- Confirmation in about a second lands the payout on the reveal screen. A memo with the hash of the feature_validity row ties each payment to the map fact it fixed.
- Built with @solana/kit transfers and memos on devnet, with no Anchor program.

### Build plan

H0 = 4:00 AM Saturday. Feature freeze is 2:00 AM Sunday. Devpost is due 8:30 AM.

**Critical path (everything else hangs off FastAPI and can be cut):**
1. SWE2 delivers the building raster at 5:15.
2. SWE1's engine runs on the real pack (without line of sight) at 7:00.
3. Raycast masks land at 9:00; the gazetteer is done at 11:00.
4. Human Street View trials run 9:30-12:00.
5. The Grok call box is live at 12:30.
6. Rehearsal.

**All, 4:00-4:45: account gates (live round trips, not signup pages)**
- xAI: prepay $10-20 and hear a realtime session.
- Twilio: upgrade (about $20), buy a number and import it into ElevenLabs. Redeem the ElevenLabs promo.
- Photon: activate HACKWITHPHOTON, register 4 phones, round-trip the debug bot.
- Gemini: confirm schema JSON and the current model name.
- Tiger: psql connects.
- Cursor: seats work.
- GoDaddy: claim code from the MLH coach.
- Presage: whoever has a Mac tests SmartSpectra pulse, or tests it on the DGX.

**SWE1 (engine, owns the critical path)**
- 4:45-7:00:
  - map-pack loader (cells, walkable mask, feature fields), so the Moon is just another pack;
  - posterior over cells and headings, with heading drift;
  - likelihoods: distance, line of sight, chirality, slope, negative evidence, per-type error mixture;
  - EIG over yes/no, checklist and open questions;
  - surprise monitor;
  - an assert-based self-test simulator, running on synthetic features until real data lands.
- 7:00: gates.
- 7:00-9:30: FastAPI /session (prior from an ellipse or a sector), /clue, /next_question, /answer, /posterior and /reveal, behind a cloudflared tunnel on the DGX.
- 9:30-12:00: trials with HW. Tune vocabulary and error rates, and shrink the area if needed.
- 13:00-15:00: lunar pack, using HW's crater JSON with distance, chirality and radial upslope toward Cone.
- 15:00-16:30: read the Tiger error rates into the selector, Beta-smoothed per type.
- Sleep 16:30-21:30.
- 21:30-2:00: contradictions, not-sure and reset handling; convergence curve for the README and slide.

**SWE2 (data, Gemini, Tiger, ElevenLabs)**
- 4:45-5:15: Overpass pull cached to GeoJSON, plus a 2 m building-height raster (levels x 3.5 m by default), handed to HW for the print.
- 5:15-6:30: 3DEP 10 m DEM and the walkable mask.
- 6:30-9:00: numpy line-of-sight raycast on the DGX, with distance falloff. Height-aware rays for 3 or 4 tall landmarks. No gdal_viewshed.
- 7:00: Gemini parse gate.
- 9:00-11:00: a 60-80 entry gazetteer, checked against Street View with HW: colors, sign text, storefronts and imagery dates.
- 11:00-13:00: Gemini vision to a bearing constraint.
- 13:00-15:30: Tiger. Answers hypertable, continuous aggregate of error rate by type, refresh policy, compression, a labeled simulated backfill, a latency endpoint for the Tiger tab, and 20 feature_validity rows with an as-of query.
- Sleep 15:30-20:30.
- 20:30-23:30: ElevenLabs agent on the Twilio number with webhook tools, language detection, and transfer to the "dispatcher" phone. Spanish test. Fallback: the ElevenLabs web widget.
- 23:30-1:00: Solana bounty, only if every core spoke is green. Otherwise fix parse failures from the game logs and draft per-sponsor write-ups.

**SWE3 (surfaces, all in Cursor)**
- 4:45-7:00: MapLibre console against a stub API: heatmap, bits meter, question log with bits per answer, 90% ring, answer buttons, one tab per sponsor.
- 7:00-9:00: Street View game page. Deal a spot, show the hash commitment and the simulated wide fix; labels hidden; reveal. Needed for the 9:30 trials.
- 10:00-12:30: Grok Voice call box. The server mints ephemeral tokens; tools are add_clue, next_question and answer. A verbatim check compares Grok's output transcript with the engine string, and on a mismatch the exact string is replayed through Grok TTS.
- 13:30-15:30: Photon Spectrum agent. Tapbacks, numbered checklists, photos to vision, the friend's thread with live pin and clue intake, and a shared session ID with the phone line.
- Sleep 15:30-20:30.
- 20:30-23:00: lunar page. LROC image with the crater overlay, and the recorded run of Grok listening to EVA-2 audio. Fallback: a deterministic text replay.
- 23:00-2:00: polish, and the public stump-Saywhere link.

**HW**
- 4:00-5:00: rental table. Arduino, Grove base shield, 2 Grove servos, 3 Grove buttons, Logitech webcam, a laser module if one exists (otherwise a printed needle). Check the printer bed and a slicer estimate.
- 5:00-5:30: build the heightmap STL from SWE2's raster with 2x terrain exaggeration, about 20 cm across the roughly 800 m core. Start the print by 5:30 with a target under 6 h. Fallback: a DEM-only TouchTerrain tile on the same bounding box.
- 5:30-9:00: pan-tilt bracket. The Arduino sketch reads "pan,tilt,wobble" over serial, with calibration offsets as tunables and a capacitor on servo power.
- 9:30-12:00: Street View test subject, the most important job. Log errors by question type.
- 12:00-14:00: hand-digitize about 20 craters (centers and radii in local meters, from the LROC NAC image scale bar and ALSJ maps) and curate 12-15 EVA-2 observation lines with audio timestamps.
- 14:00-17:00: serial bridge that owns the COM port and polls /posterior, fits a 4-corner calibration and sets wobble proportional to posterior spread. Then the call box: push-to-talk plus yes, no and not-sure buttons, sent as keypresses.
- Sleep 17:30-22:30.
- 22:30-2:00: assembly. Recruit other hackers to play the game, which produces human calibration rows. Presage integration only if the H0 test streamed a pulse; hard stop at 1:00.

**Everyone**
- 2:00-5:00: bugs and 10 timed pitches.
- 5:00-6:30: deck.
- 6:30-8:00: Devpost, with one write-up per sponsor and the Cursor screen recording.
- 8:30: People's Choice share push.

### Go/no-go

- **4:45, account gates.** Any failure switches that spoke to its fallback immediately:
  - no Twilio upgrade: ElevenLabs widget;
  - no xAI credits by 10 AM, even with help from the SpaceX table: drop SpaceX;
  - no pulse: drop Presage.
- **5:00, hardware.** Both servos sweep from serial commands, and the tile slices to under 7 h. Otherwise: call box plus a static relief, with the heatmap on a laptop beside it.
- **6:30, engine math on synthetic features.**
  - EIG over about 150 questions and about 32k states runs in under 200 ms.
  - Noise-free yes/no answers average at least 0.85 realized bits.
  - With 10% flipped answers, the truth stays inside the 90% region in at least 85% of 50 runs.
  - The surprise monitor fires in at least 80% of runs with one deliberately corrupted landmark mask, and in at most 10% of clean runs.
- **7:00, real Collegetown pack, without line of sight.** The raycast masks do not exist until 9:00, so this run uses distance, chirality, slope and negative evidence only.
  - Setup: 50 random walkable truths. The prior is a 250 m circle offset 50-150 m from the truth. Turn 1 is a simulated description with 2 true clues. After that, questions are auto-selected, with 10% of answer elements flipped.
  - PASS: median error at most 60 m within 8 turns, and the truth inside the 90% ring in at least 85% of runs.
  - If the median is over 100 m: add vocabulary or shrink the area.
- **9:15, same test with line of sight.** PASS: median error at most 40 m within 8 turns, truth inside the 90% ring in at least 85% of runs. If it still fails: pivot to a lunar-led demo, with Earth mode pitched as "narrows to a block."
- **7:00, Gemini.** At least 8 of 10 hand-written descriptions parse correctly, with left/right exact, gazetteer IDs resolved and negations as negative evidence, in under 2 s each. If not, answers come from buttons and a landmark picker, and Gemini is used for photos only.
- **10:00-12:00, humans.** Three secret Street View trials. Pass if the truth is inside the final 90% ring in at least 2 of 3. If not, cut the question types humans miss, raise their error rates and repeat at 2 PM.

### Risks

1. **The posterior stalls at block level** because features are sparse or line of sight is crude. Mitigations: start from a wide fix rather than all of Collegetown, use checklists and sign reading, use a hand gazetteer verified against Street View imagery (which is what the judge actually sees), and fall back to the lunar-led demo.
2. **Confidently wrong pins** from systematic map errors (trees, stale stores). Mitigations: the surprise monitor widens the posterior, error rates are measured per type, the pass criterion is calibration before accuracy, and the system shows a ring, never a bare pin.
3. **Paid and approval gates at 4 AM.** All are tested in the first 45 minutes, each with a named fallback.
4. **Voice agents paraphrase the question** and reintroduce the left/right bug. Mitigations: tool results carry the exact string, transcripts are checked, Grok TTS replays on a mismatch, and answers are buttons or confirmed enums.
5. **Servo precision.** One degree at 40 cm is about 7 mm, or about 28 m on the tile. Pitch the dot as "about a building"; the screen carries the finer ring.
6. **Scope.** Cut order: Solana, Presage, Maps grounding, the Tiger validity layer, Photon extras, ElevenLabs PSTN (fall back to the widget), and finally the live lunar page (fall back to the recorded clip).
7. **Lunar replay looks rigged or misses.** Use observations only, present it as "what the evidence said," and show the clue-by-clue log.
8. **"Phones have GPS."** Answer in the pitch, not in Q&A: the FCC benchmark, gorges, VoIP and old phones, and the dispatcher console.
9. **"It's Akinator on a map."** Akinator ranks a fixed list by popularity. Saywhere ranks questions by expected entropy over a spatial posterior, with geometric likelihoods and a hidden heading.
10. **BigRed may not stack** with other prizes. Ask the organizers.

### Precedent

- Active Markov localization: Fox, Burgard and Thrun, "Active Markov Localization for Mobile Robots," 1998. This is robot-side precedent for choosing actions that reduce position entropy.
- Text2Pos, CVPR 2022: https://arxiv.org/abs/2203.15125
- Where am I? Cross-view geo-localization with natural language descriptions: https://arxiv.org/abs/2412.17007
- VLG-Loc, vision-language global localization: https://arxiv.org/pdf/2512.12793
- The Wallpaper is Ugly, indoor localization using vision and language: https://arxiv.org/pdf/2410.03900
- PIGEON, image geolocation: https://arxiv.org/abs/2307.05845
- what3words Locate Link, where a dispatcher texts a link that shares the phone's location: https://what3words.com/products/locate-link
- Dispatcher SMS-link and device-location tools: https://www.govtech.com/dc/articles/911-Dispatchers-Use-New-Technologies-to-Quickly-Locate-Cellphone-Callers.html
- Manual dispatcher landmark scripts: https://www.iaedjournal.org/cellphone-trouble
- Akinator, the 20-questions comparison: https://en.akinator.com

No product does conversational localization with information-gain questioning and geometric scoring. Location links need a working smartphone with data, which is exactly the case Saywhere does not assume.

**Scores:** interesting 7.8/10, BigRed 7.8/10, feasibility 0.55, expected wins 2.1 raw, about 1.6 adjusted.

---

## 4. Felt Horizon

**One line.** A live model of your inner ear runs on a motion stream. It shows what you feel next to what is actually happening, and it forecasts your next illusion a few seconds before your body produces it. We prove it in a swivel chair: the forecast is locked on screen before the chair stops, and afterwards the rider's eyes-closed thumb slider confirms it.

**Verdict after review: keep, with fixes.**
1. **The product is now a forecast of the illusion, not a report of attitude.** This answers the reviewer's objection: "it's a bank-angle alarm, and the attitude indicator and Garmin ESP already do that."
2. **Everything on the chair is wireless.** One phone on a printed lap tray serves as both the gyro and the rider's slider. The Grove dial and the Arduino IMU are gone, because their cables would wrap around the chair column (80 deg/s for 20 s is more than 4 turns).
3. **The personal time constant comes from the rider's own slider trace, every run.** The demo never depends on Presage resolving eye beats. Presage's eye estimate becomes an independent second check.
4. **Cuts.** Removed: Gemini/NTSB, Grok Imagine, the printed hood (a white-lined box replaces it) and the Arduino IMU fallback. The Tiger flight ingest starts at 100 flights.
5. **Space data is the Gemini 8 (1966) spin plus Crew Dragon DM-1 telemetry**, not Falcon 9 alone.
6. **All four people build in Cursor Agent.**

### Trick

Your sense of rotation, and of which way is up, is a computation, and its errors can be predicted.

**Rotation (the semicircular canals).** Together with the brain's velocity storage, the canals act as a high-pass filter on rotation rate. Bertolini et al. (2011) measured a canal time constant of 5.6 s and a velocity-storage time constant of 15.5 s in healthy adults. Rotation below about 1-2 deg/s goes unnoticed. So a steady turn fades from awareness, and when it stops you feel a turn in the opposite direction.

**Tilt (the otoliths).** The otoliths sense the gravito-inertial force and cannot tell tilt from linear acceleration. Forward acceleration therefore feels like pitching up (the somatogravic illusion), and a slow roll below threshold feels level (the leans).

**The model.** We run a simplified Merfeld-style observer at 100 Hz on a live IMU stream. It has two parts:
- a canal-plus-velocity-storage high-pass filter with a detection threshold, for rotation;
- a low-pass tilt estimate from the gravito-inertial vector, corrected by the canal signal.

It outputs FELT rotation and FELT "up" next to the TRUE values, plus a conflict index.

**The non-obvious step is the forecast.** The observer's state is only a handful of numbers, so we can copy it and run it forward on a hypothetical next few seconds of motion: "the chair stops in 2 s", "the pilot rolls wings-level", "the pilot adds go-around power". `predict_felt(state, maneuver)` returns which way the body will lie, how strongly, and for how long, before it happens. An attitude indicator shows the truth now. Nothing in a cockpit tells you when, or in which direction, your body is about to disagree with it.

**The forecast is personal.**
- Each rider's velocity-storage time constant (tau) is fitted from their own slider trace, as a one-parameter least-squares fit.
- Presage's eye readout gives an independent second estimate. Bertolini et al. found that the perceptual and eye-movement (VOR) time constants co-vary, with r ≈ 0.95. Two measurement channels that agree are our validation.

### What it does

**Live view.** A phone (or the chair rig) streams motion. The dashboard shows:
- TRUE vs FELT rotation and attitude;
- a conflict index;
- a dashed "if it stopped now" ghost curve, which is the forecast updated continuously;
- a spoken callout whenever a forecast is armed.

**For student pilots and flight instructors (the primary users).**
- **In flight.** A phone on the glareshield runs the same model on the aircraft's rotation rates. Once a turn has lasted long enough for the canals to have zeroed, a roll-out forecast is armed: "You have turned 25 s at 3 deg/s. When you roll out you will feel a left bank for about 8 s. Hold the wings level on the attitude indicator." Under takeoff or go-around power: "The next 10 s will feel like a 12-degree pitch-up. Do not push."
- **After the flight.** The debrief lists every moment the model says the pilot's body was lying. It also flags whether the aircraft then drifted the way the illusion pushes, which means the student followed their body. That flag needs only the true attitude log. The instructor briefs those moments.
- **Calibration.** The 60-second chair test turns today's one-time Barany-chair demonstration into a measured calibration that personalizes the student's forecasts.

**Other users of the same engine.** Airline passengers (the flap-retraction "drop" while the plane is still climbing), VR users, and self-driving riders, where this sensory conflict causes motion sickness. This is stated as scope only; it is not built this weekend.

**Theme.** Orientation is the first layer of navigation. Spatial disorientation is the navigation failure that kills pilots: FAA safety material attributes 5-10% of general-aviation accidents to it, and about 90% of those are fatal. This is Kleinberg's trust question moved into the body: when do you trust the confident narrator (your inner ear), and when do you trust the instrument?

### Demo (2 min)

The default rider is a pre-tested teammate. A judge can ride instead (seated, with an opt-out offered).

- **0:00-0:15. Hook.** "Your sense of turning is a calculation with known errors. We forecast the error before you feel it."
- **0:15-0:25. Setup.** The rider sits in a swivel chair with a headrest. They wear a sleep mask and over-ear headphones playing pink noise, which masks footsteps, airflow and the spoken forecast. The phone is in the lap tray with the rider's thumb in the slider rail. The Presage baseline pulse has already warmed up at the eye box.
- **0:25-0:50. Spin.** A teammate spins the chair at about 80 deg/s for 20-25 s. On screen, TRUE stays flat while FELT decays toward about a quarter of the real speed, and the rider's slider follows it down.
- **0:50. Sealed forecast.** Three seconds before the stop, the screen locks a timestamped card. Grok Voice reads it to the judge, not the rider: "When it stops, the rider will feel turning LEFT at roughly 60 deg/s, half gone in about 11 s."
- **0:53. Stop at the floor mark.** Within 1-2 s the slider swings left. The two needles on the servo gauge split (TRUE at zero, FELT turning left) and the buzzer chirps.
- **0:55-1:20. Eye box.** The box slides in and the mask comes off. The rider opens their eyes into a featureless white field, so there is nothing to fixate on. Presage shows pulse against the baseline, which gates any second spin, and the eye trace. Two time constants appear side by side, for example "slider 13 s, eyes 15 s, this event's average 14 s (n = 23)".
- **1:20-1:35. Space tab.** First, the Gemini 8 replay: what Armstrong's and Scott's canals reported near one revolution per second, and the reverse spin the model predicts after Armstrong stopped it. Second, Crew Dragon DM-1 at main engine cutoff (MECO): the forward-tumble illusion. The judge holds push-to-talk and asks Grok, "What would the crew feel at MECO?" The answer comes from a tool call into the model.
- **1:35-1:50. Fleet tab and iMessage.**
  - Fleet: the top illusion moments across hundreds of airline flights, with the continuous-aggregate and raw-scan query times measured live.
  - iMessage: the rider's personal report arrives on their phone, with a copy to the "instructor".
- **1:50-2:00. Close.** Personalized forecasts in the cockpit, and an instructor debrief afterwards.

**Q&A note.** The chair exercises only the canals. The otolith illusions (somatogravic, leans) are shown in the Space and Fleet replays, not in the chair. Say this before a judge asks.

### Sponsor tracks

| Track | Spoke feature that sponsor's tech powers | p_win |
|---|---|---|
| MLH Presage | Eye box: pulse and breathing gate the next spin (a closed loop). The eye-landmark trace gives a nystagmus time constant that independently checks the slider fit. | 0.45 (0.30 if eye beats do not resolve) |
| SpaceX Make it Legendary | Grok Voice speaks the sealed forecasts and in-flight callouts, and answers questions through `get_felt_state` and `predict_felt` tools. Space data: Gemini 8 spin and Crew Dragon DM-1 replays. All four people build in Cursor. | 0.35 |
| MLH Tiger Data | Hypertables for 100 Hz sessions and 100-500 DASHlink flights run through the model. A continuous aggregate of conflict-seconds per flight-minute, compression, a raw-vs-aggregate timing panel, and a live population histogram of time constants. | 0.35 |
| Hardware | Wireless chair rig (phone in a printed lap tray with a tactile slider rail). Servo dual-needle gauge with trim calibration and a buzzer. Eye box with diffuse light and a webcam mount. | 0.30 |
| BigRed main | Orientation as the root of navigation, the sealed-forecast chair demo, and Kleinberg's trust-the-narrator question. | 0.22 |
| Design | Twin horizons (felt and real) drifting apart live, plus one instrument style shared by the web UI and the printed gauge face. | 0.18 |
| Software | A real-time observer with a forward forecast, a per-person fit, self-check asserts, and a validation plot over 5+ volunteers. | 0.18 |
| MLH GoDaddy Registry | The domain is the HTTPS origin the phone needs for motion-sensor access. | 0.12 |
| Photon iMessage | A personal vestibular report texted to each rider, plus instructor routing. A "brief this" reply is saved to the next lesson plan. | 0.10 |
| People's Choice | The chair runs for hackers all night, and every rider gets a text with the Devpost link. | 0.10 |

**Not entered.**
- Capital One Nessie and MLH Solana: there is no honest role for them.
- MLH ElevenLabs: Grok Voice already owns voice, so a second voice API would be interchangeable.
- MLH Gemini API: NTSB extraction was a side task on the most crowded track. Cutting it saves hours, and it avoids confusion with the Gemini 8 replay.

### Why each sponsor specifically

#### Presage
1. **One camera stream gives both the physiology and the eyes.** SmartSpectra returns pulse, breathing and face landmarks from the same webcam frames, with quality and stability flags. The eye box therefore needs no video-nystagmography (VNG) goggles (what clinics use for eye-movement recording) and no chest strap. Post-rotational nystagmus is the textbook objective readout of the canal and velocity-storage signal.
2. **The vitals drive a control loop.** A baseline is taken before the spin and compared afterwards. If pulse rises more than about 15 bpm above baseline, or breathing becomes irregular, the dashboard locks "spin again" and Grok says why. Judges at other events have rewarded exactly this pattern: vitals used as a control signal, not a dashboard readout.
3. **The constraints fit the protocol.** The face is still and centered in the box for 20-30 s right after the stop, which is when nystagmus and the reverse sensation happen. The 12 s pulse warm-up fits the "sit at the box before the spin" step.

#### SpaceX (Grok Voice and Cursor)
1. **Voice is the only usable channel.**
   - In the demo, the rider is masked and the forecast must reach the judge before the stop, without anyone looking away from the chair.
   - In the cockpit, the pilot's eyes must stay on the attitude indicator.
   - So Grok is the interface, not a chatbot. Deterministic callouts use Grok TTS with exact template wording, so no LLM sits in the safety path.
2. **Function tools keep the voice honest.** The realtime agent calls `get_felt_state()` and `predict_felt(maneuver)`, which return numbers from the observer. It never invents a sensation. Parallel tool calls answer "What do they feel now, and what if it stopped?" in one turn. Ephemeral tokens keep the key off the browser.
3. **Real space data through the same engine.**
   - Crew Dragon DM-1 webcast telemetry (shahar603/Telemetry-Data, 1 s samples of acceleration and velocity angle) runs through the otolith channel, and the MECO forward-tumble illusion falls out of the data. DM-1 carried a mannequin, so we frame it as "what a crew on this trajectory would feel".
   - Gemini 8 runs through the canal channel. Its roll-rate profile is reconstructed approximately from NASA's published account (near 1 rev/s, then stopped with the re-entry thrusters).
   - Cursor: all four people commit from Cursor Agent with the default "Co-authored-by" trailers, plus a `.cursor/rules` file and exported transcripts in the repo.

#### Tiger Data
1. **The workload is a real time series.** That means 100 Hz chair sessions (gyro, slider, model output, Presage frames) and about 40k rows per flight at 8 Hz across 100-500 DASHlink regional-jet flights. Hypertables are segmented by session or flight.
2. **Continuous aggregates turn a fleet-wide question into a cheap read.** "Conflict-seconds per flight-minute" is a plain SUM over `time_bucket` with a refresh policy, which avoids pg_cron. The query "top 20 moments where felt and real roll diverged by more than 10 degrees" reads the aggregate. The Fleet tab shows the aggregate time next to the raw-scan time, plus the compression ratio, all measured on screen.
3. **One database serves live and historical data.** A real-time aggregate over the live chair table puts each new rider into the event's population histogram of time constants seconds after their spin. That histogram replaces a textbook constant in the "yours vs everyone's" line.

#### Photon (Spectrum, iMessage)
1. **It reaches the student and the instructor in the thread they already use, with no app install.** Each rider's number is registered at the table (using debug.photon.codes for the exact handle). They get their report straight away: reversal latency, felt-vs-true gap, their time constant, and a 10 s chart link.
2. **A human stays in the loop, and context persists.** The instructor gets a copy and replies "brief this" or taps back on an event. That is stored in Tiger against the student and comes back in the next lesson's message.
3. **Safety logic is separate from the language model.** Deterministic thresholds decide what counts as an event, and Grok text only words it. If the wording call fails, the template text is sent instead.

#### GoDaddy Registry
1. **The domain is a requirement, not decoration.** Motion-sensor access needs a secure context, and iOS also needs `requestPermission` from a tap on an HTTPS page. The registered domain on Vercel is that origin, so any judge's phone joins with no certificate warnings.
2. **The name carries the pitch.** Candidates on whatever TLD tech.study offers: `stillspinning`, `whichwayisup`, `feltlevel`.

### Build plan

H0 = 4:00 AM Saturday. Submit by H28 (8:00 AM Sunday); the deadline is 8:30. Feature freeze at H23. Each person sleeps about 4.5 h, staggered.

**Critical path:** phone stream (T3), then the observer running live in TypeScript, then the Live tab with slider capture and the sealed forecast, then the servo gauge. If the schedule slips, cut in this order: Gemini 8 replay, Photon, eye-based time-constant fit (keep Presage vitals).

**SWE1 (model)**
- H0-1.5: `observer.py` (about 60 lines). Yaw channel: canal high-pass (5.6 s) into velocity storage (15.5 s) with a 1.5 deg/s threshold. Roll and pitch: gravito-inertial low-pass (about 3 s) with canal correction. Also `predict_felt()` and a phyphox CSV loader. One assert self-check:
  - a constant spin's felt rate falls to about 37% at tau;
  - a stop reverses the sign;
  - a 1 deg/s rotation is felt as zero;
  - the DM-1 MECO comes out as a forward tumble.
- H1.5-3: run T2 offline on three teammates and score them.
- H3-6: port to one `observer.ts` used by both the dashboard and the server. Add the "if it stopped now" ghost curve, the sealed forecast at the stop countdown, and the per-rider time-constant fit from the slider.
- H6-8: DM-1 analysed JSON through the otolith channel, and the Gemini 8 rate profile (piecewise, cited) through the canal channel.
- H8-12.5: sleep.
- H12.5-16: eye pipeline. Take the x-trace from Presage landmarks, or MediaPipe Iris on a 1080p eye crop. Remove fast phases with a velocity threshold, then fit an exponential to the slow-phase decay.
- H16-18: in-flight forecast templates (roll-out leans, go-around somatogravic) and the "followed the illusion" debrief flag.
- H18-19.5: nap.
- H19.5-23: run 5+ volunteers. Produce the fit table and the validation plot.
- H23-25: rehearse.
- H25-26.5: Software and BigRed write-ups, with the equations in the README.

**SWE2 (data and agents)**
- H0-0.5: create the Tiger Cloud service. Start downloading one DASHlink tail zip on the DGX Spark (about 800 MB, 450-650 flights). Post in the event Discord asking any pilot for a G1000 CSV.
- H0.5-2: parse one `.mat` with scipy and list the roll, pitch and acceleration parameters with their sample rates. Run T6 (COPY timing) and T7 (Photon).
- H2-3.5: hypertables `live_samples`, `flight_samples` and `eye_samples`, plus `sessions` and `lesson_notes`. Help with the gate tests.
- H3.5-8: sleep, with the ETL running on the DGX.
- H8-12: resample to 8 Hz, run `observer.py`, COPY into Tiger. Start with 100 flights and scale only if ingest keeps up.
- H12-14: continuous aggregate with a refresh policy, a compression policy, a `/perf` endpoint (raw vs aggregate ms, compression ratio) and the population time-constant view.
- H14-16: Photon rider report, instructor routing, and "brief this" written to `lesson_notes`. Grok text does the wording, with a template fallback.
- H16-18: debrief event extraction from the replays and a chart link.
- H18-19.5: nap.
- H19.5-23: integration and live session logging.
- H23-25: rehearse, plus the Tiger and Photon write-ups.
- H25-26.5: Devpost text.

**SWE3 (front end and voice, all in Cursor)**
- H0-1: Grok key with a $10-20 prepay, run T5. Register the domain and point it at Vercel. Add `.cursor/rules`.
- H1-3: phone page (motion sensors, iOS permission on a tap, the slider) and a WebSocket relay over HTTPS. Run T3.
- H3-8: Live tab with TRUE, FELT and slider traces, the ghost curve, the sealed forecast card, the conflict index and the twin horizons.
- H8-12.5: sleep.
- H12.5-15: Grok TTS for the forecast callouts. Realtime agent with ephemeral tokens and both tools, on push-to-talk.
- H15-17: Space tab.
- H17-18: Eye tab and Fleet tab (reading `/perf`).
- H18-19: Debrief tab.
- H19-20.5: nap.
- H20.5-23: design polish and transcript export.
- H23-25: rehearse.
- H25-26.5: video (including screen recordings of Cursor) and deck.

**HW**
- H0-1: rentals: Arduino with Grove shield, two servos or SG90s, a Grove buzzer and the webcam. Check whether the Pi kit has Wi-Fi. Secure a swivel chair, with a headrest if possible.
- H1-3: push the chair for T1 and T2. Bring up Presage for T4 on whatever Mac, Linux box or DGX is available, using the Presage skill and MCP to get the key.
- H3-3.5: start the prints: the lap tray with slider rail, and the gauge face, bezel and needles.
- H3.5-8: sleep while the printer runs.
- H8-11: dual-needle gauge driven by Web Serial from the dashboard, with a trim calibration routine and a buzzer that fires when a forecast is armed.
- H11-14: eye box (white-lined box, diffuse LED, webcam mount, a slide rail on the table), with Presage streaming to the relay.
- H14-16: only if the Pi kit has Wi-Fi, a Grove 6-axis IMU on it with a power bank under the seat as a custom chair sensor (2 h cap). Otherwise, polish.
- H16-18: safety pass and integration.
- H18-19.5: nap.
- H19.5-23: harden, and support the volunteer runs.
- H23-25: rehearse.
- H25-26.5: hardware write-up and photos.

### Go/no-go

All tests run in parallel during H0-3, with the decision at H3.

- **T1, by H0.5 (KILL).** A free-spinning chair is secured. With phyphox recording on a phone in the rider's lap, a teammate holds 60-90 deg/s for 20 s with no more than ±25% ripple, then stops the chair within 1 s. Ripple is acceptable because the model is driven by the measured gyro, not the target speed.
- **T2, by H2.5 (KILL, no app code).** Three teammates each do a 20 s spin and a stop, masked and with noise in their headphones, calling out "slowing", "turning back" and "gone". The calls are timestamped against the phyphox log and compared with `observer.py` run offline. PASS requires both:
  - the reverse sensation is reported within 3 s of the stop in 3 of 3;
  - the fade times fall within ±50% of the model in at least 2 of 3.
- **T3, by H2.5 (KILL).** The phone page on an HTTPS origin gets sensor permission on one iPhone and one Android. It streams at 50 Hz or more through the relay with median latency under 200 ms and no dropouts during a spin. Retry over a phone hotspot before killing.
- **T4, by H2.5 (Presage scope).** SmartSpectra runs at 25 fps or more with a valid key, and pulse confidence rises above 0 within 30 s in the box. Dump one landmark frame and count the points. Record 20 s after a spin and plot the eye x-trace from Presage, and from MediaPipe Iris on an eye crop.
  - Visible beats in either trace: keep the eye-based fit.
  - Presage runs but shows no beats: Presage covers vitals only.
  - Presage runs on no machine: try the REST upload path, or drop the track while the core continues.
- **T5, by H1.5.** Grok realtime with an ephemeral token calls a dummy tool and speaks the number within about 2 s on push-to-talk, in hall noise. If it fails, the SpaceX spoke drops to Grok TTS and STT.
- **T6, by H2.** The Tiger service is up and one `.mat` file parses. A test COPY of 1M rows from the venue network finishes in under 2 min; if slower, cap at 100 flights.
- **T7, by H2.** A Photon send and reply works with a registered number. If it fails, drop Photon, after at most 1 hour.
- **Fallback.** If T1, T2 or T3 fails, switch to the team's runner-up finalist. The shared setup from H0-3 (Tiger, domain, Grok key, Photon line, Cursor) carries over.

### Risks

1. **Perception varies between people.**
   - Published perceptual time constants range from about 7 to 30 s, and a chatty rider breaks the effect.
   - Mitigations: claim only direction and timing ("reverses within about 2 s of the stop"), fit each rider's time constant, use a pre-tested teammate as the default rider, a sleep mask, and noise headphones. Show the aggregate fit from 5+ volunteers.
   - Also, a 20 s spin gives a felt "slowing", not a felt "stopped", so the script says "a quarter of the real speed".
2. **Presage eye beats may not resolve.** A beat of a few degrees is only 1-4 px in a face-framed webcam, and fixation suppresses nystagmus. The slider fit carries the demo either way. Presage keeps the vitals gate. The write-up states honestly whether the eye-based time constant came from Presage landmarks or from MediaPipe.
3. **Presage platform.** The SDK targets macOS and Linux; Windows has a record of failures, and the DGX (Linux arm64) is untested. Find a Mac at H0.
4. **Venue network.** Client isolation is common on campus Wi-Fi. Route the phone through the HTTPS relay, with a hotspot as backup.
5. **No real light-aircraft (general-aviation) flight log.** The general-aviation debrief rests on DASHlink airline data (where every coordinated turn correctly flags as "the passenger never feels the bank"), chair sessions, and a G1000 CSV if the Discord request finds one. Say so plainly.
6. **Usefulness objection: "the attitude indicator already shows bank".** The answer: the instrument shows the truth now. Felt Horizon forecasts when and which way your body is about to disagree, personalized to you, and the debrief shows whether you followed your body.
7. **Safety.** Riders stay seated, at no more than 90 deg/s for no more than 25 s, with their head against the headrest. No nodding after the stop: cross-coupled (Coriolis) stimulation causes nausea. There is an opt-out for vertigo, motion sickness, pregnancy or neck problems, plus a spotter and the pulse gate.
8. **Fatigue and overreach.** The scope is cut to about 60 person-hours, with a freeze at H23 and the cut order above.

### Precedent

The closest work is research and military tools, plus clinical nystagmus recorders. There is no consumer or general-aviation product.

**Spatial-disorientation models and alerting**
- NASA, real-time predictive spatial-disorientation modeling (MODSIM 2018): https://www.modsimworld.org/papers/2018/MODSIM_2018_Paper_not_required_for_a_14.pdf
- US Patent 9205929, model-based alerting of spatial disorientation to a pilot: https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9205929
- Model-based framework for spatial-disorientation mitigation in sensory-deprived environments (2022): https://www.sciencedirect.com/science/article/abs/pii/S2468896722000398
- Real-time spatial-disorientation detection for triggering countermeasures (dissertation): https://dl.acm.org/doi/10.5555/AAI29068928
- Observer model with in-flight perceptual thresholds (DTIC): https://apps.dtic.mil/sti/citations/AD1124219
- Somatogravic illusion evaluated from accident flight data: https://www.mdpi.com/2313-576X/8/4/85
- Vestibular model in the Disorientation Research Device: https://pubmed.ncbi.nlm.nih.gov/31558200

**Physiology**
- Bertolini et al. 2011, velocity storage in self-motion perception (time constants, perception vs VOR co-variation): https://journals.physiology.org/doi/full/10.1152/jn.00154.2010

**Products nearby (none models perception)**
- Garmin ESP (reacts to large bank angles): https://www.garmin.com/en-US/aviation/esp/
- CloudAhoy debrief (attitude replay): https://www.ainonline.com/aviation-news/general-aviation/2021-04-28/cloudahoy-puts-flight-path-vector-debrief-tool
- Smartphone nystagmus recorders (record eye movements; fit no perception model): https://pubmed.ncbi.nlm.nih.gov/40688101/
- Pilots asking for, and doubting, a spatial-disorientation wearable: https://www.pilotsofamerica.com/community/threads/tear-apart-my-concept-a-wearable-for-spatial-disorientation.154408/

**Data**
- DASHlink Sample Flight Data: https://c3.ndc.nasa.gov/dashlink/projects/85/
- SpaceX webcast telemetry, including DM-1: https://github.com/shahar603/Telemetry-Data
- Gemini 8 account: https://www.nasa.gov/missions/gemini/gemini-viii/geminis-first-docking-turns-to-wild-ride-in-orbit/

**Scores:** interesting 8/10, BigRed 7/10, feasibility 0.6, expected wins 2.0 raw, about 1.5 adjusted.

---

## 5. Neither Home

Domain: neitherhome on whichever TLD tech.study offers.

**One line.** Two people who must not learn each other's address get a fair public meeting place. The pairs: a protected-address survivor and her ex at a custody exchange, or a Marketplace buyer and seller. Their phones privately answer a public list of yes/no reachability questions. Each phone refuses any question whose answer could narrow its owner below K map cells, so a stalker who reruns the protocol learns nothing new. At the venue, a kiosk with a rotating signed QR proves arrival and runs a locked handoff with bank escrow.

**Verdict: keep.** The core holds. Every flaw the reviews raised is either fixed below or cut.

### What changed from the reviewed brief

- **Core protocol rebuilt.** The old design ran tier cardinality PSI and then opened the intersection. Three things leaked: the set sizes, the unshuffled match positions, and the whole intersection at T*. It is replaced by a scan over a public order of single (tier, venue) questions. Every question is one fixed-size blinded point per phone, so there is no size leak and nothing to shuffle. The phone's own **K-cell guard** now bounds leakage, including to a malicious counterparty, to the server, and to both colluding, across every run ever made. The probe defense used to be "consent and rate limits". Now it is math the phone enforces itself.
- **Lead user re-aimed.** The lead user is now someone whose address is legally confidential: NY's Address Confidentiality Program has served 10,000+ participants since 2012. Marketplace stays as the money mode for the Nessie spoke.
- **Solana changes.** Each party commits once per run, not once per round. Each phone signs with its own device key while the server pays fees, so the server holds no user keys. The kiosk key is now the venue's on-chain Ed25519 identity, and a bundle-hash transparency log is added. No-show bonds are cut.
- **Hardware changes.** A servo-latched 3D-printed locker replaces the webcam item check. Check-ins are now individual, with no 10 s joint window, which allows contact-free handoff.
- **Tiger changes.** Tiger now holds real event data: kiosk and exchange events, an hour-of-week tie-break cagg the phones fetch at run start, and the on-time record that courts ask for.
- **Cut:** the Gemini item check, TCAT transit, Solana bonds, the co-parent expense relay, the in-car Grok agent (replaced by a kiosk voice), Grok Imagine, ElevenLabs and Presage.

### Trick

**1. Public setup, identical on both phones.**
- About 40 vetted Ithaca venues: police lobbies, library lobbies, staffed stores.
- A travel-time table from every 200 m grid cell (about 1,700 land cells) to every venue, for walking and driving, built offline with OSRM. It is about 300 KB.
- Each phone downloads the whole table and looks up its own cell locally, so its location never goes over the network. This is private retrieval by downloading everything.

**2. Questions.** Tiers are T = 5, 10, 15, 20, 25, 30, 40 min. Question p = (T, v) asks: "Can you reach venue v within T minutes?" All 280 questions sit in one public order: by tier, then by venue score for the meeting's hour-of-week (open, staffed, low no-show rate, served from Tiger).

**3. One question, privately (DH on ristretto255, @noble/curves).**
- Both phones hash (run_id, T, v) to a point H.
- A sends H^a if its answer is yes, or a random point if no. B does the same with its own secret b.
- They swap, each raises the other's point to its own secret, and they compare.
- The values match only if both said yes, because H^(ab) = H^(ba).

A question costs one WebSocket round trip and a few milliseconds of math. The meeting place is the first question where both said yes. Questions run in tier order, so nobody travels more than T*, the first tier with a common venue. That makes the result minimax-fair to within one tier, and no travel time is ever sent.

**4. The guard (the new part).**
- **Worst case.** A malicious counterparty can always send "yes", so in the worst case it learns your answer to every question actually asked.
- **The region R.** Your phone keeps R, the set of grid cells consistent with every answer you have ever given, across all runs and all counterparties. It is computed from the public table and stored per starting place.
- **The check.** Before each question the phone looks at both possible answers. The question is allowed only if, among cells in R, the yes-cells number 0 or at least K, and the no-cells number 0 or at least K. K = 75 cells (about 3 km²) by default, and it is a slider.
- **Skipping.** A disallowed question is skipped. After each answer, each phone sends a 280-bit skip vector, and both move to the next question that both allow.
- **Result.** Everything anyone learns, combined over all runs, still leaves you somewhere among at least K cells.
- **Later runs.** Once R is small, later runs still work, but only through questions that every cell in R answers the same way, so they reveal zero bits.
- **The heatmap.** The phone draws R as "what they can know about you", with the area in km².
- **Why announcing skips is safe.** Skip decisions depend only on R, and R depends only on answers a worst-case counterparty already has. Announcing them adds nothing beyond the bound.

**5. Commit before reveal.**
- Before question 1, each phone precomputes its full vector of 280 points and posts its hash to Solana, signed by the phone's own key.
- At the end the phones swap vectors and check them against the hashes, so nobody can change answers after seeing outcomes.
- Revealing the vector is safe, because without a, the other side cannot test it.

**6. Proof of presence.**
- The kiosk shows a QR that rotates every 5 s. It encodes a URL carrying (venue, time, nonce), signed with the kiosk's Ed25519 key.
- The phone's native camera opens the URL. The server checks the signature and that the code is under 10 s old by the server clock.
- Browser GPS can be faked in devtools. A fresh signed code cannot be read from home.

**Who learns what (one slide for the judges)**

| Who | Learns at most |
|---|---|
| Counterparty, worst case (always says yes) | Your answers to the questions asked, so only that you are in R, with \|R\| ≥ K |
| Our server | Blinded points, skip vectors, which question matched, and the venue. Same bound |
| Server and counterparty colluding | Same bound. R already assumes the worst case |
| Out of scope | Being tailed from the venue. A targeted malicious JS bundle (detectable through the Solana bundle log, not prevented). The relay only says "on time" or "late by N min", never an ETA, because an ETA reveals distance |

### What it does

**Protected mode (the lead).** Maya is in NY's Address Confidentiality Program. Her custody order names an exchange site picked before she moved, and it is now 45 minutes away for her. Any fairer site computed from addresses tells her ex which side of town she lives on.
- Neither Home computes a fair staffed site that her advocate can propose to the mediator, without either side disclosing an address.
- At each exchange, both parents check in at the kiosk, with staggered arrival allowed.
- A trusted contact gets check-in notices.
- The check-in log becomes the on-time record that family courts ask for.
- Her budget is global: R covers every counterparty, so sock-puppet accounts gain nothing.

**Marketplace mode.** The same protocol picks the venue. Then:
1. The buyer's money moves into a bank escrow account at match.
2. The seller checks in and drops the item in the locker.
3. The buyer checks in, opens the locker, and confirms by iMessage tapback.
4. The escrow pays the seller. A wrong item or a no-show refunds the buyer.

Nobody carries cash and nobody sees the other's bank or payment handle. The two never need to be at the venue together.

### Demo (2 min)

Judges' numbers are registered at the table and they text the bot "hi" before the pitch starts.

- **0:00-0:20 (problem, said while the judges drop secret pins).** "Maya's court-ordered exchange spot was picked before she moved. Proposing a fairer one tells her ex where she lives. Same problem for a Marketplace sale with a stranger."
- **0:20-0:55 (the run).**
  - Each judge has a private link in their own 1:1 iMessage thread with the agent. Neither has the other's number.
  - The big screen shows the "server view": blinded hex and a strip of 280 questions ticking skip / no / no / yes.
  - The venue appears, for example "Tompkins County Public Library lobby, at most 20 min for both".
  - Each phone draws only its own route and its own red region: "what they can know about you: 4.8 km²".
  - Solana explorer links show both commits.
- **0:55-1:30 (exchange post at the table, Marketplace mode, $40 item).**
  1. The seller judge scans the rotating QR with the native camera. The locker unlatches, the item goes in, the door closes, and the LED turns amber.
  2. The buyer judge scans, the locker opens, and the buyer takes the item.
  3. iMessage asks: "Thumbs-up if it matches the listing." The buyer taps back.
  4. The Nessie tab shows escrow paying the seller $40, and the LED turns green.
- **1:30-2:00 (the stalker).**
  - The buyer judge taps "find them again". The seller's iMessage reads: "Your counterparty asked for another location run."
  - The seller's phone shows: "Run 2: 31 questions asked, 0 bits about you revealed, region still 4.8 km²."
  - The Solana run log shows the second request, signed by the buyer's device key.
  - Close: "Neither of you said where you live. Not to each other, not to us."

### Sponsor tracks

| Track | Spoke feature that sponsor's tech powers | p_win |
|---|---|---|
| MLH Solana | Input commits signed by device keys, with the server as fee payer. Co-signed run log. Kiosk key as the on-chain venue identity, plus check-in attestations. Bundle-hash transparency log | 0.42 |
| Capital One Nessie | Marketplace escrow: buyer to escrow at match, escrow to seller on locker pickup plus tapback, escrow to buyer on a wrong item or no-show | 0.30 |
| Hardware | Exchange post: rotating Ed25519 QR, Grove servo-latched printed locker, door switch, LED states | 0.30 |
| Software | Private question scan plus the K-cell guard, an oracle self-test, and a live stalker demo | 0.22 |
| Photon iMessage | A go-between agent in two 1:1 threads. Tapback consent and confirmation, probe alerts, no-show timer, trusted contact, weekly co-parent context | 0.15 |
| MLH Tiger Data | Kiosk and exchange event hypertable. A cagg by hour-of-week that sets the public question order. A court on-time-record cagg. Compression | 0.15 |
| BigRed main | Navigating two people to a fair place without either revealing their starting point | 0.13 |
| SpaceX Make it Legendary | All four build in Cursor. A Grok Voice multilingual exchange-post assistant with location-free tools | 0.13 |
| MLH GoDaddy Registry | neitherhome as the HTTPS origin and the only link the agent sends | 0.12 |
| MLH Gemini API | Venue vetting with Grounding with Google Maps, plus citations in the venue tab. Gemini words the iMessages | 0.05 |
| Design (free opt-in) | Split view: phone A / server view / phone B | 0.03 |

ElevenLabs and Presage: do not enter. A second voice stack would be a bolt-on, and a stress read at the handoff would be a gimmick.

### Why each sponsor specifically

**Solana**
1. **Fast, cheap commits.** About 400 ms slots and fees near 0.000005 SOL make two commit memos before every run cheap and fast enough to sit on the run path. Each commit pins the hash of a phone's whole answer vector, so nobody can change answers mid-run.
2. **Separate fee payer.** A Solana transaction's fee payer can be a different signer. The server pays fees, but each phone's own Ed25519 key signs its commit, its consent and the co-signed run log. Users need no wallet and no SOL, and the server cannot forge a run or a consent.
3. **Ed25519 throughout.** A Solana address is an Ed25519 public key. The kiosk's QR-signing key is the venue's on-chain identity, registered by memo. Each check-in memo carries the kiosk's signature and the phone's, so an advocate or court can verify presence from the chain alone.
4. **Public, append-only probe log.** Every run request is a memo signed by the requester. The victim knows the counterparty's device key and can show an advocate every run it requested, without trusting our database.
5. **Code transparency.** The SHA-256 of each deployed client bundle is posted as a memo. A served bundle that is missing from the log is evidence of tampering.

**Capital One Nessie**
1. **Real bank primitives.** Customers, accounts and transfers carry a status. The escrow is a third account the app holds, and the locker and messages are gated on transfer status, not on a flag in our database.
2. **No identity leak through payment.** Venmo and Zelle show names and often mutual contacts. Here each side sees only the escrow account, and that matters for the same reason the address does.
3. **No cash.** Marketplace meetup robberies happen because someone is carrying cash. With the bank holding the money until the item is picked up, there is no reason to rob anyone. This is the "reimagine banking" story, in the guarded-release pattern that won with RentEscrow.
4. **Refund is built in.** A thumbs-down or a seller no-show sends escrow back to the buyer. Buyers hold dollars in bank accounts, not SOL, which is why this rail is Nessie and not Solana.

**Hardware**
1. **Presence GPS cannot fake.** Browser GPS is spoofable. A 5 s rotating signed QR proves you stood at the post seconds ago.
2. **Contact-free handoff.** The servo latch means the seller deposits and leaves, and the buyer opens the locker after their own check-in. That handles no-contact orders and robbery risk.
3. **Physical escrow.** The latch moves only on state-machine events.
4. **Tunable knobs:** QR rotation period, freshness window, servo angles, door debounce.

**Photon (Spectrum)**
1. **Two numbers stay private.** One agent in two 1:1 threads means neither party ever gets the other's number, and the counterparty installs nothing.
2. **Tapbacks are decisions.** A love tapback allows one location run. Thumbs-up releases escrow and thumbs-down refunds. Each is a timestamped human-in-the-loop action.
3. **Safety rules are deterministic, separate from the LLM.** These include the probe alert, the no-show timer, trusted-contact notices and staggered-departure reminders.
4. **Context across time.** Weekly custody exchanges recur in the same threads, with the on-time record pulled from Tiger: "Same time Sunday? Last 4 exchanges on time."

**Tiger Data**
1. **The question order depends on the hour.** A continuous aggregate of no-show and late rates per venue per hour-of-week, refreshed by policy as kiosk events arrive, is fetched by both phones at run start. Show raw vs cagg latency on screen.
2. **A court-facing record.** A second cagg computes the on-time rate per pair per month.
3. **Long retention.** Compression on the event hypertable, because custody cases run for years. Show the compression ratio.
4. **Honest labeling.** The 12-month backfill is simulated and labeled as such. The kiosk's live events append to the same hypertable.

**SpaceX (Cursor + Grok Voice)**
1. **Many languages, one session.** Grok Voice does speech-to-speech in 20+ languages in one realtime session, so the exchange post talks each party through check-in in their own language. Ithaca Marketplace trades often involve people without a common language.
2. **Tools that cannot leak.** With client tool calls defined by JSON schema, the agent's only tools are get_exchange_state and report_problem, so it cannot reveal a location even if asked.
3. **No key on the device.** Ephemeral client tokens keep the API key off the kiosk.
4. **Cursor, provably.** All four people build in Cursor. Keep the Co-authored-by trailers and export transcripts to /cursor-logs.

**Gemini**
1. **Grounded vetting.** Grounding with Google Maps vets each candidate venue against Maps place data (public? staffed? open at that hour?) and returns citations. No other model API grounds in Google Maps.
2. **Auditable list.** The citations appear in the venue tab with unmodified "Google Maps" attribution, so both parties can audit why a venue is on the public list.

**GoDaddy**
1. **Required anyway.** iOS geolocation and WebCrypto need an HTTPS origin.
2. **The name carries the story.** It is the one link the agent sends.

### Build plan

H0 = 04:00 Sat.
- **Sleep shifts:** shift A (SWE1, HW) sleeps 13:00-18:00 Sat. Shift B (SWE2, SWE3) sleeps 00:30-05:30 Sun.
- **Freezes:** feature freeze 23:00 Sat. Demo path frozen 01:00 Sun.
- **Deck and write-ups:** 06:30-08:00 Sun, submit by 08:00.

**All, 04:00-04:45.** Set up accounts and keys in parallel:
- Photon with HACKWITHPHOTON, our 4 numbers registered.
- Nessie key over HTTPS (phone hotspot if the portal resets).
- Tiger Cloud, Gemini key, xAI with a $10-20 prepay.
- Helius devnet RPC, and airdrop 5 SOL now.
- tech.study domain claim, plus a cloudflared tunnel as the HTTPS fallback.
- Cursor for everyone, with the attribution trailer on.

**SWE1: protocol and Solana (the critical path).**
- **04:45-07:00:** Question primitive with pinned @noble/curves ristretto255 and domain-separated hash. Scan state machine with skip vectors. R as a bitset, plus the guard. One Node self-test (spec under go/no-go #1), run on a haversine stand-in table until the real one lands.
- **07:00-08:30:** ws relay with pipelined messages (the double-blind for p carries the point for the next question). Browser build. Go/no-go #1 on two iPhones.
- **08:30-10:30:** @solana/kit memos:
  - Device keys (WebCrypto Ed25519, or the polyfill if needed).
  - Server fee payer with partial signing.
  - Commit and vector-check memos, run-request and run-log memos, bundle-hash memo at deploy.
- **10:30-13:00:** Always-yes attacker client, rerun flow, consent gate, one-run-per-pair-per-day policy, R stored in IndexedDB per starting place.
- **18:00-00:30:** Integration with the UI, Photon events and kiosk check-in attestation memos.
- **00:30-05:00:** Ten end-to-end rehearsals with HW, then record the backup video. Software and Solana write-ups.

**SWE2: data, map, Tiger, Gemini.**
- **04:45-06:00:** Pick about 55 candidate venues. Run a Gemini Maps-grounding vetting script, keep 40, and store citations in venues.json.
- **06:00-07:30:** 200 m grid. OSRM tables for foot (routing.openstreetmap.de) and car (router.project-osrm.org), at most 100 coordinates per call and 1 req/s. Write table.bin (Uint16 seconds). Fallback: haversine × 1.3.
- **07:30-08:30:** Hand the table to SWE1. Measure iPhone parse time.
- **08:30-13:00:** MapLibre UI:
  - Secret pin, local cell lookup, R heatmap with km², K slider.
  - Question strip, server view.
  - "Navigate" deep link that carries only the destination, so no route request ever includes your location.
- **13:00-15:30:** Tiger:
  - exchange_events and kiosk_events hypertables, with the simulated 12-month backfill.
  - Two caggs plus a refresh policy and compression.
  - The hour-of-week score endpoint.
  - A latency and compression panel.
- **15:30-18:00:** One UI tab per sponsor.
- **18:00-00:30:** Integration and polish.
- **05:30-06:30:** Tiger, Gemini and Design write-ups.

**SWE3: Nessie, Photon, Grok, domain.**
- **04:00-04:45:** Domain and DNS.
- **04:45-06:00:** Go/no-go #3 and #5.
- **06:00-08:30:** Nessie escrow module:
  - Customers and accounts for buyer, seller and escrow.
  - Fund, release and refund transfers, with status polling.
  - The Nessie tab.
- **08:30-13:00:** Photon go-between:
  - Pair routing across two 1:1 threads, private link, time negotiation.
  - Consent tapback, venue announcement, "late by N" relay, item tapback wired to escrow.
  - No-show timer, probe alert, trusted contact.
  - Rules decide, and Gemini words messages from structured events.
- **13:00-15:30:** Grok Voice kiosk assistant: an ephemeral-token endpoint plus two tools. This is the first thing to cut.
- **15:30-00:30:** Escrow and locker state machine with HW, then integration.
- **05:30-06:30:** Nessie, Photon and SpaceX write-ups.

**HW: exchange post.**
- **04:00-05:00:** MLH desk (find an organizer if it is closed). Confirm a full Pi or a Pico, a Grove servo, a chainable RGB LED or LED bar, a Grove magnetic or limit switch, and a display.
- **05:00-06:00:** CAD a small locker (about 15 cm box, hinged door, servo latch mount) and start the print. If the queue is long, print only the latch and hinge and use foam board for the box.
- **06:00-09:00:** Python pynacl signer with a Solana-format keypair. Full-screen QR rotating every 5 s on a Pi over HDMI, or on a laptop. Shared verify endpoint with SWE1.
- **09:00-11:30:** Arduino with a Grove shield: servo latch, door switch, LED states (idle, deposit-open, holding, buyer-open, released, refunded) over USB serial to the kiosk host.
- **11:30-13:00:** Bridge kiosk events to the server state machine.
- **18:00-00:30:** Assembly and integration.
- **00:30-05:00:** Rehearsals and photos.
- **05:00-06:30:** Hardware write-up.

**Critical path.** The scan and guard on two iPhones by 08:30 → UI integration by 17:00 → kiosk, locker and escrow state machine 18:00-21:00 → full end-to-end at 22:00 → 10 rehearsals by 03:00.

**Cut order if behind at 18:00 Sat:**
1. Grok Voice (loses SpaceX).
2. Tiger backfill: keep the live hypertable and one cagg.
3. Gemini vetting: hand-curate the list (loses Gemini).
4. The printed locker: switch to foam board.
5. The bundle-hash memo.

Never cut: the scan and guard, kiosk check-in, the Nessie escrow, the Solana commits and run log, Photon consent and alerts.

### Go/no-go (first 2-3 hours)

1. **Protocol, by 07:00 Node and 08:30 iPhones. Kill the idea if this fails by 09:00.**
   - The Node self-test passes on 50 random pin pairs:
     - The venue equals the plaintext oracle: the first question in public order, among those the guard allows, where both are reachable.
     - The relay transcript contains zero venue IDs or coordinates.
     - After 10 always-yes adversarial reruns, the phone's R equals a brute-force R (enumerate all cells against the revealed answers), and \|R\| ≥ K throughout.
   - Two iPhones in Safari over HTTPS on venue Wi-Fi finish a run in under 5 s.
   - At K = 75, at least 90% of pairs find a venue and the median T* is 20 min or less.
   - Fallbacks: if the run is too slow, answer 2 questions per round trip (the guard already counts every revealed answer). If too few pairs find a venue, lower K or add driving tiers.
2. **Nessie, by 06:00.** Create 3 accounts over HTTPS and POST one transfer. Balances change, or the status is not stuck at pending. If not, ask the Capital One table. If still blocked at 09:00, drop Nessie, and the locker releases on tapback alone.
3. **Solana, by 06:00.** A memo signed by a browser-generated key, with the server as fee payer, confirms on the Helius devnet RPC, and the explorer link opens.
4. **Photon, by 06:00.** The bot holds two separate 1:1 threads with registered teammates. Test whether it can send first, and if not, judges text first.
5. **Hardware, by 06:00.** Parts are confirmed and the print has started. By 09:00, an iPhone native-camera scan of the rotating QR verifies on the server, and a stale code (older than 10 s) is rejected. Fallback: a laptop kiosk with an Arduino.
6. **Data, by 07:30.** An OSRM table call returns (40 venues × 60 cells). Otherwise use the haversine × 1.3 table.
7. **Domain, by 05:00.** The domain resolves over HTTPS. Otherwise use the tunnel URL.
8. **xAI, by 15:30.** The ephemeral token works and one voice round trip triggers a tool call. Otherwise drop SpaceX.

### Risks

1. **Fairness vs privacy.** At K = 75, typical meetings land in the 20-min walking tier rather than 10. That is the honest price of the guarantee. K is a visible slider, and the go/no-go measures the trade.
2. **Judges probing the privacy claim.** Answer with the "who learns what" table above. Physical tailing and malicious bundles are named out of scope: the bundle log makes tampering detectable, not impossible. Protected mode uses a global R, which closes the sock-puppet gap. Marketplace mode does the same by default.
3. **Latency.** There is one round trip per asked question, and about 10-40 questions are asked once skips are applied. The fallback is two questions per round trip.
4. **Nessie writes are untested in the shared sandbox.** Use HTTPS only, the portal may need a hotspot, and transfers may sit at pending.
5. **Photon only reaches registered numbers.** Register the judges at the table in 30 s, check with debug.photon.codes, and have teammates' phones as backup.
6. **Hardware parts are unverified** (Pi or Pico, a Grove servo). The print queue is unknown. Foam board is the fallback.
7. **BigRed theme fit is moderate.** Have a one-line answer ready for "why not the police station": "It can be 45 minutes for one parent, and choosing which station tells the other side where you live. Police lobbies are in our list; we pick the fair one without the leak."
8. **Legal framing.** The product proposes a fair site for an advocate or mediator to bring to the court. It does not override a court order.
9. **Relayed-QR attack** (live video of the code to a remote accomplice): out of scope. The locker needs a physical hand anyway.
10. **Scope is still 10 tracks.** The cut order above protects the four spokes that carry the most weight.
11. **Pitch load.** Blinded questions, the guard, the kiosk, escrow and the stalker rerun are five ideas for two minutes. Lead with the stalker beat and the "who learns what" slide; the kiosk can be shown silently.

### Precedent

Research exists. We found no shipped product that hides both addresses. The K-cell guard on question choice is our own design, and it can be checked by brute force.

- **Bilogrevic et al., Privacy-Preserving Optimal Meeting Location Determination, IEEE TIFS 2014.** It assumes honest-but-curious parties and does not bound repeat probing. https://sprite.utsa.edu/publications/articles/bilogrevicTIFS14.pdf
- **Narayanan, Thiagarajan, Lakhani, Hamburg, Boneh, Location Privacy via Private Proximity Testing, NDSS 2011.** https://www.ndss-symposium.org/ndss2011/privacy-private-proximity-testing-paper/
- **De Cristofaro, Gasti, Tsudik, Fast and Private Computation of Cardinality of Set Intersection and Union (DH-based PSI-CA), CANS 2012.** https://eprint.iacr.org/2011/141.pdf
- **Lightweight Privacy-Preserving Fair Meeting Location Determination (IEEE).** https://ieeexplore.ieee.org/document/8952801/
- **Damir, Privacy-Preserving Fair Meeting Point Agreement (poster, 2024).** https://haic.fi/wp-content/uploads/2024/06/Damir_DemoDay2024_Poster.pdf
- **Google Maps "Find the perfect meetup spot" reference architecture.** It needs both locations in the clear. https://developers.google.com/maps/architecture/find-meetup-spot
- **LinkMe Meet Halfway.** Both addresses in the clear. https://play.google.com/store/apps/details?id=myapp.example.linkme&hl=en_US
- **SafeMeet.** Check-ins and live location, with no venue choice. https://safemeet.space/
- **Police safe exchange zones.** A fixed spot that ignores fairness. https://www.santafetx.gov/police/page/safe-exchange-zone
- **NY Address Confidentiality Program (the user).** https://dos.ny.gov/address-confidentiality ; 10,000+ participants since 2012: https://dos.ny.gov/news/new-york-state-department-states-address-confidentiality-program-has-served-more-10000

**Scores:** interesting 7.5/10, BigRed 6.5/10, feasibility 0.6, expected wins 1.7 raw, about 1.25 adjusted.

---

## Cut

**Finalists killed this round:** none. All five clear the quality bar and are kept as fallbacks. Neither Home ranks last on adjusted expected wins (about 1.25) and pitch load, and its two strongest spokes (Solana, Nessie) are covered at least as well by Six Hops.

**Cut during selection:**
- **Relay:** weakest usefulness ("who hands their stuff to a chain of strangers?"), a contrived table demo, and walker-flow prediction on simulated pings. Six Hops uses its Kleinberg greedy-forwarding hook better.
- **Lifeline (ZUPT firefighter boot):** firefighter guidance is on the cliche list, ZUPT on 60 Hz phone motion data is marginal, heading-drift correction needs a map-matching particle filter that won't fit in a day, and TRX NEON already exists.
- **Homing (60-second blindfolded walk plus bank life-space):** the Nessie life-space signal would run on synthetic histories (the flaw that sank LastSwipe), it has the fewest credible spokes, and "does it diagnose?" is hard to defend in 2 minutes. Felt Horizon covers the body-perception lens better.
- **Homing (inner compass, GLAMPI decomposition):** about 5 credible tracks, separating angular gain from noise in 1-2 triangles at a noisy table is unreliable, and the medical framing invites diagnosis questions.
- **Hanger (hanger-reflex headband):** the most surprising hook of the set, but a servo pad may not trigger the reflex (the research used pneumatic or rigid bands), it has only 5-6 spokes, and it reads as the haptic-wearable cliche.
- **Second Guess (surprisingly popular plus truth serum):** noisy at the 20-40 respondents a hackathon yields, so the live pick can come out wrong; it overlaps Halflife, and its Nessie, hardware and Grok spokes are thin.
- **Scout Fee (incentivized exploration):** lands in the local-discovery-app pattern (6 such apps lost at BRH 2025), proof of visit is a mock Nessie purchase, and the headline result comes only from simulation.
- **Unsayable (truth-masked decoding):** LLM-centric (the "LLM + twist" objection), repeats round 1's Fingerpath, and has the thinnest sponsor coverage.
- **Echo Mesh:** pitched in round 2 and not chosen; Safari's audio routing under getUserMedia on judges' iPhones is a likely demo-killer, and its discounted expected wins fall below all five finalists.
- **Corner Sight:** best Hardware story, but only 5-6 credible spokes, and a 0.1% brightness signal under flickering hall fluorescents is a demo-day gamble.
- **Bat Time:** depends on parts (webcam mics may be 16 kHz mono with AGC), hall noise can bury echoes, and it has the fewest spokes (about 5).
