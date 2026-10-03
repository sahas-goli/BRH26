import { attackComparison } from "../../../lib/split";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "invalid_input" }, { status: 400 });
  const { h, k, budgetCents } = body as { h?: unknown; k?: unknown; budgetCents?: unknown };
  if (typeof h !== "number" || typeof k !== "number" || typeof budgetCents !== "number") {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const result = attackComparison(h, k, budgetCents);
  if (!result) return Response.json({ error: "invalid_input" }, { status: 400 });
  return Response.json(result);
}
