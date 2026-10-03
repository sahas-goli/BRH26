# Badge firmware

1. Install **TM1637Display** and a **SHA1/HMAC** library (Cryptosuite `sha1.h`) in Arduino IDE.
2. `cp ../secrets.h.example ../secrets.h` and set a unique 20-byte secret (never commit `secrets.h`).
3. Put the same secret hex in `HOTP_SECRETS` for the web claim path (`web/lib/hotp.ts`).
4. Flash `badge.ino` to the Uno; press the Grove button — 4 digits should match `hotp4(secret, counter)` after power cycle.

Pins default to Grove base D2/D3 (display) and D4 (button); adjust in the sketch if needed.
