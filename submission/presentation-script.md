# Six Hops — table presentation script

About three and a half minutes, spoken out loud at the table. Site: [https://sash.select](https://sash.select). No login. Phones work.

Four people. Speaker 1 is motivation only. Speaker 2 is the technical core only. Speaker 3 runs the live demo and stays labeled Speaker 3 until Sahas fills in Hayden, Audrey, or Selina. Sahas keeps the clock, the handoffs, the network backup, and the questions. He walks a judge to that judge’s track. He does not give the motivation or the technical core.

Have these open before you start:

- Laptop on [https://sash.select/live](https://sash.select/live). That board is the replay `r_0000` (764 nodes, depth through 8) plus the attack slider. A search started on the phone is a different bounty id.
- Two phones on the home page.
- One quiet tab for the payout that already landed: [Explorer, devnet, bounty b_VuB6do20](https://explorer.solana.com/tx/4ktnrF8aAoVwj3KTTdUyMuLnxRTEFxGY8KYAst4DVMfXYtdvBJcz8Wn7fF754AdmxSqycvbbxpsrfjsaYtHakNTo?cluster=devnet). The target was paid $12. That is one hop, 60% of a $20 cap.

| Clock | Who | Job |
| --- | --- | --- |
| 0:00–0:12 | Sahas | Open and name the order |
| 0:12–0:55 | Speaker 1 | Why the search exists |
| 0:55–2:15 | Speaker 2 | How the sixteen dollars split |
| 2:15–3:35 | Speaker 3 | Post, pass one link, tap This is me, accept |
| 3:35–3:50 | Sahas | Close, then questions |

## 0:00 — Sahas

“Three and a half minutes. Speaker 1 on why, Speaker 2 on the split, Speaker 3 on the phones. The laptop is the replay. The phones start a new search.”

## 0:12 — Speaker 1 (motivation only)

“The person you need is usually two to four hops away, inside someone else’s private contacts. Jon Kleinberg showed that local knowledge is enough to navigate a social network. A search engine never sees those trusted links. A message passed friend to friend usually dies, because forwarding takes effort and nothing makes it worth continuing.

Six Hops is a bounty for someone you cannot look up. You describe them with attributes only: a city, a field, a skill. A friend passes one personal link to someone closer. The person who matches decides to introduce themselves. We never take a copy of anyone’s contacts. The poster never sees who forwarded. The money exists so that chain is worth finishing.”

## 0:55 — Sahas

“Speaker 2, the payable reward.”

## 1:00 — Speaker 2 (technicals only)

“The payable reward is sixty percent of the dollar cap. That amount is one fixed pot, and the poster takes none of it. On accept, the app wallet sends devnet SOL. Forwarding needs no pasted address. Change reward destination, then My Solana wallet, is there only if someone wants their own address.

Each passer gets that pot divided by sixteen, rounded down. The match gets the rest. A chain longer than eight pays nobody.

On sixteen dollars the shares are whole dollars. One hop, the match gets sixteen. Three hops, two passers get a dollar and the match gets fourteen. Six hops, five passers get a dollar and the match gets eleven. Eight hops, the match gets nine.

Pass it to three friends each time, and six rounds ask one thousand ninety-two people, still for those same sixteen dollars. Someone who only sees the card expects about a cent and a half. Someone on the route that worked expects a dollar, or eleven if they are the match.

An invented extra hop adds zero for the finder. MIT pays fifty, seventy-five, eighty-eight, and ninety-four percent more for one through four fakes.

Slash live is the replay r_0000: seven hundred sixty-four nodes, depth through eight, and the attack slider. The phone search is a new bounty. Bounty b_VuB6do20 already paid twelve dollars on devnet, one hop, sixty percent of a twenty-dollar cap.”

## 2:15 — Sahas

“Phones. Speaker 3. I have the second phone.”

## 2:20 — Speaker 3 (live demo)

Say the line, then do the tap. Sahas holds the second phone and taps only when Speaker 3 says so.

**Phone A, home.** “No login. Start a search.”

**Create form.** “Attributes only. I’ll leave the cap at twenty dollars, so the payable reward is twelve. Create search.”

**Create screen.** “Copy private details. That is the poster token, and it is saved on this screen. I need it when I accept.”

**Choose your first contacts.** “One person. I leave the reward on the demo wallet the app already has. Pass it on.”

**Personal link on screen.** “This is their link, the one that starts with slash h. Sahas, open it on the other phone.”

**Phone B.** “Tap This is me. One sentence on how you match. Opt in and send introduction.”

**Phone A, poster page.** “If the accept box is not here yet, refresh. The poster token is the one from the create screen; paste it if the box is empty. Accept and pay. The app wallet sends the devnet SOL.”

Stop talking when the accept click lands. Sahas takes the clock back.

## 3:35 — Sahas

“That is the product: one fixed pot, a personal link, the match taps in, and the poster accepts before anything is paid. Questions, or tell me which track you judge and I will walk you to it.”

### If the network fails

Say only the line that matches what broke.

“The room network dropped. I am moving the laptop and the phones to a hotspot.”

“sash.select will not load. The payout we already have is on this Explorer page: bounty b_VuB6do20, twelve dollars to the target, one hop, on devnet. I will leave the phones.”

“The fresh search stalled, and slash live is still up. This graph is the replay r_0000, seven hundred sixty-four nodes, depth through eight. The phone search is a separate bounty id. The poster token is still the one copied on the create screen.”

### If they ask

**Is this a pyramid?** “Nobody pays to join. One poster funds one fixed pot. The chain stops at eight hops.”

**Do you take their contacts?** “There is no contact graph. People route with what they already know, and the poster never sees the chain.”

**When does the money move?** “The poster reads the introduction and taps Accept and pay. Payment waits for that tap.”

Tracks that are not in the appendix stay off the table unless that judge asks. Then answer from the tick sheet in one sentence.

## Appendix — Sahas, one short paragraph per judge

**BigRed (navigation).** The product is the navigation. A search for someone you cannot look up moves one friend at a time, and each person uses only what they already know to choose the next link. Kleinberg’s point is the core action: local knowledge is enough, and Six Hops never copies the social graph it travels through.

**Software.** Six Hops is a typed web product you can run from post, to a personal link, to This is me, to the poster’s accept. Fan-out stops at three. Depth stops at eight. The payable pot is split in integer cents: each passer gets the budget divided by sixteen, rounded down, and the match gets the rest. That is the split the running app uses.

**Design.** The phone path is one obvious next tap: start a search, pass one personal link, or tap This is me. The board at slash live is the cascade, the branching-factor display, and the attack slider, laid out so a judge can see depth and the fake-hop comparison without a login.

**People’s Choice.** Anyone at the table can open sash.select on their own phone, start a search, and hand one personal link to a friend. The whole loop is the share: no account, and the match decides to raise their hand.

**Solana.** Accept sends devnet SOL from the app wallet, with a pay memo, and the poster never connects a wallet. Bounty b_VuB6do20 already paid the target $12, one hop, sixty percent of a $20 cap. The transaction is [on Explorer](https://explorer.solana.com/tx/4ktnrF8aAoVwj3KTTdUyMuLnxRTEFxGY8KYAst4DVMfXYtdvBJcz8Wn7fF754AdmxSqycvbbxpsrfjsaYtHakNTo?cluster=devnet).

**Tiger Data.** Tiger holds one million replay event rows. On the proof search r_0000, the continuous aggregate answers the per-minute series in about a third of a millisecond, against about eighty-seven milliseconds for the raw scan of the same buckets. Slash live draws that cascade: 764 nodes, depth through 8.

**SpaceX, Built with Cursor.** The project was built entirely in Cursor, using agent mode and cloud agents. Sahas, Hayden, Audrey, and Selina used an agent-mode chat, and Hayden, Audrey, and Selina ran sandbox agents.

**Capital One Nessie.** On post, the cap moves from checking into escrow. On confirm, holder shares and the Solana-rail treasury leg leave escrow, and the remainder returns to checking. On expiry, escrow refunds to checking. The money panel on slash live shows those balances.

**Photon.** A registered holder gets a one-to-one iMessage with their personal link and hint. Yes, plus a first name, creates the next hop. If the search stalls, they get a nudge to pass it to someone closer. After the poster confirms, they get a paid message with the Explorer link. That link opens the website.
