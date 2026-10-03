import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { BountyError, configureBounty, createBounty, forwardBounty, getHolderView, getPublicBounty } from "../../../lib/bounty";
import type { BountyDatabase, BountyOptions, BountyQuery } from "../../../lib/bounty";

type Row = Record<string, unknown>;
const flags = ["NESSIE_MODE", "GROK_ENABLED", "GEMINI_ENABLED", "PHOTON_ENABLED", "PAYOUT_MODE"];
const original = flags.map((key) => [key, process.env[key]] as const);
beforeEach(() => { for (const key of flags) delete process.env[key]; });
after(() => { for (const [key, value] of original) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

// A transactional stateful adapter checks application behavior and rollback.
// It does not replace integration tests of PostgreSQL locking or SQL syntax.
function fixture(extra: Partial<BountyOptions> = {}) {
  let state: { bounties: Row[]; holders: Row[]; events: Row[] } = { bounties: [], holders: [], events: [] };
  let failKind: string | undefined;
  const at = new Date("2026-10-03T16:00:00Z");
  const queries: string[] = [];
  const tx: BountyQuery = {
    async query<T extends Row>(sql: string, values: unknown[] = []) {
      queries.push(sql);
      let rows: Row[] = [];
      if (sql.startsWith("INSERT INTO bounties")) {
        state.bounties.push({ id: values[0], poster_token: values[1], hint: JSON.parse(values[2] as string), hidden_hint: JSON.parse(values[3] as string), cap_cents: values[4], bounty_cents: values[5], expires_at: values[7], status: "open" });
      } else if (sql.startsWith("INSERT INTO holders")) {
        const root = sql.includes("NULL,0,NULL");
        state.holders.push({ id: values[0], bounty_id: values[1], token: values[2], parent_id: root ? null : values[3], depth: root ? 0 : values[4], label: root ? null : values[5], salt: root ? values[3] : values[7], rail: root ? values[4] : "custodial", received_at: root ? values[5] : values[8], opened_at: null, forwards: 0 });
      } else if (sql.startsWith("INSERT INTO events")) {
        if (values[5] === failKind) throw new Error("injected event write failure");
        state.events.push({ time: values[0], bounty_id: values[1], holder_id: values[2], parent_id: values[3], depth: values[4], kind: values[5], latency_s: values[6] });
      } else if (sql.startsWith("SELECT") && sql.includes("FROM holders")) {
        rows = state.holders.filter((row) => row.token === values[0]);
      } else if (sql.startsWith("SELECT") && sql.includes("FROM bounties")) {
        rows = state.bounties.filter((row) => row.id === values[0]);
      } else if (sql.startsWith("UPDATE holders SET opened_at")) {
        state.holders.find((row) => row.id === values[1])!.opened_at = values[0];
      } else if (sql.startsWith("UPDATE holders SET forwards")) {
        const row = state.holders.find((row) => row.id === values[4])!;
        row.forwards = Number(row.forwards) + Number(values[0]);
        row.rail = values[1];
        if (values[2]) row.sol_address = values[3];
      } else {
        throw new Error(`Unhandled test query: ${sql}`);
      }
      return { rows: structuredClone(rows) as T[] };
    },
  };
  const database: BountyDatabase = { ...tx, async transaction(work) {
    const snapshot = structuredClone(state);
    try { return await work(tx); } catch (error) { state = snapshot; throw error; }
  } };
  configureBounty({ database, publicBaseUrl: "https://sixhops.test", now: () => at, ...extra });
  return { get state() { return state; }, at, queries, failEvent(kind: string) { failKind = kind; } };
}
const post = () => createBounty({ hint: { field: "aerospace" }, hidden: [{ attr: "city", value: "Ithaca" }], capCents: 1000 });
const linkToken = (link: string) => link.split("/").at(-1)!;
const forward = (token: string, count = 1) => forwardBounty({ token, recipients: Array.from({ length: count }, (_, i) => ({ label: `friend ${i}` })) });
const rejects = (code: string, status: number) => (error: unknown) => error instanceof BountyError && error.code === code && error.status === status;

test("post and three successive hops retain ancestry, distinct secrets and public privacy", async () => {
  const f = fixture();
  const created = await post();
  let token = linkToken(created.posterLink);
  for (let depth = 1; depth <= 3; depth++) {
    f.at.setSeconds(f.at.getSeconds() + 15);
    const result = await forward(token);
    assert.equal(result.recipients[0].delivered, "link-only");
    token = linkToken(result.recipients[0].link);
    const view = await getHolderView(token);
    assert.equal(view.depth, depth);
    assert.equal(view.parentLabel, "friend 0");
    assert.equal(view.forwardsLeft, 3);
    assert.equal(view.canForward, true);
    await getHolderView(token);
  }
  assert.equal(f.state.holders.length, 4);
  assert.equal(new Set(f.state.holders.map((row) => row.token)).size, 4);
  assert.equal(new Set(f.state.holders.map((row) => row.salt)).size, 4);
  for (let i = 1; i <= 3; i++) assert.equal(f.state.holders[i].parent_id, f.state.holders[i - 1].id);
  for (const kind of ["received", "forwarded", "opened"]) assert.equal(f.state.events.filter((row) => row.kind === kind).length, 3);
  assert.deepEqual(f.state.events.filter((row) => row.kind === "forwarded").map((row) => row.latency_s), [15, 15, 15]);
  const publicValue = await getPublicBounty(created.bountyId);
  assert.deepEqual(Object.keys(publicValue).sort(), ["id", "hint", "bountyCents", "capCents", "status", "expiresAt", "ogImageUrl"].sort());
  assert.deepEqual(publicValue.hint, { field: "aerospace" });
});

test("fanout is cumulative and no extra children or events survive a rejected forward", async () => {
  const f = fixture();
  const token = linkToken((await post()).posterLink);
  await forward(token, 2);
  const snapshot = structuredClone(f.state);
  await assert.rejects(forward(token, 2), rejects("fanout_exceeded", 409));
  assert.deepEqual(f.state, snapshot);
  await forward(token);
  const view = await getHolderView(token);
  assert.equal(view.forwardsLeft, 0);
  assert.equal(view.canForward, false);
  const locks = f.queries.filter((sql) => sql.endsWith("FOR UPDATE"));
  assert.ok(locks[0].includes("FROM bounties"));
  assert.ok(locks[1].includes("FROM holders"));
});

test("depth eight can receive and open but cannot create a ninth hop", async () => {
  const f = fixture();
  let token = linkToken((await post()).posterLink);
  for (let depth = 1; depth <= 8; depth++) token = linkToken((await forward(token)).recipients[0].link);
  assert.equal((await getHolderView(token)).canForward, false);
  await assert.rejects(forward(token), rejects("too_deep", 409));
  assert.equal(f.state.holders.length, 9);
});

test("closed statuses and the exact expiry deadline prevent forwarding", async () => {
  for (const status of ["found", "paid", "expired", "refunded", "open"]) {
    const f = fixture();
    const token = linkToken((await post()).posterLink);
    f.state.bounties[0].status = status;
    if (status === "open") f.at.setTime(new Date(f.state.bounties[0].expires_at as string).getTime());
    assert.equal((await getHolderView(token)).canForward, false);
    await assert.rejects(forward(token), rejects("closed", 410));
    assert.equal(f.state.holders.length, 1);
  }
});

test("failed event writes roll back forwarding and never schedule external effects", async () => {
  let memos = 0;
  const f = fixture({ commitEdgeMemo: async () => { memos++; } });
  const token = linkToken((await post()).posterLink);
  const snapshot = structuredClone(f.state);
  f.failEvent("forwarded");
  await assert.rejects(forward(token), /injected event write failure/);
  assert.deepEqual(f.state, snapshot);
  assert.equal(memos, 0);
});

test("delivery and background failures preserve the committed share link", async () => {
  const failures: string[] = [];
  const jobs: (() => Promise<void>)[] = [];
  const f = fixture({ sendMessage: async () => { throw new Error("private provider error"); }, commitEdgeMemo: async () => { throw new Error("private memo error"); }, scheduleBackground: (job) => { jobs.push(job); }, onBackgroundError: (kind) => { failures.push(kind); } });
  process.env.PHOTON_ENABLED = "true";
  const token = linkToken((await post()).posterLink);
  const result = await forwardBounty({ token, recipients: [{ label: "friend", handle: "friend@example.test" }] });
  assert.equal(result.recipients[0].delivered, "link-only");
  assert.equal(f.state.holders.length, 2);
  assert.equal(jobs.length, 1);
  await jobs[0]();
  assert.deepEqual(failures, ["delivery", "edge_memo"]);
  assert.equal((await getHolderView(linkToken(result.recipients[0].link))).depth, 1);
});
