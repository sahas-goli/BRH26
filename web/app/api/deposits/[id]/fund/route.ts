import { BountyError } from "../../../../../lib/bounty";
import { devnetBalance, fundDepositBounty } from "../../../../../lib/deposit";
import { ensureBountyDatabase } from "../../../../../lib/ensure-db";
import { payoutDatabase } from "../../../../../lib/runtime-db";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  if (!process.env.INTERNAL_SECRET || request.headers.get("x-six-hops-secret") !== process.env.INTERNAL_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  if (!/^b_[A-Za-z0-9]{8}$/.test(id)) return Response.json({ error: "not_found" }, { status: 404 });
  try {
    await ensureBountyDatabase();
    const result = await fundDepositBounty(await payoutDatabase(), id, devnetBalance);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BountyError) return Response.json({ error: error.code }, { status: error.status });
    return Response.json({ error: "balance_unavailable" }, { status: 503 });
  }
}
