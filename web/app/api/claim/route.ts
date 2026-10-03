import { claimBounty, PayoutError } from "../../../lib/payout";
import { ensureBountyDatabase } from "../../../lib/ensure-db";
import { payoutDatabase } from "../../../lib/runtime-db";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  try {
    await ensureBountyDatabase();
    const database = await payoutDatabase();
    const result = await claimBounty(database, body);
    return Response.json(result);
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    throw error;
  }
}
