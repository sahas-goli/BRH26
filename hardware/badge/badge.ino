/**
 * Six Hops venue HOTP badge — PLAN.md §7.8
 *
 * Hardware: Arduino Uno + Grove base + Grove TM1637 4-digit + Grove button.
 * Press → EEPROM counter++ → display HOTP(secret, counter) mod 10^4 (RFC 4226).
 * No RTC; counter survives power cycle in EEPROM.
 *
 * Libraries (Library Manager — VERIFY F):
 *   - TM1637Display (Avishay Orpaz)
 *   - Cryptosuite / "SHA1" providing Sha1.initHmac / resultHmac
 *
 * Secrets: copy ../secrets.h.example to ../secrets.h (gitignored), then flash.
 * Mirror the same secret hex in web HOTP_SECRETS for claim verification.
 */

#include <EEPROM.h>
#include <TM1637Display.h>
#include <sha1.h>
#include "../secrets.h"

// Grove defaults on base shield — change if your wiring differs.
static const uint8_t PIN_CLK = 2;   // TM1637 CLK
static const uint8_t PIN_DIO = 3;   // TM1637 DIO
static const uint8_t PIN_BTN = 4;   // Grove button

static const uint8_t BTN_ACTIVE = HIGH;
static const int EEPROM_ADDR_COUNTER = 0; // uint32_t

TM1637Display display(PIN_CLK, PIN_DIO);

static uint32_t readCounter() {
  uint32_t c = 0;
  EEPROM.get(EEPROM_ADDR_COUNTER, c);
  if (c == 0xFFFFFFFFu) c = 0;
  return c;
}

static void writeCounter(uint32_t c) {
  EEPROM.put(EEPROM_ADDR_COUNTER, c);
}

/** RFC 4226 HOTP truncated integer (before mod 10^d). */
static uint32_t hotpBin(const uint8_t *secret, uint8_t secretLen, uint32_t counter) {
  uint8_t msg[8];
  uint32_t c = counter;
  for (int i = 7; i >= 0; --i) {
    msg[i] = (uint8_t)(c & 0xffu);
    c >>= 8;
  }

  Sha1.initHmac(const_cast<uint8_t *>(secret), secretLen);
  for (uint8_t i = 0; i < 8; i++) Sha1.write(msg[i]);
  uint8_t *hash = Sha1.resultHmac();

  uint8_t offset = hash[19] & 0x0f;
  return ((uint32_t)(hash[offset] & 0x7f) << 24)
       | ((uint32_t)(hash[offset + 1] & 0xff) << 16)
       | ((uint32_t)(hash[offset + 2] & 0xff) << 8)
       | ((uint32_t)(hash[offset + 3] & 0xff));
}

static void showCode(uint32_t code4) {
  uint8_t data[4];
  data[0] = display.encodeDigit((code4 / 1000) % 10);
  data[1] = display.encodeDigit((code4 / 100) % 10);
  data[2] = display.encodeDigit((code4 / 10) % 10);
  data[3] = display.encodeDigit(code4 % 10);
  display.setSegments(data);
}

void setup() {
  pinMode(PIN_BTN, INPUT);
  display.setBrightness(5);
  uint8_t dash[] = { SEG_G, SEG_G, SEG_G, SEG_G };
  display.setSegments(dash);
}

void loop() {
  static bool armed = true;
  bool pressed = digitalRead(PIN_BTN) == BTN_ACTIVE;
  if (pressed && armed) {
    delay(40);
    if (digitalRead(PIN_BTN) == BTN_ACTIVE) {
      uint32_t next = readCounter() + 1;
      writeCounter(next);
      uint32_t code4 = hotpBin(HOTP_SECRET, HOTP_SECRET_LEN, next) % 10000UL;
      showCode(code4);
      armed = false;
    }
  }
  if (!pressed) armed = true;
}
