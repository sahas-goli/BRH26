# Hardware track

## Short description

HOTP target badges (EEPROM counter, 4-digit TM1637, no clock) plus a physical branching-factor gauge driven by `hardware/bridge.py` polling `/api/stats`.

## Why Hardware specifically

1. Badge code proves the pre-registered venue target without a phone clock.
2. Gauge makes Kleinberg-style branching tangible in the room.
3. Power-cycle survival is a real constraint we design for (EEPROM counter).

## Where in the code

- `web/lib/hotp.ts` (RFC vectors + look-ahead); `hardware/bridge.py`; `hardware/INVENTORY.md`
- Firmware under `hardware/badge/` (forthcoming)

## Demo look-at

Target presses badge, types code on `/claim`; needle tracks `b` on the table.
