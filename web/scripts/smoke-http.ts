/**
 * Exercise real Next route handlers against PGlite (no listen port).
 * Simulates the page API path: POST /api/bounties → forward → h → claim → confirm → og.
 *
 *   npm --prefix web run smoke:http
 */
import { ensureBountyDatabase } from "../lib/ensure-db";

async function json(response: Response): Promise<Record<string, unknown>> {
  return response.json() as Promise<Record<string, unknown>>;
}

async function main(): Promise<void> {
  process.env.DATABASE_URL = process.env.DATABASE_URL || "pglite";
  process.env.PAYOUT_MODE = process.env.PAYOUT_MODE || "mock";
  process.env.NESSIE_MODE = "mock";
  process.env.GROK_ENABLED = "false";
  process.env.GEMINI_ENABLED = "false";
  process.env.PHOTON_ENABLED = "false";
  process.env.PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

  await ensureBountyDatabase();

  const bounties = await import("../app/api/bounties/route");
  const forward = await import("../app/api/forward/route");
  const h = await import("../app/api/h/[token]/route");
  const claim = await import("../app/api/claim/route");
  const confirm = await import("../app/api/bounties/[id]/confirm/route");
  const og = await import("../app/api/og/[id]/route");

  const createdRes = await bounties.POST(new Request("http://localhost/api/bounties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hint: { city: "Ithaca, NY", field: "http smoke" },
      capCents: 2000,
      hours: 24,
    }),
  }));
  if (createdRes.status !== 201) throw new Error(`create ${createdRes.status} ${await createdRes.text()}`);
  const created = await json(createdRes);
  const posterLink = String(created.posterLink);
  let token = posterLink.split("/").at(-1)!;
  console.log("created", created.bountyId);

  for (let hop = 1; hop <= 3; hop++) {
    const fwdRes = await forward.POST(new Request("http://localhost/api/forward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, recipients: [{ label: `http-${hop}` }] }),
    }));
    if (fwdRes.status !== 200) throw new Error(`forward ${fwdRes.status}`);
    const fwd = await json(fwdRes) as { recipients: { link: string }[] };
    token = fwd.recipients[0]!.link.split("/").at(-1)!;
    const viewRes = await h.GET(
      new Request(`http://localhost/api/h/${token}`),
      { params: Promise.resolve({ token }) },
    );
    if (viewRes.status !== 200) throw new Error(`h ${viewRes.status}`);
    const view = await json(viewRes);
    if (view.depth !== hop) throw new Error(`depth ${view.depth} != ${hop}`);
    console.log(`hop ${hop} ok`);
  }

  const claimRes = await claim.POST(new Request("http://localhost/api/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, introMessage: "HTTP smoke target" }),
  }));
  if (claimRes.status !== 200) throw new Error(`claim ${claimRes.status} ${await claimRes.text()}`);
  const claimed = await json(claimRes);
  if (claimed.status !== "found") throw new Error(`claim status ${claimed.status}`);

  const bountyId = String(created.bountyId);
  const confirmRes = await confirm.POST(
    new Request(`http://localhost/api/bounties/${bountyId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posterToken: created.posterToken, accept: true }),
    }),
    { params: Promise.resolve({ id: bountyId }) },
  );
  if (confirmRes.status !== 200) throw new Error(`confirm ${confirmRes.status}`);
  const confirmed = await json(confirmRes);
  if (confirmed.status !== "paid") throw new Error(`confirm status ${confirmed.status}`);

  const ogRes = await og.GET(
    new Request(`http://localhost/api/og/${bountyId}`),
    { params: Promise.resolve({ id: bountyId }) },
  );
  if (ogRes.status !== 200) throw new Error(`og ${ogRes.status}`);
  const ctype = ogRes.headers.get("content-type") || "";
  if (!ctype.includes("image") && !ctype.includes("png") && !ctype.includes("svg")) {
    // next/og ImageResponse is typically image/png
    console.log("og content-type", ctype);
  }

  console.log("SMOKE_HTTP_OK", { bountyId, payoutSig: confirmed.payoutSig, ogType: ctype });
}

main().catch((error) => {
  console.error("SMOKE_HTTP_FAIL", error);
  process.exit(1);
});
