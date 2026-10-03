import { claimBounty, envBank, envSigner, PayoutError } from "../../../lib/payout";
import { ensureBountyDatabase } from "../../../lib/ensure-db";
import { payoutDatabase } from "../../../lib/runtime-db";
import { verifyBadgeHotp } from "../../../lib/hotp";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  try {
    await ensureBountyDatabase();
    const database = await payoutDatabase();
    const result = await claimBounty(database, body, {
      signPayout: envSigner(),
      moveBank: envBank(),
      async verifyBadge(badgeId, code) {
        // bounty id is resolved inside claimBounty; look up via token from body when possible
        const token = body && typeof body === "object" && !Array.isArray(body)
          ? (body as { token?: unknown }).token
          : undefined;
        if (typeof token !== "string") return false;
        const { rows } = await database.query<{ bounty_id: string }>(
          "SELECT bounty_id FROM holders WHERE token=$1",
          [token],
        );
        const bountyId = rows[0]?.bounty_id;
        if (!bountyId) return false;
        const verified = await verifyBadgeHotp(database, { bountyId, badgeId, code });
        if (!verified.ok) {
          if (verified.reason === "rate_limited") throw new PayoutError("rate_limited", 429);
          return false;
        }
        return { ok: true, counter: verified.counter };
      },
    });
    return Response.json(result);
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    throw error;
  }
}
