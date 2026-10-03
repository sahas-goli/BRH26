import assert from "node:assert/strict";
import { test } from "node:test";
import {
  _resetHotpFailuresForTests,
  hotp,
  hotp4,
  HOTP_FAIL_LIMIT,
  isHotpRateLimited,
  parseHotpSecret,
  recordHotpFailure,
  verifyBadgeHotp,
  verifyHotpCode,
} from "./hotp";

// RFC 4226 Appendix D — ASCII secret "12345678901234567890"
const RFC_SECRET = Buffer.from("12345678901234567890", "ascii");
const RFC_6: [number, string][] = [
  [0, "755224"],
  [1, "287082"],
  [2, "359152"],
  [3, "969429"],
  [4, "338314"],
  [5, "254676"],
  [6, "287922"],
  [7, "162583"],
  [8, "399871"],
  [9, "520489"],
];

test("RFC 4226 Appendix D six-digit vectors", () => {
  for (const [counter, expected] of RFC_6) {
    assert.equal(hotp(RFC_SECRET, counter, 6), expected, `counter ${counter}`);
  }
});

test("four-digit badge codes are HOTP mod 10^4", () => {
  for (const [counter, six] of RFC_6) {
    assert.equal(hotp4(RFC_SECRET, counter), six.slice(-4));
  }
});

test("look-ahead window accepts last+1 .. last+window", () => {
  const secret = RFC_SECRET;
  // last=0 → try counters 1..10; counter 1 code (4-digit)
  const code1 = hotp4(secret, 1);
  const ok = verifyHotpCode({ secret, code: code1, lastCounter: 0, digits: 4 });
  assert.deepEqual(ok, { ok: true, counter: 1 });
  // after accepting 1, counter 1 is rejected; counter 2 works
  assert.equal(verifyHotpCode({ secret, code: code1, lastCounter: 1, digits: 4 }).ok, false);
  const code2 = hotp4(secret, 2);
  assert.deepEqual(verifyHotpCode({ secret, code: code2, lastCounter: 1, digits: 4 }), { ok: true, counter: 2 });
});

test("look-ahead rejects beyond window", () => {
  const secret = RFC_SECRET;
  const code11 = hotp4(secret, 11);
  assert.equal(verifyHotpCode({ secret, code: code11, lastCounter: 0, window: 10, digits: 4 }).ok, false);
});

test("rate limit allows 5 fails then blocks", () => {
  _resetHotpFailuresForTests();
  const bountyId = "b_rate1";
  const now = 1_000_000;
  for (let i = 0; i < HOTP_FAIL_LIMIT; i++) recordHotpFailure(bountyId, now);
  assert.equal(isHotpRateLimited(bountyId, now), true);
});

test("verifyBadgeHotp uses HOTP_SECRETS and persists counter via events", async () => {
  _resetHotpFailuresForTests();
  const previous = process.env.HOTP_SECRETS;
  process.env.HOTP_SECRETS = JSON.stringify({
    badge1: RFC_SECRET.toString("hex"),
  });
  const events: { detail: unknown }[] = [];
  const db = {
    async query<T extends Record<string, unknown>>() {
      return { rows: events as T[] };
    },
  };
  try {
    const code = hotp4(RFC_SECRET, 1);
    const first = await verifyBadgeHotp(db, { bountyId: "b_1", badgeId: "badge1", code });
    assert.deepEqual(first, { ok: true, counter: 1 });
    events.unshift({ detail: { badgeId: "badge1", hotpCounter: 1, introMessage: "hi" } });
    const replay = await verifyBadgeHotp(db, { bountyId: "b_1", badgeId: "badge1", code });
    assert.equal(replay.ok, false);
    const next = await verifyBadgeHotp(db, { bountyId: "b_1", badgeId: "badge1", code: hotp4(RFC_SECRET, 2) });
    assert.deepEqual(next, { ok: true, counter: 2 });
    assert.ok(parseHotpSecret(RFC_SECRET.toString("hex")).equals(RFC_SECRET));
  } finally {
    if (previous === undefined) delete process.env.HOTP_SECRETS;
    else process.env.HOTP_SECRETS = previous;
  }
});
