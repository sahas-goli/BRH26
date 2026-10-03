import assert from "node:assert/strict";
import { test } from "node:test";
import { tickBounty, type ControllerBounty, type ControllerHolder } from "./controller";

const start = new Date("2026-10-03T16:00:00Z");

function stalled(): { bounty: ControllerBounty; holders: ControllerHolder[] } {
  return {
    bounty: {
      id: "b_stall",
      status: "open",
      hint: { field: "aerospace" },
      hiddenHint: [{ attr: "city", value: "Ithaca" }],
      bountyCents: 600,
      capCents: 1000,
      controllerStep: 0,
      lowBSince: new Date(start.getTime() - 11 * 60 * 1000).toISOString(),
      expiresAt: "2026-10-04T16:00:00Z",
      posterHolderId: "h_poster",
      posterRail: "bank",
    },
    holders: [
      {
        id: "h_quiet",
        depth: 1,
        forwards: 0,
        receivedAt: new Date(start.getTime() - 20 * 60 * 1000).toISOString(),
        nudgedAt: null,
        handle: "quiet@example.test",
      },
      {
        id: "h_once",
        depth: 1,
        forwards: 1,
        receivedAt: new Date(start.getTime() - 20 * 60 * 1000).toISOString(),
        nudgedAt: null,
        handle: "once@example.test",
      },
    ],
  };
}

test("a stalled bounty steps through nudge, widen, and raise", () => {
  const seed = stalled();
  const nudged = tickBounty(seed.bounty, seed.holders, start);
  assert.equal(nudged.action?.kind, "nudged");
  assert.equal(nudged.bounty.controllerStep, 1);
  assert.deepEqual(nudged.action?.nudge, [{
    handle: "quiet@example.test",
    text: "This search is stalling. Pass it to someone closer if you can.",
  }]);
  assert.equal(nudged.events.filter((event) => event.kind === "nudged").length, 1);
  assert.ok(nudged.holders.find((holder) => holder.id === "h_quiet")?.nudgedAt);

  const widened = tickBounty(nudged.bounty, nudged.holders, new Date(start.getTime() + 10 * 60 * 1000));
  assert.equal(widened.action?.kind, "widened");
  assert.equal(widened.bounty.controllerStep, 2);
  assert.equal(widened.bounty.hint.city, "Ithaca");
  assert.equal(widened.bounty.hiddenHint.length, 0);

  const raised = tickBounty(widened.bounty, widened.holders, new Date(start.getTime() + 20 * 60 * 1000));
  assert.equal(raised.action?.kind, "raised");
  assert.equal(raised.bounty.controllerStep, 3);
  assert.equal(raised.bounty.bountyCents, 800);
  assert.deepEqual(raised.events.map((event) => event.kind), ["raised"]);
});

test("an overdue open bounty is refunded in full", () => {
  const { bounty, holders } = stalled();
  bounty.expiresAt = new Date(start.getTime() - 1000).toISOString();
  const result = tickBounty(bounty, holders, start);
  assert.equal(result.bounty.status, "refunded");
  assert.equal(result.refundCents, 1000);
  assert.deepEqual(result.events.map((event) => event.kind), ["expired", "refunded"]);
});

test("branching at 2 or above clears the stall timer", () => {
  const { bounty, holders } = stalled();
  holders[0].forwards = 3;
  const result = tickBounty(bounty, holders, start);
  assert.equal(result.action?.kind, "healthy");
  assert.equal(result.bounty.lowBSince, null);
  assert.equal(result.bounty.controllerStep, 0);
});
