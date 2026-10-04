import { depthCents, splitCents } from "./split";
import { explorerUrl, validSolanaAddress } from "./solana";

export type Rail = "custodial" | "wallet" | "bank";
export type BountyStatus = "open" | "found" | "paid" | "expired" | "refunded";

export interface HolderRef {
  holderId: string;
  depth: number;
  rail: Rail;
  solAddress?: string;
  nessieAcct?: string;
}

export interface PayoutRow {
  holderId: string;
  role: "relay" | "finder" | "refund";
  cents: number;
  rail: Rail;
  txSig: string;
  solAddress?: string;
  nessieAcct?: string;
}

export interface Ledger {
  status: BountyStatus;
  bountyCents: number;
  capCents: number;
  posterHolderId: string;
  posterRail: Rail;
  payouts: PayoutRow[];
}

export interface StepResult {
  ledger: Ledger;
  error?: "already_claimed" | "bad_code";
  payoutSig?: string;
  idempotent?: boolean;
}

// PAYOUT_MODE=mock. S2-05 replaces the signature when devnet payout exists.
export function settleChain(
  bountyId: string,
  chain: HolderRef[],
  bountyCents: number,
  capCents: number,
  posterHolderId: string,
  posterRail: Rail,
  existing: PayoutRow[],
): { payoutSig: string; rows: PayoutRow[] } | null {
  const ordered = [...chain].sort((a, b) => a.depth - b.depth);
  if (ordered.some((holder, index) => holder.depth !== index + 1)) return null;
  const split = splitCents(ordered.length, bountyCents);
  if (!split) return null;
  if (existing.length > 0) return { payoutSig: existing[0].txSig, rows: existing };
  const txSig = `mock_${bountyId}`;
  const hops = ordered.length;
  const rows: PayoutRow[] = ordered.map((holder) => ({
    holderId: holder.holderId,
    role: holder.depth === hops ? "finder" : "relay",
    cents: depthCents(split, holder.depth, hops),
    rail: holder.rail,
    txSig,
    solAddress: holder.solAddress,
    nessieAcct: holder.nessieAcct,
  }));
  rows.push({
    holderId: posterHolderId,
    role: "refund",
    cents: capCents - bountyCents,
    rail: posterRail,
    txSig,
  });
  return { payoutSig: txSig, rows };
}

export function applyClaim(ledger: Ledger): StepResult {
  if (ledger.status === "found" || ledger.status === "paid") {
    return { ledger, error: "already_claimed" };
  }
  if (ledger.status !== "open") return { ledger, error: "already_claimed" };
  return { ledger: { ...ledger, status: "found" } };
}

export function applyConfirm(ledger: Ledger, chain: HolderRef[], accept: boolean, bountyId: string): StepResult {
  if (ledger.status === "paid") {
    return { ledger, payoutSig: ledger.payouts[0]?.txSig ?? `mock_${bountyId}`, idempotent: true };
  }
  if (ledger.status !== "found") return { ledger, error: "already_claimed" };
  if (!accept) return { ledger: { ...ledger, status: "open" } };
  const settled = settleChain(
    bountyId,
    chain,
    ledger.bountyCents,
    ledger.capCents,
    ledger.posterHolderId,
    ledger.posterRail,
    ledger.payouts,
  );
  if (!settled) return { ledger, error: "bad_code" };
  return {
    ledger: { ...ledger, status: "paid", payouts: settled.rows },
    payoutSig: settled.payoutSig,
    idempotent: false,
  };
}

export interface PayoutQuery {
  query<T extends Record<string, unknown>>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
}

export interface PayoutDatabase extends PayoutQuery {
  transaction<T>(work: (tx: PayoutQuery) => Promise<T>): Promise<T>;
}

export class PayoutError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
    this.name = "PayoutError";
  }
}

function body(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new PayoutError("invalid_input", 400);
  return input as Record<string, unknown>;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new PayoutError("invalid_input", 400);
  return value.trim();
}

async function chainFrom(tx: PayoutQuery, holderId: string): Promise<HolderRef[]> {
  const chain: HolderRef[] = [];
  let id: string | null = holderId;
  while (id) {
    const result: { rows: Record<string, unknown>[] } = await tx.query(
      "SELECT id,parent_id,depth,rail,sol_address,nessie_acct FROM holders WHERE id=$1",
      [id],
    );
    const row = result.rows[0];
    if (!row) break;
    const depth = Number(row.depth);
    if (depth >= 1) {
      chain.push({
        holderId: String(row.id),
        depth,
        rail: row.rail as Rail,
        solAddress: row.sol_address == null ? undefined : String(row.sol_address),
        nessieAcct: row.nessie_acct == null ? undefined : String(row.nessie_acct),
      });
    }
    id = row.parent_id == null ? null : String(row.parent_id);
    if (depth === 0) break;
  }
  return chain.sort((a, b) => a.depth - b.depth);
}

