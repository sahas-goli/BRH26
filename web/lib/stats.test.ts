import assert from "node:assert/strict";
import { test } from "node:test";
import {
  anonymizeGraph,
  assembleGraph,
  assembleStats,
  resolveStatsBountyId,
} from "./stats";

test("assembleStats shapes stats JSON", () => {
  const stats = assembleStats({
    bountyId: "b_live",
    status: "open",
    controllerStep: 2,
    holders: 12,
    maxDepth: 4,
    matureHolders: 8,
    frontier: 5,
    b: 1.75,
    p75LatencyS: 420,
    asOf: "2026-10-03T17:00:00.000Z",
  });
  assert.deepEqual(stats, {
    bountyId: "b_live",
    b: 1.75,
    matureHolders: 8,
    frontier: 5,
    holders: 12,
    maxDepth: 4,
    p75LatencyS: 420,
    controllerStep: 2,
    status: "open",
    asOf: "2026-10-03T17:00:00.000Z",
  });
});

test("assembleGraph hides salts until paid and marks the target", () => {
  const holders = [
    {
      id: "h0",
      parent_id: null,
      depth: 0,
      label: null,
      salt: "aa",
      received_at: "2026-10-03T12:00:00.000Z",
    },
    {
      id: "h1",
      parent_id: "h0",
      depth: 1,
      label: "TA",
      salt: "bb",
      received_at: "2026-10-03T12:01:00.000Z",
    },
    {
      id: "h2",
      parent_id: "h1",
      depth: 2,
      label: "friend",
      salt: "cc",
      received_at: "2026-10-03T12:02:00.000Z",
    },
    {
      id: "h_side",
      parent_id: "h0",
      depth: 1,
      label: "dead end",
      salt: "dd",
      received_at: "2026-10-03T12:01:30.000Z",
    },
  ];

  const open = assembleGraph({
    status: "open",
    holders,
    payouts: [],
    claimedHolderId: null,
    edgeMemos: [
      {
        holder_id: "h1",
        parent_id: "h0",
        memoSig: "edge1",
        at: "2026-10-03T12:01:00.000Z",
      },
    ],
  });
  assert.equal(open.revealedSalts, undefined);
  assert.equal(open.nodes.find((node) => node.id === "h2")?.isTarget, false);
  assert.equal(open.edges.find((edge) => edge.to === "h1")?.memoSig, "edge1");

  const paid = assembleGraph({
    status: "paid",
    holders,
    payouts: [
      { holder_id: "h1", cents: 100, role: "relay", tx_sig: "sig_pay" },
      { holder_id: "h2", cents: 1500, role: "finder", tx_sig: "sig_pay" },
    ],
    claimedHolderId: "h2",
    edgeMemos: [],
  });
  assert.equal(paid.nodes.find((node) => node.id === "h2")?.isTarget, true);
  assert.equal(paid.nodes.find((node) => node.id === "h2")?.paidCents, 1500);
  assert.equal(paid.payoutSig, "sig_pay");
  assert.equal(
    paid.explorerUrl,
    "https://explorer.solana.com/tx/sig_pay?cluster=devnet",
  );
  assert.deepEqual(paid.revealedSalts, {
    h2: "cc",
    h1: "bb",
    h0: "aa",
  });
  assert.equal(paid.revealedSalts?.h_side, undefined);
});

test("anonymizeGraph drops names, salts, and real holder ids", () => {
  const named = assembleGraph({
    status: "paid",
    holders: [
      { id: "h0", parent_id: null, depth: 0, label: null, salt: "aa", received_at: "2026-10-04T00:00:00Z" },
      { id: "h1", parent_id: "h0", depth: 1, label: "Selina", salt: "bb", received_at: "2026-10-04T00:01:00Z" },
      { id: "h2", parent_id: "h1", depth: 2, label: "Audrey", salt: "cc", received_at: "2026-10-04T00:02:00Z" },
    ],
    payouts: [{ holder_id: "h2", cents: 900, role: "finder", tx_sig: "sig_pay" }],
    claimedHolderId: "h2",
    edgeMemos: [{ holder_id: "h1", parent_id: "h0", memoSig: "memo1", at: "2026-10-04T00:01:00Z" }],
  });
  const anon = anonymizeGraph(named);
  const blob = JSON.stringify(anon);
  assert.equal(blob.includes("Selina"), false);
  assert.equal(blob.includes("Audrey"), false);
  assert.equal(blob.includes("memo1"), false);
  assert.equal(blob.includes("h1"), false);
  assert.equal(anon.nodes.find((node) => node.depth === 0)?.label, "You");
  assert.equal(anon.nodes.find((node) => node.depth === 1)?.label, "Someone");
  assert.equal(anon.nodes.find((node) => node.isTarget)?.depth, 2);
  assert.equal(anon.edges.length, 2);
  assert.equal(anon.revealedSalts, undefined);
});

test("resolveStatsBountyId prefers the query, then FEATURED_BOUNTY", () => {
  assert.equal(resolveStatsBountyId("b_q", "b_feat"), "b_q");
  assert.equal(resolveStatsBountyId(null, "b_feat"), "b_feat");
  assert.equal(resolveStatsBountyId("  ", ""), null);
});
