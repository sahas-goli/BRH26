/**
 * When DATABASE_URL=pglite, wire configureBounty to the in-process DB before
 * handling requests. Tiger/Postgres still configures synchronously in bounty.ts.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  const { isPgliteUrl, getDatabase } = await import("./lib/db");
  if (!isPgliteUrl(process.env.DATABASE_URL)) return;
  const { configureBounty } = await import("./lib/bounty");
  configureBounty({
    database: await getDatabase(),
    publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "http://localhost:3000",
  });
}
