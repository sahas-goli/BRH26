import assert from "node:assert/strict";
import { test } from "node:test";
import { POST as create } from "./route";
import { GET as bounty } from "./[id]/route";
import { GET as holder } from "../h/[token]/route";
import { POST as forward } from "../forward/route";

function post(path: string, body: string): Request {
  return new Request(`https://sixhops.test${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

test("mutation routes reject malformed JSON without leaking request contents", async () => {
  for (const handler of [create, forward]) {
    const response = await handler(post("/api/test", '{"token":"private-value"'));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_json" });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  }
});

test("read routes fail safely when the database integration is unavailable", async () => {
  const responses = [
    await bounty(new Request("https://sixhops.test/api/bounties/b_ABCDEFGH"), {
      params: Promise.resolve({ id: "b_ABCDEFGH" }),
    }),
    await holder(new Request("https://sixhops.test/api/h/AAAAAAAAAAAAAAAAAAAAAA"), {
      params: Promise.resolve({ token: "AAAAAAAAAAAAAAAAAAAAAA" }),
    }),
  ];

  for (const response of responses) {
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "database_unavailable" });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  }
});

test("unexpected route failures do not expose internal error details", async () => {
  // A failing params resolver exercises the same catch boundary as core failures.
  const params = Promise.reject(new Error("private database connection details"));
  const response = await bounty(new Request("https://sixhops.test/api/bounties/test"), {
    params,
  });
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "internal_error" });
});
