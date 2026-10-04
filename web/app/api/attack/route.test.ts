import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "./route";

const MIT: Record<number, number> = { 1: 50, 2: 75, 3: 87.5, 4: 93.75 };

test("attack returns the accepted match gain and the MIT gains at k=1..4", async () => {
  for (const k of [1, 2, 3, 4]) {
    const response = await POST(new Request("http://localhost/api/attack", {
      method: "POST",
      body: JSON.stringify({ h: 4, k, budgetCents: 1600 }),
    }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ours.honestFinder, 900);
    assert.equal(body.ours.withFakes, 1300);
    assert.equal(body.ours.gainPct, ((1300 - 900) / 900) * 100);
    assert.equal(body.mit.gainPct, MIT[k]);
    assert.equal(body.ours.posterPays, 1600);
  }
});
