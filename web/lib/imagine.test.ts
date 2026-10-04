import assert from "node:assert/strict";
import { test } from "node:test";
import { bountyPortraitPrompt, wantedPrompt } from "./imagine";

test("bountyPortraitPrompt stays neutral and name-free", () => {
  const prompt = bountyPortraitPrompt("launch engineer near the coast", { hours: 24, capCents: 2000 });
  assert.match(prompt, /Simple flat vector illustration/);
  assert.match(prompt, /No caricature, no stereotype/);
  assert.match(prompt, /launch engineer near the coast/);
  assert.match(prompt, /24 hours/);
  assert.match(prompt, /\$20 USD/);
});

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
  assert.match(prompt, /flat color, not a photograph, no photorealism, no name, no real likeness/);
});
