import assert from "node:assert/strict";
import test from "node:test";
import { BountyError } from "./bounty";
import { DEPOSIT_RESERVE_LAMPORTS, depositCents, demoFundDeposit, fundDepositBounty, MIN_BOUNTY_CENTS, minimumDepositLamports, minimumDepositSol } from "./deposit";
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

test("minimum deposit lamports match minimumDepositSol and open the bounty", async () => {
  const lamports = minimumDepositLamports();
  assert.equal(lamports, Math.round(minimumDepositSol() * 1_000_000_000));
  assert.equal(depositCents(lamports) >= MIN_BOUNTY_CENTS, true);
  const funded = await fundDepositBounty(
    fakeDb({ status: "funding", bounty_cents: 600, sol_address: "addr" }).db,
    "b_test0001",
    async () => lamports,
  );
  assert.equal(funded.status, "open");
  assert.equal(funded.bountyCents >= MIN_BOUNTY_CENTS, true);
});

test("demo fund sends the minimum once, and does not send again when already open", async () => {
  const lamports = minimumDepositLamports();
  const funding = fakeDb({ status: "funding", bounty_cents: 600, sol_address: "DepositAddr", poster_token: "same" });
  const sent: Array<[string, number]> = [];
  let reads = 0;
  const opened = await demoFundDeposit(
    funding.db,
    "b_test0001",
    "same",
    async (address, amount) => { sent.push([address, amount]); },
    async () => {
      reads += 1;
      return reads === 1 ? 0 : lamports;
    },
  );
  assert.deepEqual(sent, [["DepositAddr", lamports]]);
  assert.equal(opened.status, "open");

  const open = fakeDb({ status: "open", bounty_cents: opened.bountyCents, sol_address: "DepositAddr", poster_token: "same" });
  const first = await demoFundDeposit(open.db, "b_test0001", "same", async () => { throw new Error("sent"); }, async () => { throw new Error("balance"); });
  const second = await demoFundDeposit(open.db, "b_test0001", "same", async () => { throw new Error("sent"); }, async () => { throw new Error("balance"); });
  assert.equal(first.status, "open");
  assert.equal(second.status, "open");
  assert.equal(second.bountyCents, opened.bountyCents);
  assert.equal(open.updates.length, 0);
});

test("demo fund does not send when the code does not match", async () => {
  const db = fakeDb({ status: "funding", bounty_cents: 600, sol_address: "addr", poster_token: "same" });
  await assert.rejects(
    () => demoFundDeposit(db.db, "b_test0001", "other", async () => { throw new Error("sent"); }, async () => { throw new Error("balance"); }),
    (error: unknown) => error instanceof BountyError && error.status === 404,
  );
});