async function ensureCustodial(tx: PayoutQuery, chain: HolderRef[]): Promise<void> {
  if (process.env.PAYOUT_MODE !== "devnet") return;
  const { newCustodialAccount } = await import("./solana");
  for (const holder of chain) {
    if (holder.rail === "bank" || holder.solAddress) continue;
    if (holder.rail === "wallet") throw new PayoutError("payout_unavailable", 503);
    const created = newCustodialAccount();
    await tx.query(
      "UPDATE holders SET sol_address=$1, custodial_secret=$2 WHERE id=$3 AND sol_address IS NULL",
      [created.address, created.secret, holder.holderId],
    );
    holder.solAddress = created.address;
  }
}

async function writePayouts(tx: PayoutQuery, bountyId: string, rows: PayoutRow[]): Promise<void> {
  for (const row of rows) {
    await tx.query(
      "INSERT INTO payouts (bounty_id,holder_id,role,cents,rail,tx_sig) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
      [bountyId, row.holderId, row.role, row.cents, row.rail, row.txSig],
    );
  }
}

async function loadPayouts(tx: PayoutQuery, bountyId: string): Promise<PayoutRow[]> {
  const { rows } = await tx.query<Record<string, unknown>>(
    "SELECT holder_id,role,cents,rail,tx_sig FROM payouts WHERE bounty_id=$1",
    [bountyId],
  );
  return rows.map((row) => ({
    holderId: String(row.holder_id),
    role: row.role as PayoutRow["role"],
    cents: Number(row.cents),
    rail: row.rail as Rail,
    txSig: String(row.tx_sig),
  }));
}

function ledgerFrom(bounty: Record<string, unknown>, poster: Record<string, unknown>, payouts: PayoutRow[]): Ledger {
  return {
    status: bounty.status as BountyStatus,
    bountyCents: Number(bounty.bounty_cents),
    capCents: Number(bounty.cap_cents),
    posterHolderId: String(poster.id),
    posterRail: poster.rail as Rail,
    payouts,
  };
}

async function logEvent(tx: PayoutQuery, at: string, bountyId: string, holder: Record<string, unknown>, kind: string, detail: unknown): Promise<void> {
  await tx.query(
    "INSERT INTO events (time,bounty_id,holder_id,parent_id,depth,kind,latency_s,source,detail) VALUES ($1,$2,$3,$4,$5,$6,NULL,'live',$7::jsonb)",
    [at, bountyId, holder.id, holder.parent_id ?? null, holder.depth, kind, JSON.stringify(detail)],
  );
}

// payerSecret is the bounty's deposit wallet; without it the treasury pays.
export type SignPayout = (input: { bountyId: string; rows: PayoutRow[]; payerSecret?: string }) => Promise<string>;

async function stamp(bountyId: string, rows: PayoutRow[], sign?: SignPayout, payerSecret?: string): Promise<PayoutRow[]> {
  const solRows = rows.filter((row) => row.role !== "refund" && row.rail !== "bank");
  if (process.env.PAYOUT_MODE !== "devnet" || solRows.length === 0) return rows;
  if (!sign) throw new PayoutError("payout_unavailable", 503);
  const signature = await sign({ bountyId, rows: solRows, ...(payerSecret ? { payerSecret } : {}) });
  return rows.map((row) => ({ ...row, txSig: signature }));
}

export type BankMove = {
  escrowId: string;
  checkingId: string;
  bank: { payeeId: string; cents: number }[];
  treasuryCents: number;
  refundCents: number;
};

export type MoveBank = (input: BankMove) => Promise<void>;

