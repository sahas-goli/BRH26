import { BountyError, getHolderShareMeta } from "../../../../lib/bounty";
import { grokEnabled, mintEphemeralToken } from "../../../../lib/grok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const token = body && typeof body === "object" && !Array.isArray(body)
    ? (body as { token?: unknown }).token
    : undefined;
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{22}$/.test(token)) {
    return json({ error: "invalid_token" }, 400);
  }
  if (!grokEnabled()) {
    return json({ error: "grok_unavailable" }, 503);
  }
  try {
    // Validates the holder exists without marking opened_at (share meta).
    await getHolderShareMeta(token);
    const minted = await mintEphemeralToken(300);
    return json({
      clientSecret: minted.clientSecret,
      expiresAt: minted.expiresAt,
      model: minted.model,
      wsUrl: minted.wsUrl,
    }, 200);
  } catch (error) {
    if (error instanceof BountyError) {
      return json({ error: error.code }, error.status);
    }
    return json({ error: "grok_unavailable" }, 503);
  }
}
