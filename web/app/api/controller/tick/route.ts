import { tickBounty, type ControllerBounty, type ControllerHolder, type TickAction } from "../../../../lib/controller";
import { refundIfLive } from "../../../../lib/nessie";

export async function POST(request: Request): Promise<Response> {
  if (!process.env.INTERNAL_SECRET || request.headers.get("x-six-hops-secret") !== process.env.INTERNAL_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { ensureBountyDatabase } = await import("../../../../lib/ensure-db");
    await ensureBountyDatabase();
    const db = await import("../../../../lib/db");
    const database = await db.getDatabase();
    const actions = await tickOpen(database);
    return Response.json({ actions });
  } catch {
    return Response.json({ error: "database_unavailable" }, { status: 503 });
  }
}

async function tickOpen(pool: { query: (sql: string, values?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> }): Promise<TickAction[]> {
  const now = new Date();
  const { rows } = await pool.query("SELECT id,status,hint,hidden_hint,bounty_cents,cap_cents,controller_step,low_b_since,expires_at,nessie_poster_acct,nessie_escrow_acct FROM bounties WHERE status='open'");
  const actions: TickAction[] = [];
  for (const row of rows) {
    const holders = await pool.query(
      "SELECT id,depth,forwards,received_at,nudged_at,handle FROM holders WHERE bounty_id=$1",
      [row.id],
    );
    const poster = await pool.query("SELECT id,rail FROM holders WHERE bounty_id=$1 AND depth=0", [row.id]);
    const bounty: ControllerBounty = {
      id: String(row.id),
      status: "open",
      hint: (row.hint ?? {}) as Record<string, string>,
      hiddenHint: (row.hidden_hint ?? []) as ControllerBounty["hiddenHint"],
      bountyCents: Number(row.bounty_cents),
      capCents: Number(row.cap_cents),
      controllerStep: Number(row.controller_step) as ControllerBounty["controllerStep"],
      lowBSince: row.low_b_since ? new Date(String(row.low_b_since)).toISOString() : null,
      expiresAt: new Date(String(row.expires_at)).toISOString(),
      posterHolderId: String(poster.rows[0]?.id ?? ""),
      posterRail: (poster.rows[0]?.rail ?? "custodial") as ControllerBounty["posterRail"],
    };
    const mapped: ControllerHolder[] = holders.rows.map((holder) => ({
      id: String(holder.id),
      depth: Number(holder.depth),
      forwards: Number(holder.forwards),
      receivedAt: new Date(String(holder.received_at)).toISOString(),
      nudgedAt: holder.nudged_at ? new Date(String(holder.nudged_at)).toISOString() : null,
      handle: holder.handle == null ? null : String(holder.handle),
    }));
    const result = tickBounty(bounty, mapped, now);
    if (!result.action) continue;
    if (result.refundCents != null) {
      await refundIfLive({
        escrowId: row.nessie_escrow_acct == null ? null : String(row.nessie_escrow_acct),
        checkingId: row.nessie_poster_acct == null ? null : String(row.nessie_poster_acct),
        cents: result.refundCents,
      });
    }
    actions.push(result.action);
    await pool.query(
      "UPDATE bounties SET status=$2, hint=$3::jsonb, hidden_hint=$4::jsonb, bounty_cents=$5, controller_step=$6, low_b_since=$7 WHERE id=$1",
      [bounty.id, result.bounty.status, JSON.stringify(result.bounty.hint), JSON.stringify(result.bounty.hiddenHint), result.bounty.bountyCents, result.bounty.controllerStep, result.bounty.lowBSince],
    );
    for (const holder of result.holders) {
      if (holder.nudgedAt) await pool.query("UPDATE holders SET nudged_at=$2 WHERE id=$1 AND nudged_at IS NULL", [holder.id, holder.nudgedAt]);
    }
    for (const event of result.events) {
      await pool.query(
        "INSERT INTO events (time,bounty_id,holder_id,kind,source,detail) VALUES ($1,$2,$3,$4,'live','{}'::jsonb)",
        [now.toISOString(), bounty.id, event.holderId ?? null, event.kind],
      );
    }
    if (result.refundCents != null && result.bounty.posterHolderId) {
      await pool.query(
        "INSERT INTO payouts (bounty_id,holder_id,role,cents,rail,tx_sig) VALUES ($1,$2,'refund',$3,$4,$5) ON CONFLICT DO NOTHING",
        [bounty.id, result.bounty.posterHolderId, result.refundCents, result.bounty.posterRail, `mock_${bounty.id}`],
      );
    }
  }
  return actions;
}