async function moveLiveBank(bounty: Record<string, unknown>, rows: PayoutRow[], move?: MoveBank): Promise<void> {
  if (process.env.NESSIE_MODE !== "live") return;
  if (!move) throw new PayoutError("nessie_unavailable", 503);
  const escrowId = bounty.nessie_escrow_acct == null ? "" : String(bounty.nessie_escrow_acct);
  const checkingId = bounty.nessie_poster_acct == null ? "" : String(bounty.nessie_poster_acct);
  if (!escrowId || !checkingId) throw new PayoutError("nessie_unavailable", 503);
  const bank = rows.filter((row) => row.role !== "refund" && row.rail === "bank").map((row) => {
    if (!row.nessieAcct) throw new PayoutError("nessie_unavailable", 503);
    return { payeeId: row.nessieAcct, cents: row.cents };
  });
  const treasuryCents = rows.filter((row) => row.role !== "refund" && row.rail !== "bank").reduce((sum, row) => sum + row.cents, 0);
  const refundCents = rows.filter((row) => row.role === "refund").reduce((sum, row) => sum + row.cents, 0);
  await move({ escrowId, checkingId, bank, treasuryCents, refundCents });
}

export function envBank(): MoveBank | undefined {
  if (process.env.NESSIE_MODE !== "live") return undefined;
  return async (input) => {
    if (!process.env.NESSIE_KEY) throw new PayoutError("nessie_unavailable", 503);
    const { liveClient, payFromEscrow } = await import("./nessie");
    await payFromEscrow(liveClient(), { ...input, treasuryId: process.env.NESSIE_TREASURY_ACCT });
  };
}

export function envSigner(): SignPayout | undefined {
  if (process.env.PAYOUT_MODE !== "devnet") return undefined;
  return async (input) => {
    if (!input.payerSecret && !process.env.SOLANA_PAYER_SECRET) throw new PayoutError("payout_unavailable", 503);
    const { signDevnetPayout } = await import("./solana");
    return signDevnetPayout(input);
  };
}

function paidBody(payoutSig?: string): { status: "paid"; payoutSig?: string; explorerUrl?: string } {
  if (!payoutSig) return { status: "paid" };
  return { status: "paid", payoutSig, explorerUrl: explorerUrl(payoutSig) };
}

type PayContext = {
  bountyId: string;
  bounty: Record<string, unknown>;
  poster: Record<string, unknown>;
  rows: PayoutRow[];
};

async function finishDevnet(
  db: PayoutDatabase,
  pay: PayContext,
  opts: { signPayout?: SignPayout; moveBank?: MoveBank },
): Promise<{ status: "paid"; payoutSig?: string; explorerUrl?: string }> {
  const depositSecret = pay.poster.custodial_secret == null ? undefined : String(pay.poster.custodial_secret);
  const stamped = await stamp(pay.bountyId, pay.rows, opts.signPayout, depositSecret);
  await moveLiveBank(pay.bounty, stamped, opts.moveBank);
  const signature = stamped[0]?.txSig ?? "";
  await db.transaction(async (tx) => {
    await tx.query("UPDATE payouts SET tx_sig=$1 WHERE bounty_id=$2", [signature, pay.bountyId]);
    await tx.query("UPDATE bounties SET status=$1 WHERE id=$2", ["paid", pay.bountyId]);
    await logEvent(tx, new Date().toISOString(), pay.bountyId, pay.poster, "paid", {});
  });
  return paidBody(signature);
}

export async function claimBounty(
  db: PayoutDatabase,
  input: unknown,
  opts: { now?: () => Date } = {},
): Promise<{ status: "found" }> {
  const parsed = body(input);
  const token = requiredString(parsed.token);
  const introMessage = requiredString(parsed.introMessage);
  const solAddress = parsed.solAddress === undefined || parsed.solAddress === "" ? undefined : requiredString(parsed.solAddress);
  if (solAddress && !validSolanaAddress(solAddress)) throw new PayoutError("invalid_wallet", 400);
  const outcome = await db.transaction(async (tx) => {
    const lookup = await tx.query<Record<string, unknown>>("SELECT bounty_id FROM holders WHERE token=$1", [token]);
    const bountyId = lookup.rows[0]?.bounty_id;
    if (!bountyId) throw new PayoutError("not_found", 404);
    const lockedBounty = await tx.query<Record<string, unknown>>(
      "SELECT id,status,bounty_cents,cap_cents,expires_at,nessie_poster_acct,nessie_escrow_acct FROM bounties WHERE id=$1 FOR UPDATE",
      [bountyId],
    );
    const bounty = lockedBounty.rows[0];
    const lockedHolder = await tx.query<Record<string, unknown>>(
      "SELECT id,parent_id,depth,rail FROM holders WHERE token=$1 FOR UPDATE",
      [token],
    );
    const holder = lockedHolder.rows[0];
    if (!bounty || !holder) throw new PayoutError("not_found", 404);
    const at = opts.now?.() ?? new Date();
    if (bounty.status === "found" || bounty.status === "paid") throw new PayoutError("already_claimed", 409);
    if (bounty.status !== "open" || new Date(String(bounty.expires_at)).getTime() <= at.getTime()) {
      throw new PayoutError("closed", 410);
    }
    const posters = await tx.query<Record<string, unknown>>(
      "SELECT id,rail FROM holders WHERE bounty_id=$1 AND depth=0",
      [bountyId],
    );
    const poster = posters.rows[0];
    if (!poster) throw new PayoutError("not_found", 404);
    const step = applyClaim(ledgerFrom(bounty, poster, []));
    if (step.error) throw new PayoutError(step.error, 409);
    if (solAddress) {
      await tx.query("UPDATE holders SET rail='wallet', sol_address=$1, custodial_secret=NULL WHERE id=$2", [solAddress, holder.id]);
    }
    await logEvent(tx, at.toISOString(), String(bountyId), holder, "claimed", { introMessage });
    await tx.query("UPDATE bounties SET status=$1 WHERE id=$2", ["found", bountyId]);
    return { result: { status: "found" as const } };
  });
  return outcome.result!;
}

