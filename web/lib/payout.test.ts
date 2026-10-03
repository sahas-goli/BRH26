import assert from "node:assert/strict";
import { test } from "node:test";
import { applyClaim, applyConfirm, claimBounty, confirmBounty, settleChain } from "./payout";

const chain = [
  { holderId: "h_a", depth: 1, rail: "custodial" as const },
  { holderId: "h_b", depth: 2, rail: "wallet" as const },
  { holderId: "h_c", depth: 3, rail: "custodial" as const },
  { holderId: "h_d", depth: 4, rail: "bank" as const },
];

const open = {
  status: "open" as const,
  bountyCents: 1600,
  capCents: 2000,
  hasBadge: false,
  posterHolderId: "h_poster",
  posterRail: "bank" as const,
  payouts: [],
};

test("a 4-deep mock claim pays the chain once", () => {
  const found = applyClaim(open, null);
  assert.equal(found.error, undefined);
  assert.equal(found.ledger.status, "found");
  assert.equal(found.ledger.payouts.length, 0);

  const paid = applyConfirm(found.ledger, chain, true, "b_demo");
  assert.equal(paid.ledger.status, "paid");
  assert.equal(paid.payoutSig, "mock_b_demo");
  const shares = paid.ledger.payouts.filter((row) => row.role !== "refund");
  assert.equal(shares.reduce((sum, row) => sum + row.cents, 0), 1600);
  assert.deepEqual(
    shares.map((row) => row.cents),
    [100, 100, 100, 1300],
  );
  const refund = paid.ledger.payouts.find((row) => row.role === "refund");
  assert.equal(refund?.cents, 400);
  assert.equal(refund?.holderId, "h_poster");

  const again = applyConfirm(paid.ledger, chain, true, "b_demo");
  assert.equal(again.payoutSig, "mock_b_demo");
  assert.equal(again.idempotent, true);
  assert.equal(again.ledger.payouts.length, paid.ledger.payouts.length);
});

test("a second claim is rejected", () => {
  const found = applyClaim(open, null);
  const again = applyClaim(found.ledger, null);
  assert.equal(again.error, "already_claimed");
});

test("a bad badge code does not pay", () => {
  const denied = applyClaim({ ...open, hasBadge: true }, false);
  assert.equal(denied.error, "bad_code");
  assert.equal(denied.ledger.status, "open");
});

test("a valid badge pays immediately", () => {
  const paid = applyClaim({ ...open, hasBadge: true }, true, chain, "b_badge");
  assert.equal(paid.ledger.status, "paid");
  assert.equal(
    paid.ledger.payouts.filter((row) => row.role !== "refund").reduce((sum, row) => sum + row.cents, 0),
    1600,
  );
});

test("reject reopens a found bounty", () => {
  const found = applyClaim(open, null);
  const reopened = applyConfirm(found.ledger, chain, false, "b_demo");
  assert.equal(reopened.ledger.status, "open");
  assert.equal(reopened.ledger.payouts.length, 0);
});

test("settleChain returns null past depth 8", () => {
  const tooLong = Array.from({ length: 9 }, (_, i) => ({
    holderId: `h_${i}`,
    depth: i + 1,
    rail: "custodial" as const,
  }));
  assert.equal(settleChain("b_x", tooLong, 1600, 2000, "h_poster", "bank", []), null);
});

test("mock claim writes payout rows for a 4-deep chain and a retry is idempotent", async () => {
  const db = memoryDb();
  const found = await claimBounty(db, { token: "finder-token", introMessage: "this is me" });
  assert.equal(found.status, "found");
  assert.equal(db.state.payouts.length, 0);
  assert.equal(db.state.bounties[0].status, "found");

  const paid = await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true });
  assert.equal(paid.status, "paid");
  assert.equal(paid.payoutSig, "mock_b_demo");
  assert.equal(db.state.bounties[0].status, "paid");
  const shares = db.state.payouts.filter((row) => row.role !== "refund");
  assert.equal(shares.reduce((sum, row) => sum + Number(row.cents), 0), 1600);

  const again = await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true });
  assert.equal(again.payoutSig, "mock_b_demo");
  assert.equal(db.state.payouts.length, 5);
});

