import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { test } from "node:test";
import { accountCents, openEscrow, refundEscrow, releaseEscrow, type Nessie } from "./nessie";

test("escrow, payout, and refund move both balances", async () => {
  const { baseUrl, close } = await fakeNessie();
  const client: Nessie = { baseUrl, key: "test-key" };
  try {
    const escrow = await openEscrow(client, 1000);
    assert.equal(await accountCents(client, escrow.checkingId), 5000);
    assert.equal(await accountCents(client, escrow.escrowId), 1000);

    const holderId = "holder-1";
    await releaseEscrow(client, escrow.escrowId, [{ payeeId: holderId, cents: 400 }]);
    assert.equal(await accountCents(client, escrow.escrowId), 600);
    assert.equal(await accountCents(client, holderId), 400);

    await refundEscrow(client, escrow.escrowId, escrow.checkingId, 600);
    assert.equal(await accountCents(client, escrow.escrowId), 0);
    assert.equal(await accountCents(client, escrow.checkingId), 5600);
  } finally {
    await close();
  }
});

function fakeNessie(): Promise<{ baseUrl: string; close: () => Promise<void> }> {
  const balances = new Map<string, number>([["holder-1", 0]]);
  let next = 0;
  const server: Server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const chunks: Buffer[] = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
      const parts = url.pathname.split("/").filter(Boolean);
      let payload: unknown = {};
      if (request.method === "POST" && parts[0] === "customers" && parts.length === 1) {
        payload = { objectCreated: { _id: "cust" } };
      } else if (request.method === "POST" && parts[2] === "accounts") {
        const id = `acct-${next++}`;
        balances.set(id, body.balance);
        payload = { objectCreated: { _id: id } };
      } else if (request.method === "POST" && parts[2] === "transfers") {
        const from = parts[1];
        balances.set(from, (balances.get(from) ?? 0) - body.amount);
        balances.set(body.payee_id, (balances.get(body.payee_id) ?? 0) + body.amount);
        payload = { objectCreated: { _id: "xfer" } };
      } else if (request.method === "GET" && parts[0] === "accounts") {
        payload = { balance: balances.get(parts[1]) ?? 0 };
      } else {
        response.writeHead(404);
        response.end();
        return;
      }
      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify(payload));
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("no port");
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}
