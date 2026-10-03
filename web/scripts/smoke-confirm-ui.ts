/**
 * Lib-level check: claim → found → HolderView.pendingClaim → confirm → paid.
 *   npx tsx scripts/smoke-confirm-ui.ts
 */
import { configureBounty, createBounty, forwardBounty, getHolderView } from "../lib/bounty";
import { openPgliteDatabase } from "../lib/pglite-db";
import { claimBounty, confirmBounty } from "../lib/payout";

async function main(): Promise<void> {
  process.env.PAYOUT_MODE = "mock";
  process.env.NESSIE_MODE = "mock";
  const database = await openPgliteDatabase("pglite");
  configureBounty({ database, publicBaseUrl: "http://localhost:3000" });

  const created = await createBounty({
    hint: { city: "Ithaca, NY", field: "confirm UI" },
    capCents: 2000,
    hours: 24,
  });
  const posterHolder = created.posterLink.split("/").at(-1)!;
  const fwd = await forwardBounty({
    token: posterHolder,
    recipients: [{ label: "friend" }],
  });
  const child = fwd.recipients[0]!.link.split("/").at(-1)!;
  const claimed = await claimBounty(database, {
    token: child,
    introMessage: "I match the card — confirm-ui smoke.",
  });
  if (claimed.status !== "found") throw new Error(`expected found, got ${claimed.status}`);

  const view = await getHolderView(posterHolder);
  if (view.depth !== 0) throw new Error("expected poster depth 0");
  if (view.bounty.status !== "found") throw new Error(`status ${view.bounty.status}`);
  if (view.pendingClaim?.introMessage !== "I match the card — confirm-ui smoke.") {
    throw new Error(`pendingClaim missing: ${JSON.stringify(view.pendingClaim)}`);
  }

  const paid = await confirmBounty(database, {
    bountyId: created.bountyId,
    posterToken: created.posterToken,
    accept: true,
  });
  if (paid.status !== "paid") throw new Error(`confirm ${paid.status}`);

  console.log("SMOKE_CONFIRM_UI_OK", { bountyId: created.bountyId, payoutSig: paid.payoutSig });
}

main().catch((error) => {
  console.error("SMOKE_CONFIRM_UI_FAIL", error);
  process.exit(1);
});
