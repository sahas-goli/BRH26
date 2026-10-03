import type { HintCard } from "./types";

const HINT_KEYS = ["city", "organizationType", "field", "skill", "language", "experience"] as const;
type HintKey = (typeof HINT_KEYS)[number];
const ORG_TYPES = new Set(["company", "startup", "university", "lab", "nonprofit", "government", "other"]);

export type HiddenHint = { attr: HintKey; value: string };
export type CompiledHint = { hint: HintCard; hidden: HiddenHint[] };

const INSTRUCTION = [
  "You convert a messy request for a hard-to-find person into a privacy-safe hint card.",
  "Return JSON only matching the schema.",
  "Drop any person name, username, email, phone number, or street address.",
  "Generalize places to city level (city and region/state only).",
  "Put attributes safe to show recipients in hint.",
  "Put sharper identifiers that should stay server-side until later in hidden as {attr,value} pairs.",
  "Omit unknown or empty fields. Strings at most 80 characters.",
  "organizationType must be one of: company, startup, university, lab, nonprofit, government, other.",
].join(" ");

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    hint: {
      type: "object",
      additionalProperties: false,
      properties: {
        city: { type: "string" },
        organizationType: { type: "string", enum: [...ORG_TYPES] },
        field: { type: "string" },
        skill: { type: "string" },
        language: { type: "string" },
        experience: { type: "string" },
      },
    },
    hidden: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          attr: { type: "string", enum: [...HINT_KEYS] },
          value: { type: "string" },
        },
        required: ["attr", "value"],
      },
    },
  },
  required: ["hint", "hidden"],
} as const;

function clip(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return undefined;
  return trimmed.slice(0, 80);
}

/** Server re-validation: drop unknown keys and clip strings to 80 chars. */
export function sanitizeCompiledHint(raw: unknown): CompiledHint {
  const root = raw && typeof raw === "object" && !Array.isArray(raw)
    ? raw as Record<string, unknown>
    : {};
  const hintIn = root.hint && typeof root.hint === "object" && !Array.isArray(root.hint)
    ? root.hint as Record<string, unknown>
    : {};
  const hint: HintCard = {};
  for (const key of HINT_KEYS) {
    const value = clip(hintIn[key]);
    if (!value) continue;
    if (key === "organizationType") {
      if (ORG_TYPES.has(value)) hint.organizationType = value as HintCard["organizationType"];
      continue;
    }
    hint[key] = value;
  }
  const hiddenRaw = Array.isArray(root.hidden) ? root.hidden : [];
  const seen = new Set<string>();
  const hidden: HiddenHint[] = [];
  for (const entry of hiddenRaw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const item = entry as Record<string, unknown>;
    if (!HINT_KEYS.includes(item.attr as HintKey) || seen.has(item.attr as string)) continue;
    const value = clip(item.value);
    if (!value) continue;
    if (item.attr === "organizationType" && !ORG_TYPES.has(value)) continue;
    const attr = item.attr as HintKey;
    seen.add(attr);
    hidden.push({ attr, value });
  }
  return { hint, hidden };
}

export async function compileHintCard(text: string): Promise<CompiledHint> {
  const cleaned = text.trim();
  if (!cleaned || cleaned.length > 4000) throw new Error("invalid_text");
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("missing_gemini_key");
  const model = (process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash").replace(/[^a-zA-Z0-9._-]/g, "");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${INSTRUCTION}\n\nRequest:\n${cleaned}` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    }),
  });
  if (!response.ok) throw new Error("gemini_http");
  const body = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const textOut = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(textOut);
  } catch {
    throw new Error("gemini_parse");
  }
  const compiled = sanitizeCompiledHint(parsed);
  if (Object.keys(compiled.hint).length === 0) throw new Error("gemini_empty_hint");
  return compiled;
}
