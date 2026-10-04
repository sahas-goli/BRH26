import { fetchPortraitPng } from "../../../../lib/imagine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const description = body && typeof body === "object" && !Array.isArray(body)
    ? String((body as { description?: unknown }).description ?? "").trim()
    : "";
  if (!description) {
    return Response.json({ error: "Describe who you are looking for." }, { status: 400 });
  }
  try {
    const png = await fetchPortraitPng(description);
    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Could not generate the portrait." }, { status: 502 });
  }
}
