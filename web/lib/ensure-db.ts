/**
 * Ensure configureBounty is wired for the current process.
 * Tiger configures synchronously on import; PGlite needs a lazy async open
 * so next dev / first API hit works even if instrumentation raced.
 */
import { acknowledgeEdgeMemo, configureBounty } from "./bounty";
import { getDatabase, isPgliteUrl } from "./db";

let ensuring: Promise<void> | undefined;

export async function ensureBountyDatabase(): Promise<void> {
  if (!isPgliteUrl(process.env.DATABASE_URL)) return;
  ensuring ??= (async () => {
    const database = await getDatabase();
    configureBounty({
      database,
      publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "http://localhost:3000",
      commitEdgeMemo: acknowledgeEdgeMemo,
    });
  })();
  await ensuring;
}
