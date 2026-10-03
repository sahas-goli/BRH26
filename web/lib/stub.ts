/** Shared 501 body for endpoints not yet filled by their owner. */
export function notImplemented(): Response {
  return Response.json(
    { error: "not_implemented" },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}
