import assert from "node:assert/strict";
import { test } from "node:test";
import { attackComparison, depthCents, splitCents } from "./split";

const BUDGETS = [1000, 1001, 1337, 99999, 1600, 1005, 7485];
const MIT_GAINS: Record<number, number> = { 1: 50, 2: 75, 3: 87.5, 4: 93.75 };

function shares(h: number, B: number): number[] {
  const split = splitCents(h, B);
  assert.ok(split);
  return Array.from({ length: h }, (_, index) => depthCents(split, index + 1, h));
}

test("splitCents returns null outside 1..8", () => {
  for (const B of BUDGETS) {
    assert.equal(splitCents(0, B), null);
    assert.equal(splitCents(9, B), null);
    assert.equal(splitCents(-1, B), null);
    assert.equal(splitCents(1.5, B), null);
  }
});

test("shares sum to the budget and the match floor does not shrink", () => {
  for (const B of BUDGETS) {
    const floor = Math.floor(B / 16);
    const matchFloor = B - 7 * floor;
    for (let h = 1; h <= 8; h++) {
      const split = splitCents(h, B);
      assert.ok(split);
      assert.equal(split.earlyPasser, floor);
      assert.equal(shares(h, B).reduce((sum, cents) => sum + cents, 0), B);
      if (h === 1) {
        assert.equal(split.match, B);
        assert.equal(split.lastPasser, 0);
      } else {
        assert.equal(split.match, matchFloor);
        assert.equal(split.lastPasser, B - matchFloor - (h - 2) * floor);
      }
    }
  }
});

test("$16 reward pays Riley, Sam, and Alex as published", () => {
  const B = 1600;
  assert.deepEqual(shares(1, B), [1600]);
  assert.deepEqual(shares(2, B), [700, 900]);
  assert.deepEqual(shares(3, B), [100, 600, 900]);
  assert.deepEqual(shares(8, B), [100, 100, 100, 100, 100, 100, 100, 900]);
});

test("minimum Photon deposit and half a SOL pay the reserved match floor", () => {
  assert.deepEqual(shares(2, 1005), [434, 571]);
  assert.deepEqual(shares(3, 1005), [62, 372, 571]);
  assert.deepEqual(shares(2, 7485), [3269, 4216]);
  assert.deepEqual(shares(3, 7485), [467, 2802, 4216]);
});

test("a last passer who adds one controlled hop collects the same total", () => {
  for (const B of BUDGETS) {
    for (let h = 2; h <= 7; h++) {
      const before = splitCents(h, B);
      const after = splitCents(h + 1, B);
      assert.ok(before);
      assert.ok(after);
      assert.equal(after.earlyPasser + after.lastPasser, before.lastPasser);
    }
  }
});

test("an earlier passer who adds one controlled hop gains one floor, taken from the last passer", () => {
  for (const B of BUDGETS) {
    const floor = Math.floor(B / 16);
    for (let h = 3; h <= 7; h++) {
      const before = splitCents(h, B);
      const after = splitCents(h + 1, B);
      assert.ok(before);
      assert.ok(after);
      assert.equal(2 * after.earlyPasser, before.earlyPasser + floor);
      assert.equal(before.lastPasser - after.lastPasser, floor);
      assert.equal(after.match, before.match);
    }
  }
});

test("a match who adds one controlled hop keeps the match payout and collects the new last-passer share", () => {
  for (const B of BUDGETS) {
    for (let h = 2; h <= 7; h++) {
      const before = splitCents(h, B);
      const after = splitCents(h + 1, B);
      assert.ok(before);
      assert.ok(after);
      assert.equal(after.match, before.match);
      assert.equal(after.lastPasser + after.match - before.match, after.lastPasser);
    }
  }
});

test("attack comparison credits the match for controlled hops and still quotes MIT", () => {
  for (const B of BUDGETS) {
    for (let h = 1; h <= 8; h++) {
      const honest = splitCents(h, B);
      assert.ok(honest);
      for (let k = 0; k <= 8 - h; k++) {
        const cmp = attackComparison(h, k, B);
        assert.ok(cmp);
        assert.equal(cmp.ours.honestFinder, honest.match);
        assert.equal(cmp.ours.posterPays, B);
        if (k === 0) {
          assert.equal(cmp.ours.withFakes, honest.match);
          assert.equal(cmp.ours.gainPct, 0);
          continue;
        }
        const attacked = splitCents(h + k, B);
        assert.ok(attacked);
        const controlled = (k - 1) * attacked.earlyPasser + attacked.lastPasser + attacked.match;
        assert.equal(cmp.ours.withFakes, controlled);
        if (h >= 2) assert.equal(attacked.match, honest.match);
      }
      for (let k = 1; k <= 4 && k <= 8 - h; k++) {
        const cmp = attackComparison(h, k, B);
        assert.ok(cmp);
        assert.equal(cmp.mit.gainPct, MIT_GAINS[k]);
      }
    }
  }
});

test("chains longer than 8 pay nobody", () => {
  const cmp = attackComparison(6, 3, 1600);
  assert.ok(cmp);
  assert.equal(cmp.ours.withFakes, 0);
  assert.equal(cmp.ours.posterPays, 0);
});
