/**
 * Intentionally does not import db/bounty here: Next's instrumentation bundler
 * cannot resolve Node builtins inside `pg`. PGlite/Tiger wiring happens in
 * `ensureBountyDatabase()` on each API route (and Tiger sync-configures in bounty.ts).
 */
export async function register(): Promise<void> {
  /* no-op */
}