test("devnet confirm uses one solana signature and a retry does not send again", async () => {
  const previous = process.env.PAYOUT_MODE;
  process.env.PAYOUT_MODE = "devnet";
  try {
    const db = memoryDb();
    await claimBounty(db, { token: "finder-token", introMessage: "this is me" });
    let calls = 0;
    const paid = await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true }, {
      signPayout: async ({ rows }) => {
        calls += 1;
        assert.equal(rows.length, 3);
        assert.equal(db.state.payouts.length, 5);
        assert.equal(db.state.payouts.every((row) => row.tx_sig === ""), true);
        assert.equal(db.state.bounties[0].status, "found");
        assert.equal(rows[0].solAddress && rows[0].solAddress !== "wallet-addr", true);
        assert.equal(rows[1].solAddress, "wallet-addr");
        assert.equal(rows[2].solAddress && rows[2].solAddress !== "wallet-addr", true);
        return "devnetsig";
      },
    });
    assert.equal(calls, 1);
    assert.equal(paid.payoutSig, "devnetsig");
    assert.equal(paid.explorerUrl, "https://explorer.solana.com/tx/devnetsig?cluster=devnet");
    assert.equal(db.state.payouts.every((row) => row.tx_sig === "devnetsig"), true);
    const again = await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true }, {
      signPayout: async () => {
        calls += 1;
        return "other";
      },
    });
    assert.equal(again.payoutSig, "devnetsig");
    assert.equal(calls, 1);
  } finally {
    if (previous === undefined) delete process.env.PAYOUT_MODE;
    else process.env.PAYOUT_MODE = previous;
  }
});

test("live confirm pays the bank rail from escrow and a retry does not pay again", async () => {
  const previous = process.env.NESSIE_MODE;
  process.env.NESSIE_MODE = "live";
  try {
    const db = memoryDb();
    db.state.bounties[0].nessie_escrow_acct = "escrow";
    db.state.bounties[0].nessie_poster_acct = "checking";
    const finder = db.state.holders.find((row) => row.id === "h_d");
    if (finder) finder.nessie_acct = "finder-bank";
    await claimBounty(db, { token: "finder-token", introMessage: "this is me" });
    let moves = 0;
    await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true }, {
      moveBank: async (input) => {
        moves += 1;
        assert.deepEqual(input.bank, [{ payeeId: "finder-bank", cents: 1300 }]);
        assert.equal(input.treasuryCents, 300);
        assert.equal(input.refundCents, 400);
        assert.equal(input.escrowId, "escrow");
        assert.equal(input.checkingId, "checking");
      },
    });
    assert.equal(moves, 1);
    await confirmBounty(db, { bountyId: "b_demo", posterToken: "poster-secret", accept: true }, {
      moveBank: async () => {
        moves += 1;
      },
    });
    assert.equal(moves, 1);
  } finally {
    if (previous === undefined) delete process.env.NESSIE_MODE;
    else process.env.NESSIE_MODE = previous;
  }
});

