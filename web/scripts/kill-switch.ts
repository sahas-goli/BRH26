// npm --prefix web run kill-switch [-- --dry-run] [-- --base <url>]
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const envFile = join(__dirname, "..", ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const at = args.indexOf("--base");
const base = (at >= 0 && args[at + 1] ? args[at + 1] : "https://sash.select").replace(/\/$/, "");
const secret = process.env.INTERNAL_SECRET?.trim() ?? "";
const headers = { "Content-Type": "application/json", "x-six-hops-secret": secret };

async function main(): Promise<number> {
  if (!secret) { console.log("INTERNAL_SECRET is missing from web/.env.local."); return 1; }
  console.log(`${dryRun ? "Dry run against" : "Stopping every live search on"} ${base}`);
  let web: { cancelled: number; byStatus: Record<string, number> };
  try {
    const response = await fetch(`${base}/api/admin/reset`, { method: "POST", headers, body: JSON.stringify({ dryRun }), signal: AbortSignal.timeout(20_000) });
    if (!response.ok) { console.log(`Site reset failed with HTTP ${response.status}.`); return 1; }
    web = await response.json() as typeof web;
  } catch { console.log(`Could not reach ${base}.`); return 1; }
  const { funding = 0, open = 0, found = 0 } = web.byStatus;
  console.log(`Searches ${dryRun ? "that would be cancelled" : "cancelled"}: ${web.cancelled} (funding ${funding}, open ${open}, found ${found})`);

  let agent = "not reset (dry run)";
  if (!dryRun) {
    try {
      const response = await fetch("http://localhost:8787/reset", { method: "POST", headers, signal: AbortSignal.timeout(5_000) });
      agent = response.ok ? `cleared ${(await response.json() as { cleared: number }).cleared} conversations`
        : response.status === 404 ? "running an old version without /reset; restart it to enable reset"
        : `reset failed with HTTP ${response.status}`;
    } catch { agent = "not running locally"; }
    console.log(`Photon agent: ${agent}`);
  }
  console.log(`Done: ${web.cancelled} searches ${dryRun ? "would stop" : "stopped"}; agent ${agent}.`);
  return 0;
}

main().then((code) => { process.exitCode = code; }, () => { console.log("Kill switch failed."); process.exitCode = 1; });
