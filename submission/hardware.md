# Hardware track

## Short description

Venue target badges (Arduino + TM1637 + button, EEPROM HOTP counter, no clock) plus a physical branching-factor gauge: `hardware/bridge.py` polls `GET /api/stats` and writes `B x.xx` over serial so a servo needle tracks live `b`.

## Why Hardware specifically

1. **Pre-registered targets without a phone clock.** HOTP (RFC 4226) + EEPROM survives power cycles; 4 digits fit the Grove display.
2. **Branching factor you can feel.** Red zone below b = 2 matches the controller and `/live` gauge.
3. **Honest fallback.** If VERIFY F fails: printed one-time codes + gauge still count as the hardware piece (PLAN §7.8).

## Where in the code

| Piece | Path |
|---|---|
| Server HOTP + claim window | `web/lib/hotp.ts`, `web/lib/hotp.test.ts` (RFC vectors + look-ahead) |
| Badge sketch | `hardware/badge/badge.ino`, `hardware/badge/README.md` |
| Secrets template (never commit real) | `hardware/secrets.h.example` → gitignored `hardware/secrets.h` |
| Gauge bridge | `hardware/bridge.py` → `GET /api/stats` → serial `B 1.73\n` |
| Ops / parts | `hardware/INVENTORY.md`, `hardware/game.md`, `hardware/README.md` |

**Software side:** HOTP verify is on main and covered by tests. **Physical side:** flash, power-cycle VERIFY F, servo calibration, and volunteer targets remain open (HW-01 / HW-02 / HW-03).

## What judges see

1. Target presses badge → 4-digit code → types it on `/claim/[token]` with intro → paid chain on Explorer (or mock).
2. Table gauge needle moves with `/live` b as the overnight game runs.
3. If badges unavailable: one-time code cards + gauge demo.
