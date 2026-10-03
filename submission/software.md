# Software track

## Short description

Six Hops is a friend-to-friend bounty system with a Babaioff-style split, fan-out limits, and a controller that widens hints when branching stalls—under strict shared contracts (`web/lib/types.ts`, `db/schema.sql`).

## Why Software specifically

1. Non-trivial incentive design with a brute-force attack comparison test (`web/lib/split.test.ts`).
2. End-to-end typed contracts enforced across web, agent, and DB.
3. Mockable integration flags so the MVP path stays green without sponsor keys.
4. Clear ownership / WORKFLOW so four agents can ship in parallel.

## Where in the code

- `web/lib/split.ts`, `web/lib/controller.ts`, `web/lib/bounty.ts`, `web/lib/payout.ts`
- `npm --prefix web run check` / `smoke:mock` / `smoke:http`

## Demo look-at

Show `split.test.ts` output and the attack slider on `/live`; walk post→forward→claim on a phone.
