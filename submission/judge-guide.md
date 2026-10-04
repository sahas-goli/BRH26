# Six Hops — judge guide

Three of you will run a real search from start to finish. Judge A posts it and pays for it. Judge B passes it along. Judge C is the person it is looking for. Everyone who helped gets paid in devnet SOL, a free test currency on Solana.

It takes about ten minutes. Use your own phones. The site is **[sash.select](https://sash.select)**.

| Who | Does what | Uses this wallet address |
| --- | --- | --- |
| Judge A | Texts Photon to post the search, funds it, accepts the match | Sends SOL from the wallet app on the phone we gave you |
| Judge B | Passes the search on | `G3brZuf7Xkgg21WZ6v5r5nQPy2AEW6o53wHS18oU4NLB` |
| Judge C | Says "this is me" and gets paid | `ESFQ7UT8P3iemp6YxRccP7wc63WRTbpNd26WpXhQrTDq` |

Before you start, open each address on [Solana Explorer](https://explorer.solana.com/?cluster=devnet) and note its balance. You will see it go up at the end.

- Judge B: [explorer.solana.com/address/G3brZuf7…](https://explorer.solana.com/address/G3brZuf7Xkgg21WZ6v5r5nQPy2AEW6o53wHS18oU4NLB?cluster=devnet)
- Judge C: [explorer.solana.com/address/ESFQ7UT8…](https://explorer.solana.com/address/ESFQ7UT8P3iemp6YxRccP7wc63WRTbpNd26WpXhQrTDq?cluster=devnet)

---

## Judge A — post and fund the search

### 1. Get your Photon line

1. On your iPhone, open **[sash.select/text](https://sash.select/text)**.
2. Enter the phone number your iMessage uses and tap **Get my Photon line**.
3. Tap **Open Messages**. A text to your Photon line opens with `new search` already typed. Send it.

### 2. Describe who you are looking for

Photon replies: *"Who are you looking for? Describe them in one message, without names or addresses."*

Describe Judge C in one short sentence, using things about them you know. For example:

> Someone at BigRed//Hacks who builds hardware and has judged a hackathon before

Keep it under about 80 characters. That sentence becomes the hint card everyone else sees.

### 3. Set how long it runs

Photon asks how many hours. Reply `2`.

### 4. Fund the reward

Photon replies with a wallet address that belongs only to this search, and a minimum of 0.068 SOL.

1. Open the wallet app on the phone we gave you. Check that it is on **Devnet** (in Phantom: Settings → Developer Settings → Testnet Mode → Solana Devnet).
2. Tap **Send**, paste the address from Photon, enter **0.1** SOL, and send it.
3. Back in Messages, reply `sent`.

If Photon says *"Nothing has landed yet"*, wait ten seconds and reply `sent` again.

Photon then replies: *"Your $14.85 search is live."* Everything you sent becomes the reward, so nothing is held back. Dollar amounts use a fixed $150 per SOL.

The same message has **your private page** link. Keep it to yourself. It is how you accept the match later.

### 5. Pass it to Judge B

Reply to Photon with `Judge B`. Photon sends back a personal link made for Judge B. Text or AirDrop that link to Judge B.

Then wait. Judge B passes it on, and Judge C claims it.

### 6. Accept and pay

1. When Judge C says they have claimed it, open **your private page** from Photon's message. Always open it from that message, because the link carries your accept code.
2. Refresh if needed. You will see **Someone claims to be the match** and Judge C's introduction.
3. Tap **Accept and pay**.

A green **Found and paid** card appears. Tap **View the payout on Solana Explorer** to see one transaction, sent from your search's wallet, paying Judge B and Judge C.

---

## Judge B — pass it on

1. Open the personal link Judge A sent you. You will see the reward and the hint card under **Who do you know?**
2. You are not the person described, so do not tap **This is me**.
3. In **Recipient 1 label**, type `Judge C`. Leave the iMessage field empty.
4. Under **Your reward destination**, tap **Use my own Solana wallet**. Paste this address into **Solana public address**:

   `G3brZuf7Xkgg21WZ6v5r5nQPy2AEW6o53wHS18oU4NLB`

5. Tap **Pass it on**.
6. Under **Your personal links**, tap **Copy link** and text or AirDrop it to Judge C.

You are paid when Judge A accepts. Your share stays the same however long the chain gets.

---

## Judge C — say "this is me"

1. Open the personal link Judge B sent you.
2. Read the hint card. It describes you, so scroll down and tap **This is me**.
3. In **A short introduction**, write one sentence on how you match. Judge A reads this before paying.
4. In **Your Solana wallet address (optional)**, paste:

   `ESFQ7UT8P3iemp6YxRccP7wc63WRTbpNd26WpXhQrTDq`

5. Tap **Opt in and send introduction**. You will see **Your introduction is sent.**
6. Tell Judge A you have claimed it.

---

## What gets paid

On 0.1 SOL there is $14.85 to share between two people:

| Person | Share | About |
| --- | --- | --- |
| Judge B, who passed it on | $0.92 | 0.0061 SOL |
| Judge C, the match | $13.93 | 0.0929 SOL |
| Judge A, who posted | Nothing; their 0.1 SOL funded the reward | |

Each person who passes the search on earns one sixteenth of the reward, and the match gets the rest. Inventing extra hops does not raise the match's take, and a chain longer than eight hops pays nobody.

Open the two Explorer links from the top again. Both balances went up by about those amounts.

---

## If something goes wrong

| What you see | Do this |
| --- | --- |
| Photon never replies | The Photon agent may be offline. Judge A can post on the website instead: [sash.select](https://sash.select) → **Start a search**, then **Choose your first contacts** to make Judge B's link. Everything after that is the same, and the reward comes from the demo treasury instead of your deposit. |
| "Couldn't assign a line" on sash.select/text | Try again in a minute, or use the website fallback above. |
| Your text to the line bounces | Your iMessage may use an email or a different number. Text [debug.photon.codes](https://debug.photon.codes) to see which one, then enter that on sash.select/text. |
| "Nothing has landed yet" after sending SOL | Devnet can take a few seconds. Check the wallet app is on Devnet, then reply `sent` again. |
| Judge A's page has no Accept button | Refresh. Make sure Judge C finished step 5 and saw **Your introduction is sent.** |
| The accept code box is empty | Open your private page again from Photon's message, not from history. |
| "That Solana address is not valid" | Copy the address again from this guide. It has no spaces. |
