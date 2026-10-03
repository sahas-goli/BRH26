# MLH GoDaddy Registry track

## Short description

Production hostname **milgram.study** (Milgram 1967 small-world study) via the MLH GoDaddy Registry hackathon offer, DNS pointed at Vercel, with `PUBLIC_BASE_URL` set so every personal link and OG preview shares one branded origin.

## Why GoDaddy Registry specifically

1. **The URL is the thesis.** Small-world navigation is the product; the domain name is the academic callback.
2. **Preview consistency.** iMessage/SMS and social crawlers need a stable HTTPS origin for `og:image` and hop links.
3. **MLH prize path.** Registry offer is the intended claim route (fallback: any `sixhops.*` the offer allows).

## Where in the code

| Piece | Path |
|---|---|
| Env contract | `.env.example` → `PUBLIC_BASE_URL` |
| Agent / link builders | `agent/src/web.ts`, Photon flows (absolute URLs) |
| Task + human steps | `tasks/S3-07.md` |
| Spec | PLAN.md §7.7 |

**Status:** Domain claim and Vercel DNS are **human / MLH-table** work. Code already consumes `PUBLIC_BASE_URL`; local/LAN demos use `http://<lan-ip>:3000` (README).

## What judges see

Open `https://milgram.study/post` (or the approved alternate) on stage once DNS + SSL land. Until then: Vercel preview URL or phone LAN — same app, less branded origin.
