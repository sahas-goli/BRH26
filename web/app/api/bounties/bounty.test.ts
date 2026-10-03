import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { BountyError, configureBounty, createBounty, forwardBounty } from "../../../lib/bounty";
import type { BountyDatabase, BountyQuery } from "../../../lib/bounty";

const flagNames = ["NESSIE_MODE", "GROK_ENABLED", "GEMINI_ENABLED", "PHOTON_ENABLED", "PAYOUT_MODE"] as const;
const original = new Map(flagNames.map((key) => [key, process.env[key]]));
before(() => { for (const key of flagNames) delete process.env[key]; });
after(() => {
  for (const [key, value] of original) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function captureDatabase() {
  const calls: { sql: string; values: unknown[] }[] = [];
  const tx: BountyQuery = {
    async query<T extends Record<string, unknown>>(sql: string, values: unknown[] = []) {
      calls.push({ sql, values });
      return { rows: [] as T[] };
    },
  };
  const database: BountyDatabase = { ...tx, transaction: (work) => work(tx) };
  configureBounty({ database, publicBaseUrl: "https://sixhops.test", now: () => new Date("2026-10-03T16:00:00Z") });
  return calls;
}

function error(code: string, status = 400) {
  return (value: unknown) => value instanceof BountyError && value.code === code && value.status === status;
}
const valid = { hint: { field: "aerospace" }, capCents: 1000 };

test("invalid money and deadlines are rejected before any database access", async () => {
  const calls = captureDatabase();
  for (const capCents of [999, -1000, 1000.5, "1000", null, NaN, Infinity, 2_147_483_648, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(createBounty({ ...valid, capCents }), error("invalid_cap"));
  }
  for (const hours of [0, -1, NaN, Infinity, null, "24", 8761]) {
    await assert.rejects(createBounty({ ...valid, hours }), error("invalid_hours"));
  }
  assert.deepEqual(calls, []);
});

test("allowed cap boundaries persist exact integer cents and initial sixty percent", async () => {
  for (const capCents of [1000, 2_147_483_647]) {
    const calls = captureDatabase();
    const result = await createBounty({ ...valid, capCents });
    const insert = calls.find((call) => call.sql.startsWith("INSERT INTO bounties"))!;
    assert.equal(insert.values[4], capCents);
    assert.equal(insert.values[5], Math.round(0.6 * capCents));
    assert.equal(insert.values[6], "2026-10-04T16:00:00.000Z");
    assert.match(result.bountyId, /^b_[A-Za-z0-9]{8}$/);
    assert.match(result.posterToken, /^[A-Za-z0-9_-]{22}$/);
    assert.match(result.posterLink, /^\/h\/[A-Za-z0-9_-]{22}$/);
    assert.notEqual(result.posterToken, result.posterLink.slice(3));
  }
});

test("hint validation rejects malformed attributes and hidden values without writes", async () => {
  const calls = captureDatabase();
  for (const hint of [null, [], { field: 12 }, { field: "x".repeat(81) }]) {
    await assert.rejects(createBounty({ ...valid, hint }), error("invalid_input"));
  }
  for (const hint of [{}, { name: "private person" }, { city: "" }]) {
    await assert.rejects(createBounty({ ...valid, hint }), error("hint_required"));
  }
  await assert.rejects(createBounty({ ...valid, hint: { organizationType: "person" } }), error("invalid_hint"));
  for (const hidden of [null, [{ attr: "name", value: "private person" }], [{ attr: "city", value: "Ithaca" }, { attr: "city", value: "Austin" }]]) {
    await assert.rejects(createBounty({ ...valid, hidden }), error("invalid_hint"));
  }
  await assert.rejects(createBounty({ ...valid, hidden: [{ attr: "field", value: "x".repeat(81) }] }), error("invalid_input"));
  assert.deepEqual(calls, []);
});

test("only allowed hint attributes are stored, and valid hidden attributes stay separate", async () => {
  const calls = captureDatabase();
  await createBounty({ ...valid, hint: { field: " aerospace ", name: "private person", streetAddress: "private address" }, hidden: [{ attr: "city", value: "Ithaca" }] });
  const insert = calls.find((call) => call.sql.startsWith("INSERT INTO bounties"))!;
  assert.deepEqual(JSON.parse(insert.values[2] as string), { field: "aerospace" });
  assert.deepEqual(JSON.parse(insert.values[3] as string), [{ attr: "city", value: "Ithaca" }]);
});

test("forward validates recipient limits, labels, handles and rails before accessing the database", async () => {
  const calls = captureDatabase();
  const base = { token: "A".repeat(22), recipients: [{ label: "my TA" }] };
  for (const recipients of [null, [], [{ label: "a" }, { label: "b" }, { label: "c" }, { label: "d" }]]) {
    await assert.rejects(forwardBounty({ ...base, recipients }), error("invalid_recipients"));
  }
  for (const recipient of [{ label: " " }, { label: "x".repeat(81) }, { label: "my TA", handle: "x".repeat(255) }]) {
    await assert.rejects(forwardBounty({ ...base, recipients: [recipient] }), error("invalid_input"));
  }
  await assert.rejects(forwardBounty({ ...base, rail: "cash" }), error("invalid_rail"));
  for (const solAddress of [undefined, "0".repeat(32), "1".repeat(31), "1".repeat(33)]) {
    await assert.rejects(forwardBounty({ ...base, rail: "wallet", solAddress }), error("invalid_wallet"));
  }
  await assert.rejects(forwardBounty({ ...base, solAddress: "1".repeat(32) }), error("invalid_rail"));
  assert.deepEqual(calls, []);
  // A 32-byte base58 key reaches token lookup (the empty adapter returns 404).
  await assert.rejects(forwardBounty({ ...base, rail: "wallet", solAddress: "1".repeat(32) }), error("not_found", 404));
  assert.equal(calls.length, 1);
});
