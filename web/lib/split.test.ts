import assert from "node:assert/strict";
import { test } from "node:test";
import { attackComparison, splitCents } from "./split";

const BUDGETS = [1000, 1001, 1337, 99999];
const MIT_GAINS: Record<number, number> = { 1: 50, 2: 75, 3: 87.5, 4: 93.75 };

test("splitCents returns null outside 1..8", () => {
  for (const B of BUDGETS) {
    assert.equal(splitCents(0, B), null);
    assert.equal(splitCents(9, B), null);
    assert.equal(splitCents(-1, B), null);
  }
});

test("shares sum to the budget for every h and B", () => {
  for (const B of BUDGETS) {
    for (let h = 1; h <= 8; h++) {
      const split = splitCents(h, B);
      assert.ok(split);
      assert.equal((h - 1) * split.relay + split.finder, B);
      assert.equal(split.relay, Math.floor(B / 16));
      assert.equal(split.finder, B - (h - 1) * split.relay);
    }
  }
});

test("finder identities gain nothing from k fake hops", () => {
  for (const B of BUDGETS) {
    for (let h = 1; h <= 8; h++) {
      const honest = splitCents(h, B);
      assert.ok(honest);
      for (let k = 0; k <= 8 - h; k++) {
        const cmp = attackComparison(h, k, B);
        assert.ok(cmp);
        assert.equal(cmp.ours.withFakes, honest.finder);
        assert.equal(cmp.ours.honestFinder, honest.finder);
        assert.equal(cmp.ours.gainPct, 0);
        assert.equal(cmp.ours.posterPays, B);
      }
    }
  }
});

test("MIT finder gain is 50/75/87.5/93.75 percent for k=1..4", () => {
  for (const B of BUDGETS) {
    for (let h = 1; h <= 8; h++) {
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

test("published sixteenths for a budget divisible by 16", () => {
  const B = 1600;
  assert.deepEqual(splitCents(1, B), { relay: 100, finder: 1600 });
  assert.deepEqual(splitCents(2, B), { relay: 100, finder: 1500 });
  assert.deepEqual(splitCents(4, B), { relay: 100, finder: 1300 });
  assert.deepEqual(splitCents(8, B), { relay: 100, finder: 900 });
});
