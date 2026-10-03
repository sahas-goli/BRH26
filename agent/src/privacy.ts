/** Deterministic privacy rules — never an LLM. */

const FORBIDDEN = [
  /\bparent\b/i,
  /\bchain\b/i,
  /\btarget\b/i,
  /\bposter\b/i,
  /\bother holders?\b/i,
  /\bdepth\b/i,
  /\bsalt\b/i,
  /\btoken\b/i,
];

/** Drop any reply text that would leak chain structure or secrets. */
export function sanitizeOutbound(text: string): string {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(text)) {
      return "I can only share the public hint card and your personal links.";
    }
  }
  return text.slice(0, 500);
}

export function formatHintCard(hint: Record<string, unknown>): string {
  const lines: string[] = ["Here's the hint card:"];
  for (const [key, value] of Object.entries(hint)) {
    if (typeof value === "string" && value.trim()) {
      lines.push(`• ${key}: ${value.trim().slice(0, 80)}`);
    }
  }
  if (lines.length === 1) lines.push("• (no public attributes yet)");
  lines.push("Reply yes/pass to forward, or this is me if it's you.");
  return sanitizeOutbound(lines.join("\n"));
}

export function extractHolderToken(text: string): string | null {
  const match = text.match(/\/h\/([A-Za-z0-9_-]{22})\b/);
  return match?.[1] ?? null;
}

export type Intent =
  | { kind: "link"; token: string }
  | { kind: "pass" }
  | { kind: "claim" }
  | { kind: "forward_name"; label: string }
  | { kind: "unknown"; text: string };

export function parseIntent(text: string): Intent {
  const trimmed = text.trim();
  const token = extractHolderToken(trimmed);
  if (token) return { kind: "link", token };
  const lower = trimmed.toLowerCase();
  if (lower === "this is me" || lower === "it's me" || lower === "its me") {
    return { kind: "claim" };
  }
  if (
    lower === "yes"
    || lower === "pass"
    || lower === "y"
    || lower.startsWith("pass ")
  ) {
    return { kind: "pass" };
  }
  // First name / short label for forwarding (1–3 words, no digits-heavy phone).
  if (/^[A-Za-z][A-Za-z .'-]{0,79}$/.test(trimmed) && trimmed.split(/\s+/).length <= 3) {
    return { kind: "forward_name", label: trimmed.slice(0, 80) };
  }
  return { kind: "unknown", text: trimmed.slice(0, 200) };
}
