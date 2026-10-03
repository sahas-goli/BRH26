# HW-01 — Parts inventory (go/no-go F)

Fill this at the MLH hardware table. **Done when:** Test F result posted in team chat.

## Grove / badge kit (need ≥ 2 of each display+button)

| Item | Needed | On hand | Notes |
|---|---|---|---|
| Arduino Uno (or compatible) | 2–3 | | |
| Grove base shield | 2–3 | | |
| Grove 4-digit display (TM1637) | ≥ 2 | | |
| Grove button | ≥ 2 | | |
| USB power bank (≥ 30 min runtime) | 2–3 | | |
| USB cables | 2–3 | | |
| 3D-printed lanyard case | 2–3 | | print started? Y/N |

## Gauge kit

| Item | Needed | On hand | Notes |
|---|---|---|---|
| Servo (needle) | 1 | | |
| Printed dial (0–3, red below 2) | 1 | | |
| Red / amber / green LEDs | 1 set | | |
| Laptop serial USB for `bridge.py` | 1 | | |

## Go/no-go F checklist

- [ ] Inventory counts above filled
- [ ] One Uno flashed with HOTP sketch; button shows 4-digit code
- [ ] Code verifies via `web/lib/hotp.ts` (`HOTP_SECRETS` JSON) after **power cycle**
- [ ] Power bank runs ≥ 30 min on the bench
- [ ] Badge case print started (or fallback: printed one-time code cards)

**Fallback if F fails:** printed one-time codes; gauge becomes the hardware piece (PLAN §7.8).

## Result (post in chat)

```
GO/NOGO F: PASS|FAIL
displays=  buttons=  power_cycle=Y|N  print=started|fallback
```
