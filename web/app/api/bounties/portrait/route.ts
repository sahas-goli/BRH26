import { db } from "../../../../lib/db";
import { ensureBountyDatabase } from "../../../../lib/ensure-db";
import { fetchBountyPortraitPng } from "../../../../lib/imagine";
import type { HintCard } from "../../../../lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function hintDescription(hint: HintCard): string {
  const parts = [
    hint.field,
    hint.skill,
    hint.experience,
    hint.city,
    hint.language,
    hint.organizationType,
  ].filter((value): value is string => Boolean(value));
  return parts.join(" · ") || "someone in your network";
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "invalid_input" }, 400);
  }
  const input = body as {
    bountyId?: unknown;
    posterToken?: unknown;
    text?: unknown;
    hours?: unknown;
    capCents?: unknown;
  };
  const bountyId = typeof input.bountyId === "string" ? input.bountyId.trim() : "";
  const posterToken = typeof input.posterToken === "string" ? input.posterToken.trim() : "";
  if (!/^b_[A-Za-z0-9]{8}$/.test(bountyId) || !posterToken) {
    return json({ error: "invalid_input" }, 400);
  }
  const hours = input.hours === undefined ? undefined : Number(input.hours);
  const capCents = input.capCents === undefined ? undefined : Number(input.capCents);
  if (hours !== undefined && (!Number.isFinite(hours) || hours <= 0 || hours > 8760)) {
    return json({ error: "invalid_input" }, 400);
  }
  if (capCents !== undefined && (!Number.isSafeInteger(capCents) || capCents < 1000)) {
    return json({ error: "invalid_input" }, 400);
  }
  const text = typeof input.text === "string" ? input.text.trim().slice(0, 4000) : "";

  try {
    await ensureBountyDatabase();
    const { rows } = await db.query<{ hint: HintCard }>(
      "SELECT hint FROM bounties WHERE id=$1 AND poster_token=$2",
      [bountyId, posterToken],
    );
    if (!rows[0]) return json({ error: "not_found" }, 404);
    const description = text || hintDescription(rows[0].hint);
    const png = await fetchBountyPortraitPng(description, {
      hours,
      capCents: capCents === undefined ? undefined : capCents,
    });
    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return json({ error: "illustration_unavailable" }, 502);
  }
}
