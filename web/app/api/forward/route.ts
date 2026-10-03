import { BountyError, forwardBounty } from "../../../lib/bounty";
import { ensureBountyDatabase } from "../../../lib/ensure-db";

export const runtime = "nodejs";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  try {
    await ensureBountyDatabase();
    return json(await forwardBounty(input), 200);
  } catch (error) {
    if (error instanceof BountyError) {
      return json({ error: error.code }, error.status);
    }
    return json({ error: "internal_error" }, 500);
  }
}
