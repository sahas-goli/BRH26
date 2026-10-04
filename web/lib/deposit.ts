import { BountyError, createBounty } from "./bounty";
import type { PayoutDatabase } from "./payout";

// The deposit wallet keeps this much so it stays rent-exempt and can pay the payout fee.
export const DEPOSIT_RESERVE_LAMPORTS = 1_000_000;
export const MIN_BOUNTY_CENTS = 1000;
const USD_PER_SOL = 150;

export function depositCents(lamports: number, usdPerSol = USD_PER_SOL): number {
  const usable = Math.max(0, lamports - DEPOSIT_RESERVE_LAMPORTS);
  return Math.floor((usable * usdPerSol * 100) / 1_000_000_000);
}

export function minimumDepositSol(usdPerSol = USD_PER_SOL): number {
  const lamports = Math.ceil((MIN_BOUNTY_CENTS * 1_000_000_000) / (usdPerSol * 100)) + DEPOSIT_RESERVE_LAMPORTS;
  return Math.ceil(lamports / 1_000_000) / 1000;
}

/** Whole lamports equal to minimumDepositSol(), enough for fundDepositBounty to open. */
export function minimumDepositLamports(usdPerSol = USD_PER_SOL): number {
  return Math.round(minimumDepositSol(usdPerSol) * 1_000_000_000);
}

function fallbackHint(text: string): { experience: string } {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 80) return { experience: clean };
  const cut = clean.slice(0, 80);
  return { experience: cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : 80) };
}

export async function createDepositBounty(
  db: PayoutDatabase,
  input: unknown,
  newAccount: () => { address: string; secret: string },
): Promise<{ bountyId: string; posterToken: string; posterLink: string; depositAddress: string; minimumSol: number }> {
  const body = input && typeof input === "object" ? input as Record<string, unknown> : {};
  if (typeof body.text !== "string" || body.text.trim().length < 3 || body.text.length > 4000) throw new BountyError("invalid_input", 400);
  const hours = body.hours === undefined ? 24 : body.hours;
  const draft = { text: body.text, hint: fallbackHint(body.text), capCents: MIN_BOUNTY_CENTS, hours };
  let created;
  try {
    created = await createBounty(draft);
  } catch (error) {
    if (!(error instanceof BountyError) || error.code !== "hint_compiler_unavailable") throw error;
    created = await createBounty({ ...draft, text: undefined });
  }
  const account = newAccount();
  await db.transaction(async (tx) => {
    await tx.query("UPDATE bounties SET status='funding' WHERE id=$1 AND status='open'", [created.bountyId]);
    await tx.query(
      "UPDATE holders SET sol_address=$1, custodial_secret=$2 WHERE bounty_id=$3 AND depth=0",
      [account.address, account.secret, created.bountyId],
    );
  });
  return {
    bountyId: created.bountyId,
    posterToken: created.posterToken,
    posterLink: created.posterLink,
    depositAddress: account.address,
    minimumSol: minimumDepositSol(),
  };
}

export async function fundDepositBounty(
  db: PayoutDatabase,
  bountyId: string,
  balanceOf: (address: string) => Promise<number>,
): Promise<{ status: "open" | "funding"; bountyCents: number; minimumSol: number }> {
  const { rows } = await db.query<Record<string, unknown>>(
    "SELECT b.status, b.bounty_cents, h.sol_address FROM bounties b JOIN holders h ON h.bounty_id=b.id AND h.depth=0 WHERE b.id=$1",
    [bountyId],
  );
  const row = rows[0];
  if (!row || !row.sol_address) throw new BountyError("not_found", 404);
  if (row.status === "cancelled") throw new BountyError("closed", 410);
  if (row.status !== "funding") return { status: "open", bountyCents: Number(row.bounty_cents), minimumSol: minimumDepositSol() };
  const cents = depositCents(await balanceOf(String(row.sol_address)));
  if (cents < MIN_BOUNTY_CENTS) return { status: "funding", bountyCents: cents, minimumSol: minimumDepositSol() };
  await db.query(
    "UPDATE bounties SET cap_cents=$1, bounty_cents=$1, status='open' WHERE id=$2 AND status='funding'",
    [cents, bountyId],
  );
  return { status: "open", bountyCents: cents, minimumSol: minimumDepositSol() };
}

export async function demoFundDeposit(
  db: PayoutDatabase,
  bountyId: string,
  posterToken: string,
  sendMinimum: (address: string, lamports: number) => Promise<void>,
  balanceOf: (address: string) => Promise<number>,
): Promise<{ status: "open" | "funding"; bountyCents: number; minimumSol: number }> {
  const { rows } = await db.query<Record<string, unknown>>(
    "SELECT b.status, b.bounty_cents, b.poster_token, h.sol_address FROM bounties b JOIN holders h ON h.bounty_id=b.id AND h.depth=0 WHERE b.id=$1 AND b.poster_token=$2",
    [bountyId, posterToken],
  );
  const row = rows[0];
  if (!row || String(row.poster_token) !== posterToken) throw new BountyError("not_found", 404);
  if (row.status === "cancelled") throw new BountyError("closed", 410);
  if (row.status !== "funding") {
    return { status: "open", bountyCents: Number(row.bounty_cents), minimumSol: minimumDepositSol() };
  }
  const address = typeof row.sol_address === "string" ? row.sol_address : "";
  if (!address) throw new BountyError("not_found", 404);
  if (depositCents(await balanceOf(address)) < MIN_BOUNTY_CENTS) {
    await sendMinimum(address, minimumDepositLamports());
  }
  return fundDepositBounty(db, bountyId, balanceOf);
}

export async function devnetBalance(address: string): Promise<number> {
  const { Connection, PublicKey } = await import("@solana/web3.js");
  const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
  return connection.getBalance(new PublicKey(address), "confirmed");
}
