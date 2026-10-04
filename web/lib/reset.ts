import type { PayoutQuery } from "./payout";

const LIVE = ["funding", "open", "found"] as const;
type Live = (typeof LIVE)[number];
// r_* ids are the Tiger replay behind /live; only b_* searches are live and stoppable.
const WHERE = "left(o.id,2)='b_' AND o.status IN ('funding','open','found')";

export async function cancelLiveSearches(db: PayoutQuery, dryRun = false): Promise<{ cancelled: number; byStatus: Record<Live, number>; dryRun: boolean }> {
  const { rows } = await db.query<{ status: Live }>(dryRun
    ? `SELECT o.status FROM bounties o WHERE ${WHERE}`
    : `UPDATE bounties b SET status='cancelled' FROM bounties o WHERE b.id=o.id AND ${WHERE} RETURNING o.status`);
  const byStatus = Object.fromEntries(LIVE.map((s) => [s, rows.filter((r) => r.status === s).length])) as Record<Live, number>;
  return { cancelled: rows.length, byStatus, dryRun };
}
