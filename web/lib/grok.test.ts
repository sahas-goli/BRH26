import assert from "node:assert/strict";
import { test } from "node:test";
import {
  browserWsProtocols,
  floatToPcm16Base64,
  mintEphemeralToken,
  pcm16Base64ToFloat,
  runVoiceTool,
  sessionUpdateEvent,
  VOICE_TOOLS,
  GROK_VOICE_MODEL,
} from "./grok";

test("browserWsProtocols prefixes the secret", () => {
  assert.deepEqual(browserWsProtocols("abc"), ["xai-client-secret.abc"]);
});

test("sessionUpdateEvent registers three client tools", () => {
  const event = sessionUpdateEvent();
  assert.equal(event.type, "session.update");
  const session = event.session as { tools: { name: string }[] };
  assert.deepEqual(session.tools.map((t) => t.name), ["get_bounty", "forward_to", "claim"]);
  assert.equal(VOICE_TOOLS.length, 3);
});

test("pcm16 round-trip keeps a quiet sample near zero", () => {
  const source = new Float32Array([0, 0.5, -0.5, 1, -1]);
  const back = pcm16Base64ToFloat(floatToPcm16Base64(source));
  assert.equal(back.length, source.length);
  assert.ok(Math.abs(back[0]!) < 1e-3);
  assert.ok(Math.abs(back[1]! - 0.5) < 0.01);
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

test("runVoiceTool forward_to posts one recipient", async () => {
  const calls: { url: string; body?: unknown }[] = [];
  const result = await runVoiceTool(
    "forward_to",
    { label: "Ada", handle: "ada@example.com" },
    "tok_abcdefghijklmnopqrs1",
    async (url, init) => {
      calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : undefined });
      return new Response(JSON.stringify({
        recipients: [{ label: "Ada", link: "/h/x", delivered: "link-only" }],
      }), { status: 200 });
    },
  );
  assert.equal(calls[0]?.url, "/api/forward");
  assert.deepEqual(calls[0]?.body, {
    token: "tok_abcdefghijklmnopqrs1",
    recipients: [{ label: "Ada", handle: "ada@example.com" }],
  });
  assert.equal((result as { recipients: unknown[] }).recipients.length, 1);
});
