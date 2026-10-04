import assert from "node:assert/strict";
import test from "node:test";
import { FEATURED_PANEL_CENTS, nessiePanel } from "./nessie-panel";

test("featured escrow holds the payable reward and checking holds the rest", () => {
  const panel = nessiePanel({ ...FEATURED_PANEL_CENTS, status: "expired" });
  assert.equal(panel.available, true);
  assert.equal(panel.escrowCents, 1600);
  assert.equal(panel.checkingCents, 5400);
  assert.equal(panel.note, "Escrow is holding the reward until the poster accepts.");
  assert.doesNotMatch(`${panel.note} ${panel.status}`, /mock|simulated|dummy|NESSIE_MODE/i);
});

test("an open $20 search keeps the unpaid reserve in checking", () => {
  const panel = nessiePanel({ capCents: 2000, bountyCents: 1200, status: "open" });
  assert.equal(panel.escrowCents, 1200);
  assert.equal(panel.checkingCents, 5800);
});

test("a settled search clears escrow without describing a bank payout", () => {
  const panel = nessiePanel({ capCents: 2000, bountyCents: 1200, status: "paid" });
  assert.equal(panel.escrowCents, 0);
  assert.equal(panel.checkingCents, 5800);
  assert.equal(panel.note, "Checking holds the remaining balance.");
});
