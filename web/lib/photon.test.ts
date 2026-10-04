import assert from "node:assert/strict";
import test from "node:test";
import { e164, joinPhoton } from "./photon";

test("e164 accepts US formats and rejects junk", () => {
  assert.equal(e164("(607) 555-0123"), "+16075550123");
  assert.equal(e164("1 607 555 0123"), "+16075550123");
  assert.equal(e164("+44 20 7946 0958"), "+442079460958");
  assert.throws(() => e164("hello"));
  assert.throws(() => e164("555"));
});

test("joinPhoton registers a shared user and returns the assigned line", async () => {
  process.env.SPECTRUM_PROJECT_ID = "00000000-0000-0000-0000-000000000000";
  process.env.SPECTRUM_PROJECT_SECRET = "secret";
  let sent: { url: string; body: unknown; auth: string } | undefined;
  const fake = (async (url: string, init: RequestInit) => {
    sent = { url, body: JSON.parse(String(init.body)), auth: String((init.headers as Record<string, string>).Authorization) };
    return new Response(JSON.stringify({ succeed: true, data: { assignedPhoneNumber: "+15559876543" } }));
  }) as unknown as typeof fetch;
  assert.deepEqual(await joinPhoton("607-555-0123", fake), { line: "+15559876543" });
  assert.deepEqual(sent?.body, { type: "shared", phoneNumber: "+16075550123" });
  assert.match(sent!.url, /\/projects\/0{8}-0{4}-0{4}-0{4}-0{12}\/users\/$/);
  assert.ok(sent!.auth.startsWith("Basic "));
});
