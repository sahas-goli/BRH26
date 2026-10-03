/**
 * In-process Postgres via PGlite for local MVP smoke without Tiger.
 * Production keeps using DATABASE_URL → pg Pool (web/lib/db.ts).
 *
 * DATABASE_URL=pglite              → memory (scripts)
 * DATABASE_URL=pglite:.data/local  → file-backed (next dev; survives reload)
 * DATABASE_URL=pglite:.data/demo   → table /live seed (npm run seed:demo)
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import type { Database, DbQuery } from "./db";

function schemaPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../../db/schema.local.sql");
}

function dataPathFromUrl(url: string): string | undefined {
  if (url === "pglite") return undefined;
  if (url.startsWith("pglite:")) {
    const rest = url.slice("pglite:".length).trim();
    if (!rest || rest === "memory") return undefined;
    return resolve(process.cwd(), rest);
  }
  return undefined;
}

function wrap(client: {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[]; affectedRows?: number }>;
}): DbQuery {
  return {
    async query(sql: string, values: unknown[] = []) {
      const result = await client.query(sql, values);
      return {
        rows: result.rows as never[],
        rowCount: result.affectedRows ?? result.rows.length,
        command: "",
        oid: 0,
        fields: [],
      };
    },
  };
}

function adapt(pg: PGlite): Database {
  const root = wrap(pg);
  return {
    query: root.query.bind(root),
    async transaction<T>(work: (tx: DbQuery) => Promise<T>): Promise<T> {
      await pg.query("BEGIN");
      try {
        const result = await work(wrap(pg));
        await pg.query("COMMIT");
        return result;
      } catch (error) {
        try {
          await pg.query("ROLLBACK");
        } catch {
          /* keep original */
        }
        throw error;
      }
    },
  };
}

/** Open PGlite with schema.local.sql (memory or file path from DATABASE_URL). */
export async function openPgliteDatabase(url = process.env.DATABASE_URL ?? "pglite"): Promise<Database> {
  const dataDir = dataPathFromUrl(url);
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const pg = dataDir ? new PGlite(dataDir) : new PGlite();
  await pg.waitReady;
  await pg.exec(readFileSync(schemaPath(), "utf8"));
  return adapt(pg);
}
