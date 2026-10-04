import { BountyError } from "../../../../../lib/bounty";
import { demoFundDeposit, devnetBalance } from "../../../../../lib/deposit";
import { ensureBountyDatabase } from "../../../../../lib/ensure-db";
import { payoutDatabase } from "../../../../../lib/runtime-db";
import { sendDemoDeposit } from "../../../../../lib/solana";

export const runtime = "nodejs";

function posterToken(body: unknown): string {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "";
  const value = (body as { posterToken?: unknown }).posterToken;
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  if (!/^b_[A-Za-z0-9]{8}$/.test(id)) return Response.json({ error: "not_found" }, { status: 404 });
  const token = posterToken(await request.json().catch(() => null));
  if (!/^[A-Za-z0-9_-]{22}$/.test(token)) return Response.json({ error: "not_found" }, { status: 404 });
  try {
    await ensureBountyDatabase();
    const result = await demoFundDeposit(await payoutDatabase(), id, token, sendDemoDeposit, devnetBalance);
    return Response.json(
      { status: result.status, bountyCents: result.bountyCents },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof BountyError) return Response.json({ error: error.code }, { status: error.status });
    const code = error instanceof Error && error.message === "payer_unavailable" ? "payer_unavailable" : "transfer_unavailable";
    return Response.json({ error: code }, { status: 503 });
  }
}
