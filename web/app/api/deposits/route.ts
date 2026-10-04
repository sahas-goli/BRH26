import { BountyError } from "../../../lib/bounty";
import { createDepositBounty } from "../../../lib/deposit";
import { ensureBountyDatabase } from "../../../lib/ensure-db";
import { payoutDatabase } from "../../../lib/runtime-db";
import { newCustodialAccount } from "../../../lib/solana";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  if (!process.env.INTERNAL_SECRET || request.headers.get("x-six-hops-secret") !== process.env.INTERNAL_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const input = await request.json().catch(() => null);
  try {
    await ensureBountyDatabase();
    const result = await createDepositBounty(await payoutDatabase(), input, newCustodialAccount);
    return Response.json(result, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof BountyError) return Response.json({ error: error.code }, { status: error.status });
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
