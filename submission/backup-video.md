# Backup demo video script (AL-03)

2-minute screen recording if the live demo fails (PLAN.md §12 fallback).  
**Done when:** video link posted in team chat — this file is the shoot script only.

## Setup (before record)

```bash
npm --prefix web run smoke:http          # API path green (optional, off-camera)
npm --prefix web run seed:demo && npm --prefix web run dev
# seed:demo sets DATABASE_URL=pglite:.data/demo + FEATURED_BOUNTY in web/.env.local
```

- Browser: 1280×720 or 1920×1080; hide bookmarks; zoom so `/live` fills the frame
- Optional second window: terminal with `SMOKE_HTTP_OK` / `SEED_DEMO_OK` for 2 s
- Mic: read lines from `submission/pitch-2min.md` (or VO later)

## Timeline (~2:00)

| Time | On screen | Say / do |
|---|---|---|
| 0:00–0:20 | Title slide or `/` | Hook: 2–4 hops, Kleinberg, “we made the chain pay, correctly.” |
| 0:20–0:50 | **`/live`** after seed | Cascade + depths; point at **b** / controller step 2 |
| 0:50–1:10 | **`/post`** → create bounty | Fill hint + cap; submit; copy poster `/h/…` |
| 1:10–1:25 | **`/h/[token]`** | Show wanted card + depth; forward 1 label (or cut to pre-seeded edge) |
| 1:25–1:40 | **`/claim/[token]`** | Intro; found, then poster confirm; payout / Explorer (mock ok) |
| 1:40–2:00 | **`/live` attack slider** | k=1..4: MIT gains vs ours **+0%**; freeze on k=2 |

**Cuts if short:** skip fresh `/post` and stay on seeded `/live` + hop tab + claim + attack (still ~2 min with VO).

## Clip checklist

- [ ] `clip-live.mp4` — `/live` cascade + branching factor (~20–30 s)
- [ ] `clip-post.mp4` — `/post` create (~15 s) *or skip if using seed only*
- [ ] `clip-hop.mp4` — `/h/…` forward UI (~15 s)
- [ ] `clip-claim.mp4` — claim success + explorer/mock sig (~15 s)
- [ ] `clip-attack.mp4` — attack slider k=0→4 (~20 s)
- [ ] `clip-smoke.mp4` — optional 3 s terminal `smoke:http` / `seed:demo` OK
- [ ] Assemble → **≤ 2:00** final; upload Drive/YouTube unlisted
- [ ] Post link in team chat; add URL here when done: `_TBD_`

## Honesty labels (burn into end card or VO)

- Local PGlite demo / mock payout unless Tiger + devnet shown
- Photon iMessage and live Nessie omitted unless keys + VERIFY pass
- “Backup recording — same path as stage demo”
