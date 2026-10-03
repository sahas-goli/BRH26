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

function buildPool(connectionString: string): Pool {
  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? undefined
      : { rejectUnauthorized: false }, // Tiger Cloud (PLAN.md 7.1)
    max: 5,
  });
}

/**
 * Shared pg Pool for route handlers. Undefined when DATABASE_URL is unset
 * so claim/confirm/tick can return 503 without crashing the import.
 */
export const pool: Pool | undefined = process.env.DATABASE_URL
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
