import { getDatabase } from "../../../../lib/db";
import { ensureBountyDatabase } from "../../../../lib/ensure-db";
import { loadGraph } from "../../../../lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    await ensureBountyDatabase();
    const database = await getDatabase();
    const { id } = await context.params;
    if (!id) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    const graph = await loadGraph(
      { query: (sql, values) => database.query(sql, values) },
      id,
    );
    if (!graph) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    return Response.json(graph, {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return Response.json({ error: "db_unavailable" }, { status: 503 });
  }
}
