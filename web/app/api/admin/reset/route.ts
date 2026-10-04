import { ensureBountyDatabase } from "../../../../lib/ensure-db";
import { PayoutError } from "../../../../lib/payout";
import { cancelLiveSearches } from "../../../../lib/reset";
import { payoutDatabase } from "../../../../lib/runtime-db";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!process.env.INTERNAL_SECRET || request.headers.get("x-six-hops-secret") !== process.env.INTERNAL_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null) as { dryRun?: unknown } | null;
  try {
    await ensureBountyDatabase();
    return Response.json(await cancelLiveSearches(await payoutDatabase(), body?.dryRun === true));
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    return Response.json({ error: "database_unavailable" }, { status: 503 });
  }
}
