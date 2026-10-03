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

export async function releaseEscrow(client: Nessie, escrowId: string, payouts: { payeeId: string; cents: number }[]): Promise<void> {
  for (const payout of payouts) {
    await call(client, "POST", `/accounts/${escrowId}/transfers`, {
      medium: "balance", payee_id: payout.payeeId, amount: dollars(payout.cents), description: "payout",
    });
  }
}

export async function refundEscrow(client: Nessie, escrowId: string, checkingId: string, cents: number): Promise<void> {
  await call(client, "POST", `/accounts/${escrowId}/transfers`, {
    medium: "balance", payee_id: checkingId, amount: dollars(cents), description: "refund",
  });
}

export async function accountCents(client: Nessie, accountId: string): Promise<number> {
  const account = await call(client, "GET", `/accounts/${accountId}`);
  return Math.round(Number(account.balance) * 100);
}