function memoryDb() {
  const state: { bounties: Record<string, unknown>[]; holders: Record<string, unknown>[]; payouts: Record<string, unknown>[]; events: Record<string, unknown>[] } = {
    bounties: [{
      id: "b_demo", poster_token: "poster-secret", status: "open", bounty_cents: 1600, cap_cents: 2000,
      target_badge_id: null, expires_at: "2026-10-04T00:00:00Z",
    }],
    holders: [
      { id: "h_poster", bounty_id: "b_demo", token: "poster-token", parent_id: null, depth: 0, rail: "bank" },
      { id: "h_a", bounty_id: "b_demo", token: "a", parent_id: "h_poster", depth: 1, rail: "custodial" },
      { id: "h_b", bounty_id: "b_demo", token: "b", parent_id: "h_a", depth: 2, rail: "wallet", sol_address: "wallet-addr" },
      { id: "h_c", bounty_id: "b_demo", token: "c", parent_id: "h_b", depth: 3, rail: "custodial" },
      { id: "h_d", bounty_id: "b_demo", token: "finder-token", parent_id: "h_c", depth: 4, rail: "bank" },
    ],
    payouts: [],
    events: [],
  };
  const query = async (sql: string, values: unknown[] = []) => {
    let rows: Record<string, unknown>[] = [];
    if (sql.startsWith("SELECT bounty_id FROM holders WHERE token")) {
      rows = state.holders.filter((row) => row.token === values[0]);
    } else if (sql.includes("FROM bounties WHERE id=$1 FOR UPDATE")) {
      rows = state.bounties.filter((row) => row.id === values[0]);
    } else if (sql.includes("FROM bounties WHERE id=$1 AND poster_token")) {
      rows = state.bounties.filter((row) => row.id === values[0] && row.poster_token === values[1]);
    } else if (sql.includes("FROM holders WHERE token")) {
      rows = state.holders.filter((row) => row.token === values[0]);
    } else if (sql.includes("depth=0")) {
      rows = state.holders.filter((row) => row.bounty_id === values[0] && row.depth === 0);
    } else if (sql.includes("FROM holders WHERE id=$1")) {
      rows = state.holders.filter((row) => row.id === values[0]);
    } else if (sql.includes("kind='claimed'")) {
      rows = state.events.filter((row) => row.bounty_id === values[0] && row.kind === "claimed").slice(-1);
    } else if (sql.startsWith("SELECT tx_sig")) {
      rows = state.payouts.filter((row) => row.bounty_id === values[0]).slice(0, 1);
    } else if (sql.startsWith("SELECT holder_id,role")) {
      rows = state.payouts.filter((row) => row.bounty_id === values[0]);
    } else if (sql.startsWith("UPDATE holders SET sol_address")) {
      const holder = state.holders.find((row) => row.id === values[2]);
      if (holder && holder.sol_address == null) {
        holder.sol_address = values[0];
        holder.custodial_secret = values[1];
      }
    } else if (sql.startsWith("UPDATE payouts SET tx_sig")) {
      for (const payout of state.payouts) {
        if (payout.bounty_id === values[1]) payout.tx_sig = values[0];
      }
    } else if (sql.startsWith("INSERT INTO events")) {
      state.events.push({
        time: values[0], bounty_id: values[1], holder_id: values[2], parent_id: values[3],
        depth: values[4], kind: values[5], detail: values[6],
      });
    } else if (sql.startsWith("UPDATE bounties")) {
      const bounty = state.bounties.find((row) => row.id === values[1]);
      if (bounty) bounty.status = values[0];
    } else if (sql.startsWith("INSERT INTO payouts")) {
      const exists = state.payouts.some((row) => row.bounty_id === values[0] && row.holder_id === values[1]);
      if (!exists) {
        state.payouts.push({
          bounty_id: values[0], holder_id: values[1], role: values[2], cents: values[3], rail: values[4], tx_sig: values[5],
        });
      }
    } else {
      throw new Error(`Unhandled test query: ${sql}`);
    }
    return { rows: rows.map((row) => ({ ...row })) };
  };
  return {
    state,
    query,
    async transaction<T>(work: (tx: { query: typeof query }) => Promise<T>) {
      const snapshot = structuredClone(state);
      try {
        return await work({ query });
      } catch (error) {
        state.bounties = snapshot.bounties;
        state.holders = snapshot.holders;
        state.payouts = snapshot.payouts;
        state.events = snapshot.events;
        throw error;
      }
    },
  };
}
