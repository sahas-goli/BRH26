// Shared contract. Change only via a CONTRACT PR.
export const H = 8;                 // max chain length (people from first recipient to target)
export const FANOUT = 3;            // max forwards per holder
export const INITIAL_SHARE = 0.6;   // bounty starts at 60% of cap; 40% is reserve

export type HintAttr = 'city' | 'organizationType' | 'field' | 'skill' | 'language' | 'experience';
// Attributes only. No name, no street address, by construction.
export interface HintCard {
  city?: string;              // city level only, e.g. "Austin, TX"
  organizationType?: 'company' | 'startup' | 'university' | 'lab' | 'nonprofit' | 'government' | 'other';
  field?: string;             // e.g. "aerospace launch operations"
  skill?: string;             // e.g. "has hand-soldered a QFN chip"
  language?: string;          // e.g. "Amharic"
  experience?: string;        // e.g. "has interned at a launch company"
}

export type BountyStatus = 'open' | 'found' | 'paid' | 'expired' | 'refunded';
export type Rail = 'custodial' | 'wallet' | 'bank';
export type EventKind =
  | 'created' | 'received' | 'opened' | 'forwarded' | 'claimed' | 'confirmed'
  | 'paid' | 'refunded' | 'expired' | 'nudged' | 'widened' | 'raised' | 'edge_memo';

export interface PublicBounty {     // what anyone with a link sees
  id: string; hint: HintCard; bountyCents: number; capCents: number;
  status: BountyStatus; expiresAt: string; ogImageUrl: string;
}
export interface HolderView {       // GET /api/h/[token]
  bounty: PublicBounty; depth: number; forwardsLeft: number; canForward: boolean;
  rail: Rail; parentLabel: string | null; talkUrl: string; claimUrl: string;
}
export interface ForwardRecipient { label: string; handle?: string } // handle = iMessage phone/email, optional
export interface ForwardResult { recipients: { label: string; link: string; delivered: 'imessage' | 'link-only' }[] }

export interface Share { holderId: string; depth: number; role: 'relay' | 'finder'; cents: number; rail: Rail }
export interface SplitResult { chainLength: number; budgetCents: number; shares: Share[]; refundCents: number }
export interface AttackComparison {
  h: number; k: number; budgetCents: number;
  ours: { honestFinder: number; withFakes: number; gainPct: number; posterPays: number };
  mit:  { honestFinder: number; withFakes: number; gainPct: number; posterPays: number };
}
export interface Stats {            // GET /api/stats
  bountyId: string; b: number | null; matureHolders: number; frontier: number;
  holders: number; maxDepth: number; p75LatencyS: number | null;
  controllerStep: 0 | 1 | 2 | 3; status: BountyStatus; asOf: string;
}
export interface GraphPayload {
  nodes: { id: string; depth: number; label: string | null; isTarget: boolean; paidCents?: number }[];
  edges: { from: string; to: string; at: string; memoSig?: string }[];
  payoutSig?: string; explorerUrl?: string; revealedSalts?: Record<string, string>;
}
