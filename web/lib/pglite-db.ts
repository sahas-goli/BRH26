/**
 * In-process Postgres via PGlite for local MVP smoke without Tiger.
 * Production keeps using DATABASE_URL → pg Pool (web/lib/db.ts).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import type { Database, DbQuery } from "./db";

function schemaPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "../../db/schema.local.sql");
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

/** Open an in-memory PGlite DB with schema.local.sql applied. */
export async function openPgliteDatabase(): Promise<Database> {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(readFileSync(schemaPath(), "utf8"));
  const root = wrap(pg);
  return {
    query: root.query.bind(root),
    async transaction<T>(work: (tx: DbQuery) => Promise<T>): Promise<T> {
      // PGlite serializes; emulate one-connection BEGIN/COMMIT like pg Pool.
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
