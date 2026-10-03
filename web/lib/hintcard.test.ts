import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeCompiledHint } from "./hintcard";

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
