import assert from "node:assert/strict";
import { test } from "node:test";
import { applyClaim, applyConfirm, settleChain } from "./payout";

const chain = [
  { holderId: "h_a", depth: 1, rail: "custodial" as const },
  { holderId: "h_b", depth: 2, rail: "wallet" as const },
  { holderId: "h_c", depth: 3, rail: "custodial" as const },
  { holderId: "h_d", depth: 4, rail: "bank" as const },
];

const open = {
  status: "open" as const,
  bountyCents: 1600,
  capCents: 2000,
  hasBadge: false,
  posterHolderId: "h_poster",
  posterRail: "bank" as const,
  payouts: [],
};

test("a 4-deep mock claim pays the chain once", () => {
  const found = applyClaim(open, null);
  assert.equal(found.error, undefined);
  assert.equal(found.ledger.status, "found");
  assert.equal(found.ledger.payouts.length, 0);

  const paid = applyConfirm(found.ledger, chain, true, "b_demo");
  assert.equal(paid.ledger.status, "paid");
  assert.equal(paid.payoutSig, "mock_b_demo");
  const shares = paid.ledger.payouts.filter((row) => row.role !== "refund");
  assert.equal(shares.reduce((sum, row) => sum + row.cents, 0), 1600);
  assert.deepEqual(
    shares.map((row) => row.cents),
    [100, 100, 100, 1300],
  );
  const refund = paid.ledger.payouts.find((row) => row.role === "refund");
  assert.equal(refund?.cents, 400);
  assert.equal(refund?.holderId, "h_poster");

  const again = applyConfirm(paid.ledger, chain, true, "b_demo");
  assert.equal(again.payoutSig, "mock_b_demo");
  assert.equal(again.idempotent, true);
  assert.equal(again.ledger.payouts.length, paid.ledger.payouts.length);
});

test("a second claim is rejected", () => {
  const found = applyClaim(open, null);
  const again = applyClaim(found.ledger, null);
  assert.equal(again.error, "already_claimed");
});

test("a bad badge code does not pay", () => {
  const denied = applyClaim({ ...open, hasBadge: true }, false);
  assert.equal(denied.error, "bad_code");
  assert.equal(denied.ledger.status, "open");
});

test("a valid badge pays immediately", () => {
  const paid = applyClaim({ ...open, hasBadge: true }, true, chain, "b_badge");
  assert.equal(paid.ledger.status, "paid");
  assert.equal(
    paid.ledger.payouts.filter((row) => row.role !== "refund").reduce((sum, row) => sum + row.cents, 0),
    1600,
  );
});

test("reject reopens a found bounty", () => {
  const found = applyClaim(open, null);
  const reopened = applyConfirm(found.ledger, chain, false, "b_demo");
  assert.equal(reopened.ledger.status, "open");
  assert.equal(reopened.ledger.payouts.length, 0);
});

test("settleChain returns null past depth 8", () => {
  const tooLong = Array.from({ length: 9 }, (_, i) => ({
    holderId: `h_${i}`,
    depth: i + 1,
    rail: "custodial" as const,
  }));
  assert.equal(settleChain("b_x", tooLong, 1600, 2000, "h_poster", "bank", []), null);
});
