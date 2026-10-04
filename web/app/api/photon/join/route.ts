import { joinPhoton, PhotonJoinError } from "../../../../lib/photon";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null) as { phone?: unknown } | null;
  try {
    return Response.json(await joinPhoton(body?.phone), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PhotonJoinError) return Response.json({ error: error.code }, { status: error.status });
    return Response.json({ error: "photon_unavailable" }, { status: 503 });
  }
}
