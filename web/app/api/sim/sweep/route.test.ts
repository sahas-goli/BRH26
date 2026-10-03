import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "./route";

test("GET /api/sim/sweep returns attrition and fanout series", async () => {
  const response = await GET();
  assert.equal(response.status, 200);
  const body = await response.json() as {
    by_attrition: { attrition: number; success_rate: number }[];
    by_fanout: { fanout: number; success_rate: number }[];
  };
  assert.ok(body.by_attrition.length >= 3);
  assert.ok(body.by_fanout.length >= 2);
  assert.equal(typeof body.by_attrition[0]!.success_rate, "number");
});
