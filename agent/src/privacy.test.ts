import assert from "node:assert/strict";
import { test } from "node:test";
import { personalLinkReply } from "./flows.js";
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

test("forward reply explains the link and survives sanitizeOutbound", () => {
  const link = `https://sash.select/h/${"C".repeat(22)}`;
  const text = personalLinkReply("Alex", link);
  const lines = text.split("\n");
  assert.deepEqual(lines, [
    "Personal link for Alex:",
    "This is a search for a kind of person; the card is on the link, so tap This is me if it is you, otherwise pass it to someone closer. The route that works gets paid in test SOL.",
    link,
    "Share only with them.",
  ]);
  assert.doesNotMatch(text, /\b(parent|chain|target|poster|other holders?|depth|salt|token)\b/i);
});
