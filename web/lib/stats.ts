import type { DbQuery } from "./db";
import { explorerUrl } from "./solana";
import type { BountyStatus, GraphPayload, Stats } from "./types";

const DEFAULT_P75_SECONDS = 600;

export async function p75LatencySeconds(db: DbQuery, bountyId: string): Promise<number | null> {
  try {
    const { rows } = await db.query<{ p75: string | number | null }>(
      `SELECT approx_percentile(0.75, rollup(latency)) AS p75
       FROM bounty_minute WHERE bounty_id = $1`,
      [bountyId],
    );
    const value = rows[0]?.p75;
    if (value == null) return null;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
  } catch {
    // VERIFY E / no toolkit: fall back to raw percentile_cont, then the 600s default upstream.
    try {
      const { rows } = await db.query<{ p75: string | number | null }>(
        `SELECT percentile_cont(0.75) WITHIN GROUP (ORDER BY latency_s) AS p75
         FROM events
         WHERE bounty_id = $1 AND kind = 'forwarded' AND latency_s IS NOT NULL`,
        [bountyId],
      );
      const value = rows[0]?.p75;
      if (value == null) return null;
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }
}

export async function matureBranching(
  db: DbQuery,
  bountyId: string,
  p75Seconds: number,
): Promise<{ mature: number; fwd: number; b: number | null }> {
  const { rows } = await db.query<{ mature: string; fwd: string; b: string | null }>(
    `SELECT count(*) AS mature, coalesce(sum(forwards), 0) AS fwd,
            sum(forwards)::float / nullif(count(*), 0) AS b
     FROM holders
     WHERE bounty_id = $1 AND depth >= 1
       AND received_at < now() - make_interval(secs => $2)`,
    [bountyId, p75Seconds],
  );
  const row = rows[0];
  const mature = Number(row?.mature ?? 0);
  const fwd = Number(row?.fwd ?? 0);
  const b = row?.b == null ? null : Number(row.b);
  return { mature, fwd, b: b != null && Number.isFinite(b) ? b : null };
}

export async function frontierCount(db: DbQuery, bountyId: string): Promise<number> {
  const { rows } = await db.query<{ n: string }>(
    `SELECT count(*)::int AS n FROM holders
     WHERE bounty_id = $1 AND forwards < 3 AND depth < 8
       AND received_at > now() - INTERVAL '6 hours'`,
    [bountyId],
  );
  return Number(rows[0]?.n ?? 0);
}

export function assembleStats(input: {
  bountyId: string;
  status: BountyStatus;
  controllerStep: number;
  holders: number;
  maxDepth: number;
  matureHolders: number;
  frontier: number;
  b: number | null;
  p75LatencyS: number | null;
  asOf?: string;
}): Stats {
  const step = Math.min(3, Math.max(0, input.controllerStep)) as 0 | 1 | 2 | 3;
  return {
    bountyId: input.bountyId,
    b: input.b,
    matureHolders: input.matureHolders,
    frontier: input.frontier,
    holders: input.holders,
    maxDepth: input.maxDepth,
    p75LatencyS: input.p75LatencyS,
    controllerStep: step,
    status: input.status,
    asOf: input.asOf ?? new Date().toISOString(),
  };
}

export async function loadStats(db: DbQuery, bountyId: string): Promise<Stats | null> {
  const bounty = await db.query<{
    id: string;
    status: BountyStatus;
    controller_step: number;
  }>("SELECT id, status, controller_step FROM bounties WHERE id = $1", [bountyId]);
  if (!bounty.rows[0]) return null;

  const p75LatencyS = await p75LatencySeconds(db, bountyId);
  // Use measured p75 when present; maturity window uses the same default as the controller.
  const maturityWindow = p75LatencyS ?? DEFAULT_P75_SECONDS;
  const branching = await matureBranching(db, bountyId, maturityWindow);
  const frontier = await frontierCount(db, bountyId);
  const counts = await db.query<{ holders: string; max_depth: string | null }>(
    `SELECT count(*)::int AS holders, coalesce(max(depth), 0)::int AS max_depth
     FROM holders WHERE bounty_id = $1`,
    [bountyId],
  );

  return assembleStats({
    bountyId,
    status: bounty.rows[0].status,
    controllerStep: bounty.rows[0].controller_step,
    holders: Number(counts.rows[0]?.holders ?? 0),
    maxDepth: Number(counts.rows[0]?.max_depth ?? 0),
    matureHolders: branching.mature,
    frontier,
    b: branching.b,
    p75LatencyS,
  });
}

export function assembleGraph(input: {
  status: BountyStatus;
  holders: {
    id: string;
    parent_id: string | null;
    depth: number;
    label: string | null;
    salt: string;
    received_at: string | Date;
  }[];
  payouts: { holder_id: string; cents: number; role: string; tx_sig: string | null }[];
  claimedHolderId: string | null;
  edgeMemos: { holder_id: string | null; parent_id: string | null; memoSig: string | null; at: string | Date }[];
}): GraphPayload {
  const paidByHolder = new Map<string, number>();
  let payoutSig: string | undefined;
  for (const row of input.payouts) {
    if (row.role === "refund") continue;
    paidByHolder.set(row.holder_id, row.cents);
    if (row.tx_sig) payoutSig = row.tx_sig;
  }

  const memoByChild = new Map<string, string>();
  for (const edge of input.edgeMemos) {
    if (edge.holder_id && edge.memoSig) memoByChild.set(edge.holder_id, edge.memoSig);
  }

  const nodes = input.holders.map((holder) => {
    const paidCents = paidByHolder.get(holder.id);
    return {
      id: holder.id,
      depth: holder.depth,
      label: holder.label,
      isTarget: holder.id === input.claimedHolderId,
      ...(paidCents != null ? { paidCents } : {}),
    };
  });

  const edges = input.holders
    .filter((holder) => holder.parent_id)
    .map((holder) => ({
      from: holder.parent_id as string,
      to: holder.id,
      at: new Date(holder.received_at).toISOString(),
      ...(memoByChild.has(holder.id) ? { memoSig: memoByChild.get(holder.id) } : {}),
    }));

  const payload: GraphPayload = { nodes, edges };
  if (payoutSig) {
    payload.payoutSig = payoutSig;
    payload.explorerUrl = explorerUrl(payoutSig);
  }
  if (input.status === "paid") {
    const byId = new Map(input.holders.map((holder) => [holder.id, holder]));
    const revealedSalts: Record<string, string> = {};
    let cursor = input.claimedHolderId;
    while (cursor && byId.has(cursor)) {
      const holder = byId.get(cursor)!;
      revealedSalts[holder.id] = holder.salt;
      cursor = holder.parent_id;
    }
    // Paid relays without a claimed event still reveal their salts.
    for (const holderId of paidByHolder.keys()) {
      const holder = byId.get(holderId);
      if (holder) revealedSalts[holder.id] = holder.salt;
    }
    payload.revealedSalts = revealedSalts;
  }
  return payload;
}

export async function loadGraph(db: DbQuery, bountyId: string): Promise<GraphPayload | null> {
  const bounty = await db.query<{ status: BountyStatus }>(
    "SELECT status FROM bounties WHERE id = $1",
    [bountyId],
  );
  if (!bounty.rows[0]) return null;

  const holders = await db.query<{
    id: string;
    parent_id: string | null;
    depth: number;
    label: string | null;
    salt: string;
    received_at: string | Date;
  }>(
    `SELECT id, parent_id, depth, label, salt, received_at
     FROM holders WHERE bounty_id = $1 ORDER BY depth ASC, received_at ASC`,
    [bountyId],
  );

  const payouts = await db.query<{
    holder_id: string;
    cents: number;
    role: string;
    tx_sig: string | null;
  }>("SELECT holder_id, cents, role, tx_sig FROM payouts WHERE bounty_id = $1", [bountyId]);

  const claimed = await db.query<{ holder_id: string | null }>(
    `SELECT holder_id FROM events
     WHERE bounty_id = $1 AND kind = 'claimed'
     ORDER BY time DESC LIMIT 1`,
    [bountyId],
  );

  const memos = await db.query<{
    holder_id: string | null;
    parent_id: string | null;
    detail: { memoSig?: string } | null;
    time: string | Date;
  }>(
    `SELECT holder_id, parent_id, detail, time
     FROM events
     WHERE bounty_id = $1 AND kind = 'edge_memo'`,
    [bountyId],
  );

  return assembleGraph({
    status: bounty.rows[0].status,
    holders: holders.rows,
    payouts: payouts.rows,
    claimedHolderId: claimed.rows[0]?.holder_id ?? null,
    edgeMemos: memos.rows.map((row) => ({
      holder_id: row.holder_id,
      parent_id: row.parent_id,
      memoSig: row.detail?.memoSig ?? null,
      at: row.time,
    })),
  });
}

export function resolveStatsBountyId(queryBounty: string | null, featured = process.env.FEATURED_BOUNTY): string | null {
  const id = (queryBounty || featured || "").trim();
  return id || null;
}

export { DEFAULT_P75_SECONDS };
