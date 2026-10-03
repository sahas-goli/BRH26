# Six Hops visual direction

## Wanted card and link preview

Make every forwarded link feel like a private mission brief, not a public missing-person poster. The card should be a tall, phone-first panel with a warm paper field, a narrow black frame, and a small safety-orange **SIX HOPS** mark at the top. Use one large line of plain language such as **FIND SOMEONE WHO…**, followed by three to six attribute chips: city, field, skill, organization type, language, or experience. Never place a name, face, street address, contact detail, or a supposed likeness on the card.

The main visual is a deliberately abstract route diagram: a small orange origin dot, three or fewer branching charcoal lines, and one unlabelled lime destination ring. It suggests that this person is reachable through friends without pretending the app knows who they are. Keep the bounty amount and deadline as compact metadata in the footer; the human action should stay dominant: **Pass it to someone closer**.

For the generated Open Graph preview, crop to a 1200×630 landscape version of the same system. Left: the route diagram and the large attribute-led headline. Right: two or three high-value attribute chips, the reward, and `SIX HOPS · FRIEND-TO-FRIEND SEARCH`. It must still read at iMessage-preview size, so use one headline, one reward, and no explanatory paragraph. The static fallback should use the identical layout and wording when image generation is off.

### Suggested hierarchy

```text
┌──────────────────────────────────────────────┐
│ SIX HOPS                         OPEN SEARCH │
│                                              │
│ FIND SOMEONE WHO…                            │
│ has worked on launch operations              │
│                                              │
│     ●────┬────○  local knowledge travels     │
│          └────○  through friends             │
│                                              │
│ [ITHACA, NY] [AEROSPACE] [QFN SOLDERING]     │
│                                              │
│ $60 current reward · closes tonight          │
│ PASS IT TO SOMEONE CLOSER  →                 │
└──────────────────────────────────────────────┘
```

## `/live` on a projector

Treat `/live` as the control room for one search. The cascade is the hero: it should occupy the left two-thirds of a 16:9 projector view, with large nodes, restrained labels, and depth encoded by a single readable progression—orange origin → warm yellow relays → lime claimed/paid target. Show only the winning chain’s details after payment; inactive branches remain anonymous marks.

Put the branching-factor dial in the upper-right, large enough to read from the back of a room. Its threshold is the story: use lime at and above **2.0**, amber when approaching it, and red below it. Directly beneath it, show the controller’s next action in human language: `healthy`, `nudge`, `widen hint`, or `raise reward`.

Keep the attack slider in a wide lower-right panel. It needs one clear sentence before the controls: **Adding fake recruiters does not increase the finder’s payout.** As `k` changes, show paired bars for **Six Hops: +0%** and **MIT rule: +N%**, plus the invariant poster total. Avoid making the comparison look like a chart exercise; the visible conclusion is that the mechanism rewards routing, not padding a chain.

On a projector, defer secondary evidence—minute series, replay scrubber, escrow panel, benchmark text, and memo details—to smaller panels below the fold or to a presenter click. The first five seconds must answer: where is the search, is it spreading, and why is its payout rule fair?

### Presenter order

1. Point to the cascade: each person chose up to three people they believed were closer.
2. Point to the dial: the controller acts before branching falls below two.
3. Move the attack slider once: fake hops cannot grow the finder’s reward.
4. Open the payout proof only after the target opts in and the poster confirms.
