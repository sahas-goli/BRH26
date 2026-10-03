import type { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

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

let poolInstance: Pool | undefined;

function buildPool(connectionString: string): Pool {
  // Hide from static bundlers; `pg` stays a Node runtime dependency (serverExternalPackages).
  // eslint-disable-next-line no-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const { Pool: PoolCtor } = (eval("require") as NodeRequire)("pg") as typeof import("pg");
  return new PoolCtor({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? undefined
      : { rejectUnauthorized: false }, // Tiger Cloud (PLAN.md 7.1)
    max: 5,
  });
}

/** Shared pg Pool, or undefined when unset / PGlite. Loads `pg` on first Tiger use only. */
export function getPool(): Pool | undefined {
  if (poolInstance) return poolInstance;
  const url = process.env.DATABASE_URL;
  if (!url || isPgliteUrl(url)) return undefined;
  poolInstance = buildPool(url);
  return poolInstance;
}

function requirePool(): Pool {
  const resolved = getPool();
  if (!resolved) throw new Error("DATABASE_URL is not set");
  return resolved;
}

function wrap(client: Pool | PoolClient): DbQuery {
  return {
    query<T extends QueryResultRow = QueryResultRow>(sql: string, values?: unknown[]) {
      return client.query<T>(sql, values);
    },
  };
}

/** Tiger / remote Postgres adapter (lazy pg load on first use). */
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
  if (!getPool()) throw new Error("DATABASE_URL is not set");
  return db;
}
