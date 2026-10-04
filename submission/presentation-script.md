# Six Hops — table presentation script

**2:00 without judges.** Spoken out loud at the table when the judges do not do the demo. The judge walk-along stays after the close and is not on this clock. Site: [https://sash.select](https://sash.select). No login. Phones work.

Audrey does not speak. Sahas opens, says why the search exists, says how a deposit splits, and closes. He walks a track only if that judge asks. Hayden does the site and one devnet payout. Selina does Photon and /live.

Have these open before you start:

- Laptop on [https://sash.select/live](https://sash.select/live). That board is the replay `r_0000` (764 nodes, depth through 8) plus the attack slider. A search started on the phone is a different bounty id. Leave the laptop there for the whole talk.
- Two phones on the home page, for the walk-along after the two minutes. One of them can open [sash.select/text](https://sash.select/text) when the Photon judge is up.
- One quiet tab for the payout that already landed: [Explorer, devnet, bounty b_gCijcO6z](https://explorer.solana.com/tx/29b8QgRSUcSdpmnwiLGKQXHkKLPEemcVPf5ygX8LvnmP9t9EDpmfd8qoxohCkPNw44baqwYafRDRZaMDfZZdDZsK?cluster=devnet). Half a SOL, two hops: 467 cents to the passer, 7,018 cents to the match, one transaction from that search's deposit wallet. Do not show it unless the fresh payout is slow.

| Clock | Who | Job |
| --- | --- | --- |
| 0:00–1:10 | Sahas | Open, why, deposit split |
| 1:10–1:35 | Hayden | Site, personal link, accept, one devnet transaction |
| 1:35–1:55 | Selina | Photon text and the Tiger replay on /live |
| 1:55–2:00 | Sahas | Close |

No judge taps inside this clock.

## 0:00 — Sahas

“Two minutes. Why this exists, and how a deposit splits. Hayden has the site and one payout. Selina has Photon and the replay.”

## 0:10 — Sahas

“The person you need is usually two to four hops away, inside someone else's contacts. A search engine never sees those links. A message passed friend to friend usually dies.

Six Hops is a bounty for someone you cannot look up. You describe them with a city, a field, a skill. A friend passes one personal link. The match decides to introduce themselves. We never copy anyone's contacts.”

## 0:40 — Sahas

“The deposit is the whole reward. The poster takes none. Each passer gets one sixteenth, rounded down. The match gets the rest. Longer than eight pays nobody.

On sixteen dollars, each passer gets one dollar. One hop, the match gets sixteen. Three hops, the match gets fourteen. Eight hops, the match gets nine. A fake hop does not raise the match. It is still sixteen dollars.”

## 1:10 — Hayden

“The public site is sash.select. No login. Each person gets a personal link under slash h. On that page they pass the search on, or they tap This is me and claim. They can paste a Solana address. The poster opens their page and taps Accept and pay. That tap sends one devnet transaction.”

## 1:35 — Selina

“Photon is text on the laptop. Register at sash.select/text, then text new search. It sends the deposit address in its own message. Slash live is Tiger. This board is the replay r_0000: seven hundred sixty-four people, depth eight.”

## 1:55 — Sahas

“That is the product. The poster accepts before anything is paid.”

If judges are walking along, continue with the judge steps and do not count that toward the 2 minutes.

## Judge steps, after the clock

“Phones. Text new search to Photon. Send one tenth of a SOL on devnet, then reply sent. Pass one personal link. The match taps This is me. The poster taps Accept and pay. The Explorer card is one transaction from that search's deposit wallet.”

Stop when the accept click lands, or when the quiet Explorer tab is the proof. This walk is not part of the two minutes.

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
