import assert from "node:assert/strict";
import test from "node:test";
import { DEPOSIT_RESERVE_LAMPORTS, depositCents, fundDepositBounty, minimumDepositSol } from "./deposit";
import { centsToLamports } from "./solana";
import type { PayoutDatabase } from "./payout";

function fakeDb(row: Record<string, unknown>) {
  const updates: unknown[][] = [];
  const db = {
    async query(sql: string, values?: unknown[]) {
      if (sql.startsWith("SELECT")) return { rows: [row] };
      updates.push(values ?? []);
      row.status = "open";
      return { rows: [] };
    },
    async transaction<T>(work: (tx: PayoutDatabase) => Promise<T>) { return work(db as unknown as PayoutDatabase); },
  };
  return { db: db as unknown as PayoutDatabase, updates };
}

test("deposit value keeps the reserve and never pays out more than it holds", () => {
  assert.equal(depositCents(DEPOSIT_RESERVE_LAMPORTS), 0);
  assert.equal(depositCents(1_000_000_000 + DEPOSIT_RESERVE_LAMPORTS), 15000);
  for (const lamports of [68_000_000, 123_456_789, 5_000_000_000]) {
    const cents = depositCents(lamports);
    assert.ok(centsToLamports(cents) <= lamports - DEPOSIT_RESERVE_LAMPORTS);
  }
  assert.ok(depositCents(minimumDepositSol() * 1_000_000_000) >= 1000);
});

test("fund opens the bounty at the full deposit value", async () => {
  const { db, updates } = fakeDb({ status: "funding", bounty_cents: 600, sol_address: "addr" });
  const result = await fundDepositBounty(db, "b_test0001", async () => 101_000_000);
  assert.deepEqual(result.status, "open");
  assert.equal(result.bountyCents, 1500);
  assert.deepEqual(updates[0], [1500, "b_test0001"]);
});

test("fund stays in funding below the minimum and is idempotent once open", async () => {
  const low = fakeDb({ status: "funding", bounty_cents: 600, sol_address: "addr" });
  assert.equal((await fundDepositBounty(low.db, "b_test0001", async () => 10_000_000)).status, "funding");
  assert.equal(low.updates.length, 0);
  const open = fakeDb({ status: "open", bounty_cents: 1500, sol_address: "addr" });
  const again = await fundDepositBounty(open.db, "b_test0001", async () => { throw new Error("not called"); });
  assert.equal(again.bountyCents, 1500);
});
