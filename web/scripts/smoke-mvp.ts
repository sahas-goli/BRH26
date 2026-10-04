/**
 * Local MVP smoke: createBounty → forward×3 → claim → confirm against PGlite.
 * No Tiger / sponsor secrets. Production path unchanged (real DATABASE_URL).
 *
 *   npm --prefix web run smoke:mock
 */
import { configureBounty, createBounty, forwardBounty, getHolderView, getPublicBounty } from "../lib/bounty";
import { openPgliteDatabase } from "../lib/pglite-db";
import { claimBounty, confirmBounty } from "../lib/payout";

async function main(): Promise<void> {
  process.env.PAYOUT_MODE = process.env.PAYOUT_MODE || "mock";
  process.env.NESSIE_MODE = process.env.NESSIE_MODE || "mock";
  process.env.GROK_ENABLED = "false";
  delete process.env.GEMINI_ENABLED;
  delete process.env.GEMINI_API_KEY;
  process.env.PHOTON_ENABLED = "false";

  const database = await openPgliteDatabase();
  configureBounty({ database, publicBaseUrl: "http://localhost:3000" });

  const created = await createBounty({
    hint: { city: "Ithaca, NY", field: "distributed search" },
    hidden: [{ attr: "skill", value: "has run a local smoke" }],
    capCents: 2000,
    hours: 24,
  });
  console.log("created", created.bountyId);

  let token = created.posterLink.split("/").at(-1)!;
  for (let hop = 1; hop <= 3; hop++) {
    const result = await forwardBounty({
      token,
      recipients: [{ label: `hop-${hop}` }],
    });
    token = result.recipients[0]!.link.split("/").at(-1)!;
    const view = await getHolderView(token);
    if (view.depth !== hop) throw new Error(`expected depth ${hop}, got ${view.depth}`);
    console.log(`forward hop ${hop}`, result.recipients[0]!.link);
  }

  const claimed = await claimBounty(database, {
    token,
    introMessage: "I match the hint card; local PGlite smoke target.",
  });
  if (claimed.status !== "found") throw new Error(`expected found, got ${claimed.status}`);
  console.log("claimed", claimed.status);

  const confirmed = await confirmBounty(database, {
    bountyId: created.bountyId,
    posterToken: created.posterToken,
    accept: true,
  });
  if (confirmed.status !== "paid") throw new Error(`expected paid, got ${confirmed.status}`);
  console.log("confirmed", confirmed.status, confirmed.payoutSig ?? "");

  const pub = await getPublicBounty(created.bountyId);
  if (pub.status !== "paid") throw new Error(`public status ${pub.status}`);

  const { rows: holders } = await database.query<{ depth: number }>(
    "SELECT depth FROM holders WHERE bounty_id=$1 ORDER BY depth",
    [created.bountyId],
  );
  if (holders.length !== 4) throw new Error(`expected 4 holders, got ${holders.length}`);

  const { rows: events } = await database.query<{ kind: string }>(
    "SELECT kind FROM events WHERE bounty_id=$1",
    [created.bountyId],
  );
  const kinds = events.map((e) => e.kind);
  for (const need of ["created", "received", "forwarded", "claimed"]) {
    if (!kinds.includes(need)) throw new Error(`missing event ${need}`);
  }

  const { rows: payouts } = await database.query(
    "SELECT holder_id, role, cents FROM payouts WHERE bounty_id=$1",
    [created.bountyId],
  );
  if (payouts.length < 1) throw new Error("expected payout rows after confirm");

  console.log("SMOKE_MVP_OK", {
    bountyId: created.bountyId,
    holders: holders.length,
    events: events.length,
    payouts: payouts.length,
    payoutSig: confirmed.payoutSig,
  });
}

main().catch((error) => {
  console.error("SMOKE_MVP_FAIL", error);
  process.exit(1);
});
