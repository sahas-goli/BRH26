import { BountyError, getBountyOgSource } from "../../../../lib/bounty";
import { fallbackWantedCardResponse } from "../../../../lib/imagine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorJson(code: string, status: number): Response {
  return Response.json(
    { error: code },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await context.params;
    const { hint, png } = await getBountyOgSource(id);
    if (png) {
      return new Response(new Uint8Array(png), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=300",
          "Referrer-Policy": "no-referrer",
        },
      });
    }
    return fallbackWantedCardResponse(hint);
  } catch (error) {
    if (error instanceof BountyError) {
      return errorJson(error.code, error.status);
    }
    return errorJson("internal_error", 500);
  }
}
