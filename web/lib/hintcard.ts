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
  "hint must contain at least one field. If nothing else fits, put a short privacy-safe summary of the request in experience.",
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

const GROK_CHAT_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_GROK_TEXT_MODEL = "grok-4.7";

/** HintCard from the poster's words when no compiler key is configured. */
export function hintFromDescription(text: string): HintCard {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean || clean.length > 4000) throw new Error("invalid_text");
  let experience = clean;
  if (experience.length > 80) {
    const cut = experience.slice(0, 80);
    const space = cut.lastIndexOf(" ");
    experience = space > 40 ? cut.slice(0, space) : cut;
  }
  return { experience };
}

function grokText(body: { choices?: { message?: { content?: unknown } }[] }): string {
  const content = body.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((part) => {
    if (typeof part === "string") return part;
    if (part && typeof part === "object" && "text" in part && typeof part.text === "string") return part.text;
    return "";
  }).join("");
}

function parseModelJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

export async function compileHintCard(text: string): Promise<CompiledHint> {
  const cleaned = text.trim();
  if (!cleaned || cleaned.length > 4000) throw new Error("invalid_text");
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) return { hint: hintFromDescription(cleaned), hidden: [] };
  const model = (process.env.XAI_TEXT_MODEL?.trim() || DEFAULT_GROK_TEXT_MODEL).replace(/[^a-zA-Z0-9._-]/g, "");
  const response = await fetch(GROK_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${INSTRUCTION} Schema: ${JSON.stringify(RESPONSE_SCHEMA)}` },
        { role: "user", content: cleaned },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error("grok_http");
  const textOut = grokText(await response.json() as { choices?: { message?: { content?: unknown } }[] });
  let parsed: unknown;
  try {
    parsed = parseModelJson(textOut);
  } catch {
    throw new Error("grok_parse");
  }
  const compiled = sanitizeCompiledHint(parsed);
  if (Object.keys(compiled.hint).length === 0) {
    return { hint: hintFromDescription(cleaned), hidden: compiled.hidden };
  }
  return compiled;
}
