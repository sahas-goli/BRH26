import type { HintCard } from "./types";
import type { BountyDatabase } from "./bounty";

const ORG_LABELS: Record<string, string> = {
  company: "a company",
  startup: "a startup",
  university: "a university",
  lab: "a research lab",
  nonprofit: "a nonprofit",
  government: "a government team",
  other: "an organization",
};

/** Build a name-free wanted-poster prompt from a HintCard. */
export function wantedPrompt(hint: HintCard): string {
  const lines = [
    "Design a stylized WANTED poster illustration for a social search game.",
    "Illustrated portrait of the kind of person described, flat color, not a photograph, no photorealism, no name, no real likeness.",
    "No photographs of real people. No faces that look like a specific person.",
    "No readable names, street addresses, phone numbers, or QR codes.",
    "Mood: warm paper, ink stamp, bold typography saying WANTED, mysterious silhouette.",
    "Aspect ratio roughly 1.91:1 for a link preview card.",
  ];
  const facts: string[] = [];
  if (hint.city) facts.push(`City vibe: ${hint.city}`);
  if (hint.organizationType) facts.push(`Setting: ${ORG_LABELS[hint.organizationType] ?? "an organization"}`);
  if (hint.field) facts.push(`Field: ${hint.field}`);
  if (hint.skill) facts.push(`Skill cue: ${hint.skill}`);
  if (hint.language) facts.push(`Language cue: ${hint.language}`);
  if (hint.experience) facts.push(`Experience cue: ${hint.experience}`);
  if (facts.length) lines.push("Attribute cues only:", ...facts.map((f) => `- ${f}`));
  return lines.join("\n");
}

export async function fetchWantedCardPng(hint: HintCard): Promise<Buffer> {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) throw new Error("missing_xai_key");
  const response = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt: wantedPrompt(hint),
      response_format: "b64_json",
      n: 1,
    }),
  });
  if (!response.ok) throw new Error("imagine_http");
  const body = await response.json() as {
    data?: { b64_json?: string; url?: string }[];
  };
  const b64 = body.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  const url = body.data?.[0]?.url;
  if (!url) throw new Error("imagine_empty");
  const image = await fetch(url);
  if (!image.ok) throw new Error("imagine_download");
  return Buffer.from(await image.arrayBuffer());
}

/** Generate via Grok Imagine and persist to bounties.og_png. */
export async function storeWantedCard(
  database: BountyDatabase,
  input: { bountyId: string; hint: HintCard },
): Promise<void> {
  const png = await fetchWantedCardPng(input.hint);
  await database.query("UPDATE bounties SET og_png=$1 WHERE id=$2", [png, input.bountyId]);
}

/** next/og fallback when GROK is off or no stored PNG exists. */
export async function fallbackWantedCardResponse(hint: HintCard): Promise<Response> {
  const [{ ImageResponse }, { createElement }] = await Promise.all([
    import("next/og"),
    import("react"),
  ]);
  const rows = [
    hint.city,
    hint.organizationType,
    hint.field,
    hint.skill,
    hint.language,
    hint.experience,
  ].filter((value): value is string => Boolean(value));

  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg,#1f3d32 0%,#0f241c 55%,#3a2a14 100%)",
          color: "#f6f0e4",
          padding: 56,
          fontFamily: "Georgia, serif",
        },
      },
      createElement(
        "div",
        { style: { fontSize: 28, letterSpacing: "0.35em", fontWeight: 700, opacity: 0.8 } },
        "SIX HOPS",
      ),
      createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 18 } },
        createElement(
          "div",
          { style: { fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 } },
          "WANTED",
        ),
        createElement(
          "div",
          { style: { fontSize: 30, lineHeight: 1.35, maxWidth: 900, opacity: 0.92 } },
          rows.slice(0, 4).join(" · ") || "Someone in your network",
        ),
      ),
      createElement(
        "div",
        { style: { fontSize: 24, opacity: 0.75 } },
        "Forward to someone closer",
      ),
    ),
    { width: 1200, height: 630 },
  );
}
