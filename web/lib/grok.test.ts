import assert from "node:assert/strict";
import { test } from "node:test";
import { browserWsProtocols, mintEphemeralToken, GROK_VOICE_MODEL } from "./grok";

test("browserWsProtocols prefixes the secret", () => {
  assert.deepEqual(browserWsProtocols("abc"), ["xai-client-secret.abc"]);
});

test("mintEphemeralToken maps xAI client_secrets response", async () => {
  const previous = process.env.XAI_API_KEY;
  process.env.XAI_API_KEY = "test-key";
  try {
    const token = await mintEphemeralToken(120, async (_url, init) => {
      assert.equal((init as RequestInit).method, "POST");
      const auth = (init as RequestInit).headers as Record<string, string>;
      assert.match(auth.Authorization, /^Bearer test-key$/);
      return new Response(JSON.stringify({ value: "ephem-1", expires_at: 1_700_000_000 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    assert.equal(token.clientSecret, "ephem-1");
    assert.equal(token.model, GROK_VOICE_MODEL);
    assert.equal(token.expiresAt, new Date(1_700_000_000 * 1000).toISOString());
    assert.match(token.wsUrl, /realtime/);
  } finally {
    if (previous === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previous;
  }
});

test("mintEphemeralToken fails closed without key", async () => {
  const previous = process.env.XAI_API_KEY;
  delete process.env.XAI_API_KEY;
  try {
    await assert.rejects(mintEphemeralToken(60, async () => new Response("no")), /missing_xai_key/);
  } finally {
    if (previous !== undefined) process.env.XAI_API_KEY = previous;
  }
});
