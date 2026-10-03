export interface Nessie {
  baseUrl: string;
  key: string;
  fetchImpl?: typeof fetch;
}

export interface Escrow {
  customerId: string;
  checkingId: string;
  escrowId: string;
}

function dollars(cents: number): number {
  return cents / 100;
}

async function call(client: Nessie, method: string, path: string, body?: unknown): Promise<Record<string, unknown>> {
  const fetchImpl = client.fetchImpl ?? fetch;
  const response = await fetchImpl(`${client.baseUrl}${path}?key=${encodeURIComponent(client.key)}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${path} ${response.status} ${text.replace(/key=[^&\s]+/gi, "key=REDACTED")}`);
  }
  return text ? JSON.parse(text) as Record<string, unknown> : {};
}

function createdId(payload: Record<string, unknown>): string {
  const created = payload.objectCreated as { _id?: string } | undefined;
  if (!created?._id) throw new Error("nessie id missing");
  return created._id;
}

export async function openEscrow(client: Nessie, capCents: number): Promise<Escrow> {
  const customerId = createdId(await call(client, "POST", "/customers", {
    first_name: "Six",
    last_name: "Hops",
    address: { street_number: "1", street_name: "College", city: "Ithaca", state: "NY", zip: "14850" },
  }));
  const checkingId = createdId(await call(client, "POST", `/customers/${customerId}/accounts`, {
    type: "Checking", nickname: "poster-checking", rewards: 0, balance: dollars(capCents) + 50,
  }));
  const escrowId = createdId(await call(client, "POST", `/customers/${customerId}/accounts`, {
    type: "Checking", nickname: "bounty-escrow", rewards: 0, balance: 0,
  }));
  await call(client, "POST", `/accounts/${checkingId}/transfers`, {
    medium: "balance", payee_id: escrowId, amount: dollars(capCents), description: "escrow",
  });
  return { customerId, checkingId, escrowId };
}

const posted = new Map<string, { posterAccount: string; escrowAccount: string }>();

export async function createEscrow(
  client: Nessie,
  input: { bountyId: string; capCents: number; posterRail?: "bank" },
): Promise<{ posterAccount: string; escrowAccount: string }> {
  const existing = posted.get(input.bountyId);
  if (existing) return existing;
  const opened = await openEscrow(client, input.capCents);
  const accounts = { posterAccount: opened.checkingId, escrowAccount: opened.escrowId };
  posted.set(input.bountyId, accounts);
  return accounts;
}

export function liveCreateEscrow(input: { bountyId: string; capCents: number; posterRail?: "bank" }): Promise<{ posterAccount: string; escrowAccount: string }> {
  return createEscrow(liveClient(), input);
}

export async function releaseEscrow(
  client: Nessie,
  escrowId: string,
  payouts: { payeeId: string; cents: number }[],
  treasury?: { payeeId: string; cents: number },
): Promise<void> {
  for (const payout of payouts) {
    await call(client, "POST", `/accounts/${escrowId}/transfers`, {
      medium: "balance", payee_id: payout.payeeId, amount: dollars(payout.cents), description: "payout",
    });
  }
  if (treasury && treasury.cents > 0) {
    await call(client, "POST", `/accounts/${escrowId}/transfers`, {
      medium: "balance", payee_id: treasury.payeeId, amount: dollars(treasury.cents), description: "treasury",
    });
  }
}

export async function refundEscrow(client: Nessie, escrowId: string, checkingId: string, cents: number): Promise<void> {
  if (cents <= 0) return;
  await call(client, "POST", `/accounts/${escrowId}/transfers`, {
    medium: "balance", payee_id: checkingId, amount: dollars(cents), description: "refund",
  });
}

export async function payFromEscrow(client: Nessie, input: {
  escrowId: string;
  checkingId: string;
  bank: { payeeId: string; cents: number }[];
  treasuryId?: string;
  treasuryCents: number;
  refundCents: number;
}): Promise<void> {
  await releaseEscrow(
    client,
    input.escrowId,
    input.bank,
    input.treasuryId && input.treasuryCents > 0 ? { payeeId: input.treasuryId, cents: input.treasuryCents } : undefined,
  );
  await refundEscrow(client, input.escrowId, input.checkingId, input.refundCents);
}

export function liveClient(): Nessie {
  const key = process.env.NESSIE_KEY;
  if (!key) throw new Error("nessie_unavailable");
  return { baseUrl: process.env.NESSIE_BASE_URL || "https://api.nessieisreal.com", key };
}

export async function refundIfLive(accounts: { escrowId: string | null; checkingId: string | null; cents: number }, client?: Nessie): Promise<void> {
  if (process.env.NESSIE_MODE !== "live") return;
  if (!accounts.escrowId || !accounts.checkingId) throw new Error("nessie_unavailable");
  await refundEscrow(client ?? liveClient(), accounts.escrowId, accounts.checkingId, accounts.cents);
}

export async function accountCents(client: Nessie, accountId: string): Promise<number> {
  const account = await call(client, "GET", `/accounts/${accountId}`);
  return Math.round(Number(account.balance) * 100);
}
