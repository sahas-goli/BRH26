import { createHash } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
export const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";

export function edgeMemo(bountyId: string, parentSalt: string, childSalt: string, at: string): string {
  const hash = createHash("sha256").update(`${parentSalt}${childSalt}${bountyId}${at}`).digest("hex");
  return `sixhops:edge:${bountyId}:${hash}`;
}

export function payMemo(bountyId: string, salts: string[]): string {
  const hash = createHash("sha256").update(salts.join("")).digest("hex");
  return `sixhops:pay:${bountyId}:${hash}`;
}

export function centsToLamports(cents: number, usdPerSol = 150): number {
  return Math.round((cents * 1_000_000_000) / (usdPerSol * 100));
}

export function explorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export interface SolShare {
  address: string;
  cents: number;
}

export function payoutPlan(bountyId: string, shares: SolShare[], salts: string[], usdPerSol = 150): {
  transfers: { to: string; lamports: number }[];
  memo: string;
} {
  return {
    transfers: shares.filter((share) => share.cents > 0).map((share) => ({
      to: share.address,
      lamports: centsToLamports(share.cents, usdPerSol),
    })),
    memo: payMemo(bountyId, salts),
  };
}

type Web3 = typeof import("@solana/web3.js");

function web3(): Web3 {
  return require("@solana/web3.js");
}

export function buildPayoutTransaction(payer: string, plan: { transfers: { to: string; lamports: number }[]; memo: string }) {
  const { PublicKey, SystemProgram, Transaction, TransactionInstruction } = web3();
  const from = new PublicKey(payer);
  const tx = new Transaction();
  for (const transfer of plan.transfers) {
    tx.add(SystemProgram.transfer({ fromPubkey: from, toPubkey: new PublicKey(transfer.to), lamports: transfer.lamports }));
  }
  tx.add(new TransactionInstruction({
    keys: [],
    programId: new PublicKey(MEMO_PROGRAM_ID),
    data: Buffer.from(plan.memo),
  }));
  return tx;
}

export function buildEdgeTransaction(memo: string) {
  const { PublicKey, Transaction, TransactionInstruction } = web3();
  const tx = new Transaction();
  tx.add(new TransactionInstruction({
    keys: [],
    programId: new PublicKey(MEMO_PROGRAM_ID),
    data: Buffer.from(memo),
  }));
  return tx;
}
