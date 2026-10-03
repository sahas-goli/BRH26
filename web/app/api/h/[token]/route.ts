import { BountyError, getHolderView } from "../../../../lib/bounty";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
): Promise<Response> {
  try {
    const { token } = await context.params;
    return json(await getHolderView(token), 200);
  } catch (error) {
    if (error instanceof BountyError) {
      return json({ error: error.code }, error.status);
    }
    return json({ error: "internal_error" }, 500);
  }
}
