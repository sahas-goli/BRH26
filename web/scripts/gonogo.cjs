// ponytail: throwaway go/no-go B and D. Delete after the numbers are in PLAN.md.
const {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const fs = require("fs");
const path = require("path");

const MEMO = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

function loadEnvLocal() {
  const file = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2];
  }
}

loadEnvLocal();

const rpc = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

function redact(value) {
  return String(value).replace(/key=[^&\s]+/gi, "key=REDACTED");
}

function fundedPayer() {
  const secret = process.env.SOLANA_PAYER_SECRET;
  if (!secret) return null;
  const bs58 = require("bs58");
  const decode = typeof bs58.decode === "function" ? bs58.decode : bs58.default.decode;
  return Keypair.fromSecretKey(decode(secret));
}

async function rentAndTransfers() {
  const connection = new Connection(rpc, "confirmed");
  const rent = await connection.getMinimumBalanceForRentExemption(0);
  console.log("rent_lamports", rent);

  const payer = fundedPayer() || Keypair.generate();
  const usingTreasury = Boolean(process.env.SOLANA_PAYER_SECRET);
  let balance = await connection.getBalance(payer.publicKey);
  console.log("payer", payer.publicKey.toBase58(), "lamports", balance, "treasury", usingTreasury);
  const need = 6 * rent * 5 + 50_000;
  if (balance < need) {
    if (usingTreasury) {
      console.log("B SKIP balance below transfer cost", need);
      return false;
    }
    const airdrop = await connection.requestAirdrop(payer.publicKey, 1_000_000_000);
    await connection.confirmTransaction(airdrop, "confirmed");
    balance = await connection.getBalance(payer.publicKey);
    console.log("payer_lamports", balance);
  }
  console.log("treasury_ge_5sol", balance >= 5_000_000_000);

  const times = [];
  for (let run = 0; run < 5; run++) {
    const tx = new Transaction();
    for (let i = 0; i < 6; i++) {
      tx.add(
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: rent,
        }),
      );
    }
    tx.add(
      new TransactionInstruction({
        keys: [],
        programId: MEMO,
        data: Buffer.from("sixhops:gonogo"),
      }),
    );
    const started = Date.now();
    const sig = await sendAndConfirmTransaction(connection, tx, [payer], { commitment: "confirmed" });
    times.push(Date.now() - started);
    console.log("run", run + 1, "ms", times[run], "sig", sig);
  }
  const sorted = [...times].sort((a, b) => a - b);
  console.log("median_ms", sorted[2]);
}

async function nessie() {
  const key = process.env.NESSIE_KEY;
  if (!key) {
    console.log("D SKIP NESSIE_KEY missing");
    return false;
  }
  const base = "https://api.nessieisreal.com";
  const call = async (method, path, body) => {
    const response = await fetch(`${base}${path}?key=${encodeURIComponent(key)}`, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(redact(`${method} ${path} ${response.status} ${text}`));
    return text ? JSON.parse(text) : {};
  };
  const customer = await call("POST", "/customers", {
    first_name: "Six",
    last_name: "Hops",
    address: { street_number: "1", street_name: "College", city: "Ithaca", state: "NY", zip: "14850" },
  });
  const customerId = customer.objectCreated?._id;
  if (!customerId) throw new Error("customer id missing");
  const checking = await call("POST", `/customers/${customerId}/accounts`, {
    type: "Checking", nickname: "gonogo-checking", rewards: 0, balance: 50,
  });
  const escrow = await call("POST", `/customers/${customerId}/accounts`, {
    type: "Checking", nickname: "gonogo-escrow", rewards: 0, balance: 0,
  });
  const checkingId = checking.objectCreated?._id;
  const escrowId = escrow.objectCreated?._id;
  // Live TransferCreate requires these four fields and rejects medium and payee_id.
  await call("POST", `/accounts/${checkingId}/transfers`, {
    transaction_date: new Date().toISOString().slice(0, 10),
    status: "completed",
    amount: 10,
    description: "gonogo",
  });
  const deadline = Date.now() + 120_000;
  let moved = false;
  while (Date.now() < deadline) {
    const [from, to] = await Promise.all([
      call("GET", `/accounts/${checkingId}`),
      call("GET", `/accounts/${escrowId}`),
    ]);
    console.log("checking_balance", from.balance, "escrow_balance", to.balance);
    if (from.balance !== 50 || to.balance !== 0) {
      moved = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  console.log(moved ? "D OK balances changed" : "D FAIL balances unchanged");
  return moved;
}

rentAndTransfers()
  .then(nessie)
  .then((nessieOk) => process.exit(nessieOk ? 0 : 2))
  .catch((error) => {
    console.error(redact(error.stack || error.message || error));
    process.exit(1);
  });
