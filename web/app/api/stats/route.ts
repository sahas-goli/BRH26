import { pool } from "../../../lib/db";
import { loadStats, resolveStatsBountyId } from "../../../lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const dbPool = pool;
  if (!dbPool) {
    return Response.json({ error: "db_unavailable" }, { status: 503 });
  }

  const url = new URL(request.url);
  const bountyId = resolveStatsBountyId(url.searchParams.get("bounty"));
  if (!bountyId) {
    return Response.json({ error: "bounty_required" }, { status: 400 });
  }

  const stats = await loadStats(
    { query: (sql, values) => dbPool.query(sql, values) },
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
}
