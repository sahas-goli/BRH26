import { getDatabase } from "../../../lib/db";
import { ensureBountyDatabase } from "../../../lib/ensure-db";
import { loadStats, resolveStatsBountyId } from "../../../lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    await ensureBountyDatabase();
    const database = await getDatabase();
    const url = new URL(request.url);
    const bountyId = resolveStatsBountyId(url.searchParams.get("bounty"));
    if (!bountyId) {
      return Response.json({ error: "bounty_required" }, { status: 400 });
    }

    const stats = await loadStats(
      { query: (sql, values) => database.query(sql, values) },
      bountyId,
    );
    if (!stats) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    return Response.json(stats, {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return Response.json({ error: "db_unavailable" }, { status: 503 });
  }
}
