import { confirmBounty, envBank, envSigner, PayoutError } from "../../../../../lib/payout";
import { ensureBountyDatabase } from "../../../../../lib/ensure-db";
import { payoutDatabase } from "../../../../../lib/runtime-db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const body = await request.json().catch(() => null);
  const { id } = await context.params;
  const input = body && typeof body === "object" ? { ...body, bountyId: id } : body;
  try {
    await ensureBountyDatabase();
    const result = await confirmBounty(await payoutDatabase(), input, { signPayout: envSigner(), moveBank: envBank() });
    return Response.json(result);
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    throw error;
  }
}
