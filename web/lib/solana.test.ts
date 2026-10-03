import assert from "node:assert/strict";
import { test } from "node:test";
import { Keypair } from "@solana/web3.js";
import { MEMO_PROGRAM_ID, SYSTEM_PROGRAM_ID, buildPayoutTransaction, edgeMemo, explorerUrl, payoutPlan } from "./solana";

test("one payout transaction carries N transfers plus a memo", async () => {
  const shares = [1, 2, 3, 4].map(() => ({ address: Keypair.generate().publicKey.toBase58(), cents: 100 }));
  const plan = payoutPlan("b_demo", shares, ["salt-a", "salt-b"]);
  assert.equal(plan.transfers.length, 4);
  assert.equal(plan.transfers[0].lamports, Math.round((100 * 1_000_000_000) / 15000));
  assert.match(plan.memo, /^sixhops:pay:b_demo:[0-9a-f]{64}$/);

  const tx = buildPayoutTransaction(Keypair.generate().publicKey.toBase58(), plan);
  assert.equal(tx.instructions.length, 5);
  assert.equal(tx.instructions.slice(0, 4).every((ix) => ix.programId.toBase58() === SYSTEM_PROGRAM_ID), true);
  assert.equal(tx.instructions[4].programId.toBase58(), MEMO_PROGRAM_ID);
  assert.equal(tx.instructions[4].data.toString(), plan.memo);
});

test("edge memo is a single tagged hash", () => {
  const memo = edgeMemo("b_demo", "parent", "child", "2026-10-03T16:00:00Z");
  assert.match(memo, /^sixhops:edge:b_demo:[0-9a-f]{64}$/);
  assert.equal(explorerUrl("sig"), "https://explorer.solana.com/tx/sig?cluster=devnet");
});
