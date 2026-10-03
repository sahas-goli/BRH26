/**
 * Seed a file-backed PGlite DB with a branching multi-hop cascade so
 * /live + /api/stats + /api/graph show real data (no Tiger).
 *
 *   npm --prefix web run seed:demo
 *   npm --prefix web run dev
 *   open http://localhost:3000/live
 *
 * DATABASE_URL defaults to pglite:.data/demo (under web/).
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { configureBounty, createBounty, forwardBounty } from "../lib/bounty";
import { openPgliteDatabase } from "../lib/pglite-db";
import { claimBounty, confirmBounty } from "../lib/payout";
import { loadGraph, loadStats } from "../lib/stats";

const DEMO_URL = "pglite:.data/demo";

function tokenFromLink(link: string): string {
  const token = link.split("/").at(-1);
  if (!token) throw new Error(`bad link ${link}`);
  return token;
}

function mergeEnvLocal(bountyId: string): void {
  const path = join(process.cwd(), ".env.local");
  const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
  const lines = existing.split(/\r?\n/).filter((line) => line.length > 0);
  const map = new Map<string, string>();
  for (const line of lines) {
    if (line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    map.set(line.slice(0, i), line.slice(i + 1));
  }

  const currentDb = map.get("DATABASE_URL");
  if (!currentDb || currentDb === "pglite" || currentDb.startsWith("pglite:")) {
    map.set("DATABASE_URL", DEMO_URL);
  }
  map.set("FEATURED_BOUNTY", bountyId);
  if (!map.has("PUBLIC_BASE_URL")) map.set("PUBLIC_BASE_URL", "http://localhost:3000");
  if (!map.has("PAYOUT_MODE")) map.set("PAYOUT_MODE", "mock");
  if (!map.has("NESSIE_MODE")) map.set("NESSIE_MODE", "mock");
  if (!map.has("GROK_ENABLED")) map.set("GROK_ENABLED", "false");
  if (!map.has("GEMINI_ENABLED")) map.set("GEMINI_ENABLED", "false");
  if (!map.has("PHOTON_ENABLED")) map.set("PHOTON_ENABLED", "false");

  const body = [
    "# Written by npm run seed:demo — safe to edit; Tiger URL is never overwritten.",
    ...[...map.entries()].map(([k, v]) => `${k}=${v}`),
    "",
  ].join("\n");
  writeFileSync(path, body, "utf8");
}

async function main(): Promise<void> {
  process.env.DATABASE_URL = process.env.DATABASE_URL || DEMO_URL;
  process.env.PAYOUT_MODE = process.env.PAYOUT_MODE || "mock";
  process.env.NESSIE_MODE = process.env.NESSIE_MODE || "mock";
  process.env.GROK_ENABLED = "false";
  process.env.GEMINI_ENABLED = "false";
  process.env.PHOTON_ENABLED = "false";
  process.env.PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

  if (!process.env.DATABASE_URL.startsWith("pglite")) {
    throw new Error("seed-demo refuses non-pglite DATABASE_URL (won't wipe Tiger)");
  }

  const database = await openPgliteDatabase(process.env.DATABASE_URL);
  await database.query("DELETE FROM payouts");
  await database.query("DELETE FROM events");
  await database.query("DELETE FROM holders");
  await database.query("DELETE FROM bounties");

  configureBounty({
    database,
    publicBaseUrl: process.env.PUBLIC_BASE_URL,
  });

  const created = await createBounty({
    hint: {
      city: "Ithaca, NY",
      field: "distributed search",
      affiliation: "hackathon",
    },
    hidden: [{ attr: "skill", value: "has routed a friend to a stranger" }],
    capCents: 2000,
    hours: 48,
  });

  const poster = tokenFromLink(created.posterLink);
  const layer1 = await forwardBounty({
    token: poster,
    recipients: [{ label: "TA" }, { label: "classmate" }, { label: "roommate" }],
  });

  const ta = tokenFromLink(layer1.recipients[0]!.link);
  const classmate = tokenFromLink(layer1.recipients[1]!.link);

  const fromTa = await forwardBounty({
    token: ta,
    recipients: [{ label: "labmate" }, { label: "club-lead" }],
  });
  const fromClassmate = await forwardBounty({
    token: classmate,
    recipients: [{ label: "dead-end" }, { label: "stalled" }],
  });

  const labmate = tokenFromLink(fromTa.recipients[0]!.link);
  const viaCousin = await forwardBounty({
    token: labmate,
    recipients: [{ label: "cousin" }],
  });
  const cousin = tokenFromLink(viaCousin.recipients[0]!.link);
  const toTarget = await forwardBounty({
    token: cousin,
    recipients: [{ label: "target-friend" }],
  });
  const targetToken = tokenFromLink(toTarget.recipients[0]!.link);

  // Maturity window for b uses p75 or 600s — age the cascade so /api/stats reports b.
  await database.query(
    `UPDATE holders SET received_at = now() - interval '45 minutes' WHERE bounty_id = $1`,
    [created.bountyId],
  );
  await database.query(
    `UPDATE events SET time = now() - interval '40 minutes' WHERE bounty_id = $1`,
    [created.bountyId],
  );
  await database.query(
    `UPDATE bounties SET controller_step = 2, low_b_since = now() - interval '20 minutes' WHERE id = $1`,
    [created.bountyId],
  );

  // Synthetic edge memos for Explorer-looking edges on /live (mock sigs).
  const { rows: edgeHolders } = await database.query<{ id: string; parent_id: string | null }>(
    `SELECT id, parent_id FROM holders WHERE bounty_id = $1 AND parent_id IS NOT NULL ORDER BY depth`,
    [created.bountyId],
  );
  for (const [i, holder] of edgeHolders.entries()) {
    await database.query(
      `INSERT INTO events (time, bounty_id, holder_id, parent_id, depth, kind, detail)
       VALUES (now() - interval '35 minutes', $1, $2, $3, NULL, 'edge_memo', $4::jsonb)`,
      [
        created.bountyId,
        holder.id,
        holder.parent_id,
        JSON.stringify({ memoSig: `mock_edge_${i}_${holder.id.slice(0, 6)}` }),
      ],
    );
  }

  const claimed = await claimBounty(database, {
    token: targetToken,
    introMessage: "Table demo target — I match the hint card.",
  });
  if (claimed.status !== "found") throw new Error(`claim status ${claimed.status}`);

  const confirmed = await confirmBounty(database, {
    bountyId: created.bountyId,
    posterToken: created.posterToken,
    accept: true,
  });
  if (confirmed.status !== "paid") throw new Error(`confirm status ${confirmed.status}`);

  const stats = await loadStats(database, created.bountyId);
  const graph = await loadGraph(database, created.bountyId);
  if (!stats) throw new Error("loadStats returned null");
  if (!graph) throw new Error("loadGraph returned null");
  if (stats.holders < 8) throw new Error(`expected ≥8 holders, got ${stats.holders}`);
  if (graph.edges.length < 6) throw new Error(`expected ≥6 edges, got ${graph.edges.length}`);
  if (stats.b == null) throw new Error("expected mature branching factor b");
  if (stats.status !== "paid") throw new Error(`expected paid, got ${stats.status}`);
  if (!graph.nodes.some((n) => n.isTarget)) throw new Error("graph missing target node");

  mergeEnvLocal(created.bountyId);
  mkdirSync(join(process.cwd(), ".data", "demo"), { recursive: true });
  writeFileSync(
    join(process.cwd(), ".data", "demo", "featured.txt"),
    `${created.bountyId}\n`,
    "utf8",
  );

  console.log("SEED_DEMO_OK", {
    bountyId: created.bountyId,
    holders: stats.holders,
    edges: graph.edges.length,
    maxDepth: stats.maxDepth,
    b: stats.b,
    controllerStep: stats.controllerStep,
    payoutSig: confirmed.payoutSig,
    databaseUrl: process.env.DATABASE_URL,
    envLocal: ".env.local (FEATURED_BOUNTY + DATABASE_URL)",
  });
  console.log("Next: npm --prefix web run dev  →  http://localhost:3000/live");
}

main().catch((error) => {
  console.error("SEED_DEMO_FAIL", error);
  process.exit(1);
});
