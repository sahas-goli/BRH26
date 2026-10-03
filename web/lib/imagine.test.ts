import assert from "node:assert/strict";
import { test } from "node:test";
import { wantedPrompt } from "./imagine";

test("wantedPrompt includes attribute cues without inventing identity", () => {
  const prompt = wantedPrompt({
    organizationType: "lab",
    experience: "interned at a launch company",
    language: "Amharic",
  });
  assert.match(prompt, /research lab/);
  assert.match(prompt, /Amharic/);
  assert.match(prompt, /interned at a launch company/);
  assert.match(prompt, /No photographs of real people/);
});
