import { claimBounty, envBank, envSigner, PayoutError } from "../../../lib/payout";
import { payoutDatabase } from "../../../lib/runtime-db";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  try {
    const result = await claimBounty(await payoutDatabase(), body, { signPayout: envSigner(), moveBank: envBank() });
    return Response.json(result);
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    throw error;
  }
}
