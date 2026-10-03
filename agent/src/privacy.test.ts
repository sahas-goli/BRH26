import assert from "node:assert/strict";
import { test } from "node:test";
import { extractHolderToken, formatHintCard, parseIntent, sanitizeOutbound } from "./privacy.js";

test("extractHolderToken finds 22-char tokens", () => {
  const token = "A".repeat(22);
  assert.equal(extractHolderToken(`see https://milgram.study/h/${token} thanks`), token);
  assert.equal(extractHolderToken("no link here"), null);
});

test("parseIntent classifies pass, claim, name, link", () => {
  const token = "B".repeat(22);
  assert.equal(parseIntent(`https://x.test/h/${token}`).kind, "link");
  assert.equal(parseIntent("yes").kind, "pass");
  assert.equal(parseIntent("this is me").kind, "claim");
  assert.deepEqual(parseIntent("Alex"), { kind: "forward_name", label: "Alex" });
});

test("formatHintCard never mentions chain members or tokens", () => {
  const text = formatHintCard({ city: "Ithaca, NY", field: "aerospace" });
  assert.match(text, /Ithaca/);
  assert.doesNotMatch(text, /token|salt|parent|chain/i);
});

test("sanitizeOutbound blocks leaky replies", () => {
  assert.match(sanitizeOutbound("the parent in the chain is Bob"), /hint card|personal links/i);
});