export async function confirmBounty(
  db: PayoutDatabase,
  input: unknown,
  opts: { signPayout?: SignPayout; moveBank?: MoveBank } = {},
): Promise<{ status: string; payoutSig?: string; explorerUrl?: string }> {
  const parsed = body(input);
  const bountyId = requiredString(parsed.bountyId);
  const posterToken = requiredString(parsed.posterToken);
  const accept = parsed.accept;
  if (typeof accept !== "boolean") throw new PayoutError("invalid_input", 400);
  const outcome = await db.transaction(async (tx) => {
    const locked = await tx.query<Record<string, unknown>>(
      "SELECT id,status,bounty_cents,cap_cents,expires_at,nessie_poster_acct,nessie_escrow_acct FROM bounties WHERE id=$1 AND poster_token=$2 FOR UPDATE",
      [bountyId, posterToken],
    );
    const bounty = locked.rows[0];
    if (!bounty) throw new PayoutError("not_found", 404);
    if (bounty.status === "paid") {
      const sigs = await tx.query<Record<string, unknown>>("SELECT tx_sig FROM payouts WHERE bounty_id=$1 LIMIT 1", [bountyId]);
      const existing = sigs.rows[0]?.tx_sig ? String(sigs.rows[0].tx_sig) : "";
      if (existing) return { result: paidBody(existing) };
    }
    const posters = await tx.query<Record<string, unknown>>(
      "SELECT id,parent_id,depth,rail,custodial_secret FROM holders WHERE bounty_id=$1 AND depth=0",
      [bountyId],
    );
    const poster = posters.rows[0];
    if (!poster) throw new PayoutError("not_found", 404);
    const claimed = await tx.query<Record<string, unknown>>(
      "SELECT holder_id FROM events WHERE bounty_id=$1 AND kind='claimed' ORDER BY time DESC LIMIT 1",
      [bountyId],
    );
    const finderId = claimed.rows[0]?.holder_id ? String(claimed.rows[0].holder_id) : "";
    const chain = finderId ? await chainFrom(tx, finderId) : [];
    await ensureCustodial(tx, chain);
    const step = applyConfirm(ledgerFrom(bounty, poster, await loadPayouts(tx, bountyId)), chain, accept, bountyId);
    if (step.error) throw new PayoutError("not_claimed", 409);
    const at = new Date().toISOString();
    if (!accept) {
      await tx.query("UPDATE bounties SET status=$1 WHERE id=$2", ["open", bountyId]);
      await logEvent(tx, at, bountyId, poster, "confirmed", { rejected: true });
      return { result: { status: "open" } };
    }
    if (process.env.PAYOUT_MODE === "devnet") {
      await writePayouts(tx, bountyId, step.ledger.payouts.map((row) => ({ ...row, txSig: "" })));
      return { pay: { bountyId, bounty, poster, rows: step.ledger.payouts } };
    }
    const stamped = await stamp(bountyId, step.ledger.payouts, opts.signPayout);
    await moveLiveBank(bounty, stamped, opts.moveBank);
    await writePayouts(tx, bountyId, stamped);
    await tx.query("UPDATE bounties SET status=$1 WHERE id=$2", ["paid", bountyId]);
    await logEvent(tx, at, bountyId, poster, "paid", {});
    return { result: paidBody(stamped[0]?.txSig ?? step.payoutSig) };
  });
  if ("pay" in outcome && outcome.pay) return finishDevnet(db, outcome.pay, opts);
  return outcome.result!;
}
