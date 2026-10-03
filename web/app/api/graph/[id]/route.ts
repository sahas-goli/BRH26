import { pool } from "../../../../lib/db";
import { loadGraph } from "../../../../lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const dbPool = pool;
  if (!dbPool) {
    return Response.json({ error: "db_unavailable" }, { status: 503 });
  }

  const { id } = await context.params;
  if (!id) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const graph = await loadGraph(
    { query: (sql, values) => dbPool.query(sql, values) },
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
}
