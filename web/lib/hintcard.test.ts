import assert from "node:assert/strict";
import { after, test } from "node:test";
import { compileHintCard, sanitizeCompiledHint } from "./hintcard";

const originalKey = process.env.XAI_API_KEY;
const originalFetch = globalThis.fetch;
after(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.XAI_API_KEY;
  else process.env.XAI_API_KEY = originalKey;
});

test("sanitizeCompiledHint drops unknown keys, names, and overlong strings", () => {
  const result = sanitizeCompiledHint({
    hint: {
      city: "  Ithaca, NY  ",
      field: "x".repeat(100),
      name: "Private Person",
      streetAddress: "123 Fake St",
      organizationType: "person",
      skill: "solders QFN",
    },
    hidden: [
      { attr: "language", value: " Amharic " },
      { attr: "language", value: "duplicate" },
      { attr: "name", value: "nope" },
      { attr: "city", value: "" },
    ],
  });
  assert.deepEqual(result.hint, {
    city: "Ithaca, NY",
    field: "x".repeat(80),
    skill: "solders QFN",
  });
  assert.deepEqual(result.hidden, [{ attr: "language", value: "Amharic" }]);
});

test("sanitizeCompiledHint tolerates malformed model output", () => {
  assert.deepEqual(sanitizeCompiledHint(null), { hint: {}, hidden: [] });
  assert.deepEqual(sanitizeCompiledHint({ hint: [], hidden: "x" }), { hint: {}, hidden: [] });
});

test("compileHintCard skips the network when the xai key is absent", async () => {
  delete process.env.XAI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  globalThis.fetch = async () => { throw new Error("network"); };
  const result = await compileHintCard("re hair blue cap");
  assert.deepEqual(result, { hint: { experience: "re hair blue cap" }, hidden: [] });
});

test("compileHintCard posts a chat completion and keeps the hint card shape", async () => {
  process.env.XAI_API_KEY = "test-key";
  delete process.env.GEMINI_API_KEY;
  let url = "";
  globalThis.fetch = async (input) => {
    url = String(input);
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ hint: { field: "launch ops", name: "hidden" }, hidden: [] }) } }],
    }), { status: 200 });
  };
  const result = await compileHintCard("someone who has worked a launch");
  assert.equal(url, "https://api.x.ai/v1/chat/completions");
  assert.equal(url.includes("generativelanguage"), false);
  assert.deepEqual(result.hint, { field: "launch ops" });
  assert.deepEqual(result.hidden, []);
});
