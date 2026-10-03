# Hardware

| Path | Purpose |
|---|---|
| [INVENTORY.md](INVENTORY.md) | HW-01 parts + go/no-go F |
| [game.md](game.md) | HW-03 organizer approval + volunteer targets |
| [bridge.py](bridge.py) | HW-05 poll `/api/stats` → serial `B x.xx` |
| [badge/](badge/) | Uno HOTP sketch (TM1637 + button + EEPROM) |
| [secrets.h.example](secrets.h.example) | template; real `secrets.h` is gitignored |

## Bridge smoke (no Arduino)

With `next dev` + PGlite and a known bounty id:

```bash
# terminal A
npm --prefix web run dev

# terminal B — after posting a bounty, pass its id:
python hardware/bridge.py --base http://localhost:3000 --bounty b_XXXXXXXX --mock-serial --once
```

Expect a line like `B 0.00` or `B 1.73`. Firmware maps that to servo angle (`ANGLE_MIN` / `ANGLE_MAX`).
