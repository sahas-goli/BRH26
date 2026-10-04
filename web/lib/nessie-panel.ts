import type { BountyStatus } from "./types";

/** Poster checking is funded with the cap plus $50, then the payable reward sits in escrow. */
const CHECKING_CUSHION_CENTS = 5000;

/** Replay featured bounty (`r_0000`): cap $20, payable reward $16. */
export const FEATURED_PANEL_CENTS = { capCents: 2000, bountyCents: 1600 };

export type NessiePanelBounty = {
  capCents: number;
  bountyCents: number;
  status: BountyStatus | string;
};

export type NessiePanel = {
  available: boolean;
  checkingCents: number;
  escrowCents: number;
  status: string;
  note: string;
};

export function nessiePanel(bounty: NessiePanelBounty | null, fallbackStatus?: string): NessiePanel {
  if (!bounty) {
    return {
      available: false,
      checkingCents: 0,
      escrowCents: 0,
      status: fallbackStatus ?? "—",
      note: "Balances unavailable until a featured bounty loads.",
    };
  }
  const status = bounty.status;
  const settled = status === "paid" || status === "refunded";
  const reserve = Math.max(0, bounty.capCents - bounty.bountyCents);
  const escrowCents = settled ? 0 : bounty.bountyCents;
  const checkingCents = CHECKING_CUSHION_CENTS + reserve;
  const note = escrowCents > 0
    ? "Escrow is holding the reward until the poster accepts."
    : "Checking holds the remaining balance.";
  return { available: true, checkingCents, escrowCents, status, note };
}
