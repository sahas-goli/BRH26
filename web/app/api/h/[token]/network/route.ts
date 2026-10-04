import { BountyError, getHolderView } from "../../../../../lib/bounty";
import { ensureBountyDatabase } from "../../../../../lib/ensure-db";
import { getDatabase } from "../../../../../lib/db";
import { anonymizeGraph, loadGraph } from "../../../../../lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
): Promise<Response> {
  try {
    await ensureBountyDatabase();
    const { token } = await context.params;
    const view = await getHolderView(token);
    if (view.depth !== 0) return json({ error: "not_found" }, 404);
    const database = await getDatabase();
    const graph = await loadGraph({ query: (sql, values) => database.query(sql, values) }, view.bounty.id);
    if (!graph) return json({ error: "not_found" }, 404);
    return json(anonymizeGraph(graph), 200);
  } catch (error) {
    if (error instanceof BountyError) return json({ error: error.code }, error.status);
    return json({ error: "internal_error" }, 500);
  }
}
