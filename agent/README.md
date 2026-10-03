# Six Hops Photon agent

Spectrum/iMessage agent for BigRed//Hacks (S1-01 echo → S1-05 flows).

## Run

```bash
cd agent
cp .env.example .env.local   # fill secrets
npm install
npm run check
npm start
```

Env:

| Variable | Purpose |
|---|---|
| `SPECTRUM_PROJECT_ID` / `SPECTRUM_PROJECT_SECRET` | Photon dashboard |
| `PHOTON_ENABLED=true` | Use iMessage provider (else terminal) |
| `INTERNAL_SECRET` | Auth for `POST /send` and controller tick |
| `PUBLIC_BASE_URL` | Web app origin for `/api/h`, `/api/forward`, tick |
| `AGENT_PORT` | Default `8787` |

Tunnel for Vercel: `cloudflared tunnel --url http://localhost:8787` → set `AGENT_URL`.

## Endpoints

- `GET /health`
- `POST /send` header `x-six-hops-secret`, body `{ handle, text }` or `{ handle, kind: "nudge"|"found"|"paid", cents?, explorerUrl? }`

## Flows (S1-05)

1. Inbound `/h/<token>` link → hint card (attributes only)
2. Tapback / yes / pass → ask for a name
3. Name → `POST /api/forward` → personal link only
4. "this is me" → claim URL
5. Every 30s → `POST /api/controller/tick` → deliver nudges
6. Privacy: no chain members, target, salts, or other handles in replies

## Tests

```bash
npx tsx --test src/privacy.test.ts
```

## Go/no-go

Live registered-phone forward + nudge + paid message requires Photon keys and a running web/`DATABASE_URL`. Without keys the agent still runs on the terminal provider and mock-queues `/send`.
