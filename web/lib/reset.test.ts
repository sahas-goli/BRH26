import assert from "node:assert/strict";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { cancelLiveSearches } from "./reset";
import type { PayoutQuery } from "./payout";

test("reset cancels only live b_ searches and dry run changes nothing", async () => {
  const pg = new PGlite();
  await pg.exec("CREATE TABLE bounties (id TEXT PRIMARY KEY, status TEXT NOT NULL)");
  const seed = { b_fund: "funding", b_open: "open", b_found: "found", b_paid: "paid", b_exp: "expired", b_ref: "refunded", r_0000: "open", r_0001: "found", bx_open: "open" };
  for (const [id, status] of Object.entries(seed)) await pg.query("INSERT INTO bounties VALUES ($1,$2)", [id, status]);
  const db = pg as unknown as PayoutQuery;
  const statuses = async () => Object.fromEntries((await pg.query<{ id: string; status: string }>("SELECT id,status FROM bounties")).rows.map((r) => [r.id, r.status]));

  const dry = await cancelLiveSearches(db, true);
  assert.deepEqual(dry, { cancelled: 3, byStatus: { funding: 1, open: 1, found: 1 }, dryRun: true });
  assert.deepEqual(await statuses(), seed);

  const real = await cancelLiveSearches(db);
  assert.deepEqual(real, { cancelled: 3, byStatus: { funding: 1, open: 1, found: 1 }, dryRun: false });
  assert.deepEqual(await statuses(), { ...seed, b_fund: "cancelled", b_open: "cancelled", b_found: "cancelled" });
  assert.equal((await cancelLiveSearches(db)).cancelled, 0);
  await pg.close();
});
