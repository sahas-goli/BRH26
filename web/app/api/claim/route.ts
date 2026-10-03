import { claimBounty, PayoutError, type PayoutDatabase } from "../../../lib/payout";

async function database(): Promise<PayoutDatabase> {
  try {
    const db = await import("../../../lib/db");
    const pool = db.pool;
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

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  try {
    const result = await claimBounty(await database(), body);
    return Response.json(result);
  } catch (error) {
    if (error instanceof PayoutError) return Response.json({ error: error.code }, { status: error.status });
    throw error;
  }
}
