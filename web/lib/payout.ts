import { splitCents } from "./split";

export type Rail = "custodial" | "wallet" | "bank";
export type BountyStatus = "open" | "found" | "paid" | "expired" | "refunded";

export interface HolderRef {
  holderId: string;
  depth: number;
  rail: Rail;
}

export interface PayoutRow {
  holderId: string;
  role: "relay" | "finder" | "refund";
  cents: number;
  rail: Rail;
  txSig: string;
}

export interface Ledger {
  status: BountyStatus;
  bountyCents: number;
  capCents: number;
  hasBadge: boolean;
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
  const rows: PayoutRow[] = ordered.map((holder) => ({
    holderId: holder.holderId,
    role: holder.depth === ordered.length ? "finder" : "relay",
    cents: holder.depth === ordered.length ? split.finder : split.relay,
    rail: holder.rail,
    txSig,
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

export function applyClaim(
  ledger: Ledger,
  badgeValid: boolean | null,
  chain: HolderRef[] = [],
  bountyId = "",
): StepResult {
  if (ledger.status === "found" || ledger.status === "paid") {
    return { ledger, error: "already_claimed" };
  }
  if (ledger.status !== "open") return { ledger, error: "already_claimed" };
  if (!ledger.hasBadge) return { ledger: { ...ledger, status: "found" } };
  if (!badgeValid) return { ledger, error: "bad_code" };
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
  return { ledger: { ...ledger, status: "paid", payouts: settled.rows }, payoutSig: settled.payoutSig };
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
