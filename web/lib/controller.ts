export type Rail = "custodial" | "wallet" | "bank";

export interface HiddenHint {
  attr: string;
  value: string;
}

export interface ControllerBounty {
  id: string;
  status: "open" | "found" | "paid" | "expired" | "refunded";
  hint: Record<string, string>;
  hiddenHint: HiddenHint[];
  bountyCents: number;
  capCents: number;
  controllerStep: 0 | 1 | 2 | 3;
  lowBSince: string | null;
  expiresAt: string;
  posterHolderId: string;
  posterRail: Rail;
}

export interface ControllerHolder {
  id: string;
  depth: number;
  forwards: number;
  receivedAt: string;
  nudgedAt: string | null;
  handle: string | null;
}

export interface Nudge {
  handle: string;
  text: string;
}

export interface TickAction {
  bountyId: string;
  step: 0 | 1 | 2 | 3;
  kind: "healthy" | "armed" | "nudged" | "widened" | "raised" | "refunded";
  nudge?: Nudge[];
}

export interface TickResult {
  bounty: ControllerBounty;
  holders: ControllerHolder[];
  action: TickAction | null;
  events: { kind: string; holderId?: string }[];
  refundCents: number | null;
}

const TEN_MINUTES_MS = 10 * 60 * 1000;
const NUDGE_TEXT = "This search is stalling. Pass it to someone closer if you can.";

export function branchingFactor(holders: ControllerHolder[], now: Date, p75Seconds: number): number | null {
  const cutoff = now.getTime() - p75Seconds * 1000;
  const mature = holders.filter((holder) => holder.depth >= 1 && Date.parse(holder.receivedAt) < cutoff);
  if (mature.length === 0) return null;
  return mature.reduce((sum, holder) => sum + holder.forwards, 0) / mature.length;
}

export function tickBounty(
  bounty: ControllerBounty,
  holders: ControllerHolder[],
  now: Date,
  p75Seconds = 600,
): TickResult {
  const nextHolders = holders.map((holder) => ({ ...holder }));
  const next: ControllerBounty = {
    ...bounty,
    hint: { ...bounty.hint },
    hiddenHint: bounty.hiddenHint.map((hint) => ({ ...hint })),
  };
  if (next.status !== "open") return { bounty: next, holders: nextHolders, action: null, events: [], refundCents: null };
  if (Date.parse(next.expiresAt) <= now.getTime()) return refund(next, nextHolders);

  const b = branchingFactor(nextHolders, now, p75Seconds);
  if (b === null || b >= 2) {
    next.lowBSince = null;
    return {
      bounty: next,
      holders: nextHolders,
      action: { bountyId: next.id, step: next.controllerStep, kind: "healthy" },
      events: [],
      refundCents: null,
    };
  }
  if (next.lowBSince === null) {
    next.lowBSince = now.toISOString();
    return {
      bounty: next,
      holders: nextHolders,
      action: { bountyId: next.id, step: next.controllerStep, kind: "armed" },
      events: [],
      refundCents: null,
    };
  }
  if (now.getTime() - Date.parse(next.lowBSince) < TEN_MINUTES_MS || next.controllerStep >= 3) {
    return { bounty: next, holders: nextHolders, action: null, events: [], refundCents: null };
  }

  next.controllerStep = (next.controllerStep + 1) as 1 | 2 | 3;
  next.lowBSince = now.toISOString();
  if (next.controllerStep === 1) return nudge(next, nextHolders, now, p75Seconds);
  if (next.controllerStep === 2) return widen(next, nextHolders);
  return raise(next, nextHolders);
}

function nudge(bounty: ControllerBounty, holders: ControllerHolder[], now: Date, p75Seconds: number): TickResult {
  const cutoff = now.getTime() - p75Seconds * 1000;
  const nudges: Nudge[] = [];
  const events: { kind: string; holderId?: string }[] = [];
  for (const holder of holders) {
    if (holder.forwards !== 0 || holder.nudgedAt || !holder.handle) continue;
    if (Date.parse(holder.receivedAt) >= cutoff) continue;
    holder.nudgedAt = now.toISOString();
    nudges.push({ handle: holder.handle, text: NUDGE_TEXT });
    events.push({ kind: "nudged", holderId: holder.id });
  }
  return {
    bounty,
    holders,
    action: { bountyId: bounty.id, step: bounty.controllerStep, kind: "nudged", nudge: nudges },
    events,
    refundCents: null,
  };
}

function widen(bounty: ControllerBounty, holders: ControllerHolder[]): TickResult {
  const next = bounty.hiddenHint.shift();
  if (next) bounty.hint[next.attr] = next.value;
  return {
    bounty,
    holders,
    action: { bountyId: bounty.id, step: bounty.controllerStep, kind: "widened" },
    events: [{ kind: "widened" }],
    refundCents: null,
  };
}

function raise(bounty: ControllerBounty, holders: ControllerHolder[]): TickResult {
  const increase = Math.round(bounty.capCents * 0.2);
  const events: { kind: string }[] = [];
  if (bounty.bountyCents + increase <= bounty.capCents) {
    bounty.bountyCents += increase;
    events.push({ kind: "raised" });
  }
  return {
    bounty,
    holders,
    action: { bountyId: bounty.id, step: bounty.controllerStep, kind: "raised" },
    events,
    refundCents: null,
  };
}

function refund(bounty: ControllerBounty, holders: ControllerHolder[]): TickResult {
  bounty.status = "refunded";
  return {
    bounty,
    holders,
    action: { bountyId: bounty.id, step: bounty.controllerStep, kind: "refunded" },
    events: [{ kind: "expired" }, { kind: "refunded" }],
    refundCents: bounty.capCents,
  };
}
