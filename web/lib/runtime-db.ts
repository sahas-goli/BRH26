import type { PayoutDatabase } from "./payout";
import { PayoutError } from "./payout";

/** Resolve Tiger pool or PGlite for claim/confirm routes. */
export async function payoutDatabase(): Promise<PayoutDatabase> {
  try {
    const mod = await import("./db");
    if (mod.isPgliteUrl()) {
      return await mod.getDatabase();
    }
    const pool = mod.pool;
    if (!pool) throw new Error("no pool");
    return {
      query: (sql, values) => pool.query(sql, values),
      async transaction(work) {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const result = await work(client);
          await client.query("COMMIT");
          return result;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      },
    };
  } catch (error) {
    if (error instanceof PayoutError) throw error;
    throw new PayoutError("database_unavailable", 503);
  }
}
