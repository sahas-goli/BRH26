import { NextResponse } from "next/server";
import { fetchWantedCardPng } from "../../../lib/imagine";

export const runtime = "nodejs";

let drawing = false;

/** Name-free illustrated preview for the create form. The xAI key stays on the server. */
export async function POST(request: Request) {
  let text = "";
  try {
    const body = await request.json() as { text?: unknown };
    if (typeof body.text === "string") text = body.text.trim().slice(0, 400);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (text.length < 8) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (drawing) return NextResponse.json({ error: "preview_unavailable" }, { status: 429 });
  drawing = true;
  try {
    const png = await fetchWantedCardPng({ experience: text });
    return new NextResponse(new Uint8Array(png), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "preview_unavailable" }, { status: 502 });
  } finally {
    drawing = false;
  }
}
