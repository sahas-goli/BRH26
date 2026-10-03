import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

export interface DbQuery {
  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    values?: unknown[],
  ): Promise<QueryResult<T>>;
}

export interface Database extends DbQuery {
  /** One connection with BEGIN/COMMIT; ROLLBACK if the callback rejects. */
  transaction<T>(work: (tx: DbQuery) => Promise<T>): Promise<T>;
}

export function isPgliteUrl(url = process.env.DATABASE_URL): boolean {
  if (!url) return false;
  return url === "pglite" || url.startsWith("pglite:");
}

function withoutSslMode(connectionString: string): string {
  const query = connectionString.indexOf("?");
  if (query < 0) return connectionString;
  const params = new URLSearchParams(connectionString.slice(query + 1));
  params.delete("sslmode");
  const rest = params.toString();
  return rest ? `${connectionString.slice(0, query)}?${rest}` : connectionString.slice(0, query);
}

function buildPool(connectionString: string): Pool {
  const local = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
  return new Pool({
    connectionString: local ? connectionString : withoutSslMode(connectionString),
    ssl: local ? undefined : { rejectUnauthorized: false }, // Tiger Cloud (PLAN.md 7.1)
    max: 5,
  });
}

/**
 * Shared pg Pool for route handlers. Undefined when DATABASE_URL is unset
 * or when DATABASE_URL=pglite (use getDatabase() instead).
 */
export const pool: Pool | undefined =
  process.env.DATABASE_URL && !isPgliteUrl(process.env.DATABASE_URL)
    ? buildPool(process.env.DATABASE_URL)
    : undefined;

function requirePool(): Pool {
  if (!pool) throw new Error("DATABASE_URL is not set");
  return pool;
}

function wrap(client: Pool | PoolClient): DbQuery {
  return {
    query<T extends QueryResultRow = QueryResultRow>(sql: string, values?: unknown[]) {
      return client.query<T>(sql, values);
    },
  };
}

/** Tiger / remote Postgres adapter (sync module init). */
export const db: Database = {
  query<T extends QueryResultRow = QueryResultRow>(sql: string, values?: unknown[]) {
    return wrap(requirePool()).query<T>(sql, values);
  },
  async transaction<T>(work: (tx: DbQuery) => Promise<T>): Promise<T> {
    const client = await requirePool().connect();
    try {
      await client.query("BEGIN");
      const result = await work(wrap(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        /* keep original error */
      }
      throw error;
    } finally {
      client.release();
    }
  },
};

let pgliteSingleton: Promise<Database> | undefined;

/**
 * Resolve the active database: Tiger pool, or lazy PGlite when DATABASE_URL=pglite.
 * Prefer this from async route handlers that must support local smoke.
 */
export async function getDatabase(): Promise<Database> {
  if (isPgliteUrl(process.env.DATABASE_URL)) {
    pgliteSingleton ??= import("./pglite-db").then((m) => m.openPgliteDatabase());
    return pgliteSingleton;
  }
  if (!pool) throw new Error("DATABASE_URL is not set");
  return db;
}
