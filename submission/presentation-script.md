# Six Hops — table presentation script

About three and a half minutes, spoken out loud at the table. Site: [https://sash.select](https://sash.select). No login. Phones work.

Audrey does motivation and the payout. Hayden does the site, the personal links, and the devnet payout. Selina does Photon and the Tiger board. Sahas keeps the clock, the handoffs, the network backup, and the questions. He cues the phones in one beat. He walks whichever judge is in front of him to that track only. He does not give Audrey's motivation or the stack talk.

Have these open before you start:

- Laptop on [https://sash.select/live](https://sash.select/live). That board is the replay `r_0000` (764 nodes, depth through 8) plus the attack slider. A search started on the phone is a different bounty id.
- Two phones on the home page. One of them can open [sash.select/text](https://sash.select/text) when the Photon judge is up.
- One quiet tab for the payout that already landed: [Explorer, devnet, bounty b_gCijcO6z](https://explorer.solana.com/tx/29b8QgRSUcSdpmnwiLGKQXHkKLPEemcVPf5ygX8LvnmP9t9EDpmfd8qoxohCkPNw44baqwYafRDRZaMDfZZdDZsK?cluster=devnet). Half a SOL, two hops: 467 cents to the passer, 7,018 cents to the match, one transaction from that search's deposit wallet.

| Clock | Who | Job |
| --- | --- | --- |
| 0:00–0:12 | Sahas | Open and name the order |
| 0:12–1:40 | Audrey | Why the search exists, then how a deposit splits |
| 1:40–2:15 | Hayden | Site, personal links, claim, accept, devnet payout |
| 2:15–2:50 | Selina | Photon, registration, Tiger replay |
| 2:50–3:20 | Sahas | Cue the phone path |
| 3:20–3:40 | Sahas | Close, then questions |

## 0:00 — Sahas

“Three and a half minutes. Audrey on why, and on how the deposit splits. Hayden on the site and the payout. Selina on Photon and the replay. I will cue the phones. The laptop stays on the replay.”

## 0:12 — Audrey

“The person you need is usually two to four hops away, inside someone else's private contacts. Jon Kleinberg showed that local knowledge is enough to navigate a social network. A search engine never sees those trusted links. A message passed friend to friend usually dies, because forwarding takes effort and nothing makes it worth continuing.

Six Hops is a bounty for someone you cannot look up. You describe them with attributes only: a city, a field, a skill. A friend passes one personal link to someone closer. The person who matches decides to introduce themselves. We never take a copy of anyone's contacts. The poster never sees who forwarded.

The deposit is the whole reward. The poster takes none of it. Each person who passed the link gets one sixteenth of that deposit, rounded down. That share stays flat. The match gets the rest. A chain longer than eight pays nobody.

On a sixteen dollar deposit the shares are whole dollars. One hop, the match gets sixteen. Three hops, two passers get a dollar and the match gets fourteen. Six hops, five passers get a dollar and the match gets eleven. Eight hops, the match gets nine.

A fake extra hop does not raise the match's take. The same sixteen dollars is still the whole reward. The MIT split would pay that person fifty, seventy-five, eighty-seven and a half, and ninety-three and three quarters percent more for one through four fakes. Ours pays the same total as the honest chain.

Pass it to three friends each time, and six rounds ask one thousand ninety-two people, still for those same sixteen dollars. Someone who only sees the card expects about a cent and a half. Someone on the route that worked expects a dollar, or eleven if they are the match.”

## 1:40 — Sahas

“Hayden, the site.”

## 1:45 — Hayden

“The public site is sash.select. Next.js, on Vercel. No login. Each person gets a personal link under slash h. On that page they pass the search on, or they tap This is me and claim. They can paste their own Solana address. The poster opens their private page and taps Accept and pay.

That tap sends one devnet transaction. A search that started in Photon pays from that search's own deposit wallet. A search created on the website takes a dollar cap, pays sixty percent of that cap, and pays from the shared treasury.”

## 2:15 — Sahas

“Selina, Photon and the board.”

## 2:20 — Selina

“Photon is the iMessage agent. It runs on the laptop. Pro shared lines only accept registered numbers, so you register at sash.select/text, then text new search.

Photon asks who you are looking for, then how many hours. It sends the deposit address in its own message. You send devnet SOL and reply sent. It replies with your private page. Reply with a name and it sends that person's personal link.

Slash live is Tiger. This board is the replay r_0000: seven hundred sixty-four nodes, depth through eight. A phone search is a different bounty. The website still has a mock Nessie escrow path.”

## 2:50 — Sahas

“Phones. Text new search to Photon. Send one tenth of a SOL on devnet, then reply sent. Pass one personal link. The match taps This is me. The poster taps Accept and pay. The Explorer card is one transaction from that search's deposit wallet.”

Stop when the accept click lands, or when the quiet Explorer tab is the proof. Sahas takes the clock back.

## 3:20 — Sahas

“That is the product. One deposit, a personal link, the match taps in, and the poster accepts before anything is paid. Questions, or tell me which track you judge and I will walk you to it.”

### If the network fails

Say only the line that matches what broke.

“The room network dropped. I am moving the laptop and the phones to a hotspot.”

“Photon is quiet. Start a search on the website. The reward then comes from the shared treasury, and it pays sixty percent of the dollar cap.”

“sash.select will not load. The payout we already have is on this Explorer page: bounty b_gCijcO6z, two hops, four dollars and sixty-seven cents to the passer, seventy dollars and eighteen cents to the match, from half a SOL on devnet.”

“The fresh search stalled, and slash live is still up. This graph is the replay r_0000, seven hundred sixty-four nodes, depth through eight. The phone search is a separate bounty id.”

### If they ask

**Is this a pyramid?** “Nobody pays to join. One poster funds one deposit. The chain stops at eight hops.”

**Do you take their contacts?** “There is no contact graph. People route with what they already know, and the poster never sees the chain.”

**When does the money move?** “The poster reads the introduction and taps Accept and pay. Payment waits for that tap.”

Tracks that are not in the appendix stay off the table unless that judge asks. Then answer from the tick sheet in one sentence.

## Appendix — Sahas, one short paragraph per judge

**BigRed (navigation).** The product is the navigation. A search for someone you cannot look up moves one friend at a time, and each person uses only what they already know to choose the next link. Kleinberg's point is the core action: local knowledge is enough, and Six Hops never copies the social graph it travels through.

**Software.** Six Hops is a typed web product you can run from a Photon text or a website post, to a personal link, to This is me, to the poster's accept. Fan-out stops at three. Depth stops at eight. The payable budget is split in integer cents: each passer gets the budget divided by sixteen, rounded down, and the match gets the rest.

**Design.** The phone path is one obvious next tap: start a search, pass one personal link, or tap This is me. The board at slash live is the cascade, the branching-factor display, and the attack slider, laid out so a judge can see depth and the fake-hop comparison without a login.

**People's Choice.** Anyone at the table can open sash.select on their own phone, register at slash text, and hand one personal link to a friend. The whole loop is the share: no account, and the match decides to raise their hand.

**Solana.** Accept and pay sends one devnet transaction, with a pay memo. A Photon search pays from that search's deposit wallet. A website search pays sixty percent of its dollar cap from the shared treasury. Bounty b_gCijcO6z already paid a two-hop chain from half a SOL: 467 cents to the passer and 7,018 cents to the match. The transaction is [on Explorer](https://explorer.solana.com/tx/29b8QgRSUcSdpmnwiLGKQXHkKLPEemcVPf5ygX8LvnmP9t9EDpmfd8qoxohCkPNw44baqwYafRDRZaMDfZZdDZsK?cluster=devnet).

**Tiger Data.** Tiger holds one million replay event rows. On the proof search r_0000, the continuous aggregate answers the per-minute series in about a third of a millisecond, against about eighty-seven milliseconds for the raw scan of the same buckets. Slash live draws that cascade: 764 nodes, depth through 8.

**SpaceX, Built with Cursor.** The project was built entirely in Cursor, using agent mode and cloud agents. Sahas, Hayden, Audrey, and Selina used an agent-mode chat, and Hayden, Audrey, and Selina ran sandbox agents.

**Capital One Nessie.** The website still has a mock escrow path. On post the cap is recorded from checking into escrow. On confirm, holder shares and the Solana-rail treasury leg leave escrow, and the remainder returns to checking. On expiry, escrow refunds to checking. The money panel on slash live shows those balances. The poster takes no share.

**Photon.** Register at sash.select/text. A Pro shared line only accepts a registered number. Text new search. Photon asks for a description, then hours, then sends the deposit address as its own message. Reply sent after the SOL lands. It returns a private page. Reply with a name to get a personal link. A tapback or yes plus a first name also creates the next hop. If the search stalls, they get a nudge to pass it closer. After the poster accepts, they get a paid message with the Explorer link. Anyone not registered uses the copied link. The agent runs on the laptop.
