/** Calls into the Six Hops web API (PUBLIC_BASE_URL). */

const base = () => (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const secret = () => process.env.INTERNAL_SECRET?.trim() ?? "";

export interface HolderHint {
  hint: Record<string, unknown>;
  claimUrl: string;
  canForward: boolean;
  forwardsLeft: number;
}

export async function fetchHolder(token: string): Promise<HolderHint | { error: string }> {
  const response = await fetch(`${base()}/api/h/${encodeURIComponent(token)}`, {
    headers: { "Cache-Control": "no-store" },
  });
  if (!response.ok) {
    return { error: response.status === 404 ? "not_found" : "unavailable" };
  }
  const data = await response.json() as {
    bounty?: { hint?: Record<string, unknown> };
    claimUrl?: string;
    canForward?: boolean;
    forwardsLeft?: number;
  };
  return {
    hint: data.bounty?.hint ?? {},
    claimUrl: typeof data.claimUrl === "string" ? data.claimUrl : `/claim/${token}`,
    canForward: Boolean(data.canForward),
    forwardsLeft: Number(data.forwardsLeft ?? 0),
  };
}

export async function forwardTo(
  token: string,
  label: string,
  handle?: string,
): Promise<{ link: string } | { error: string }> {
  const response = await fetch(`${base()}/api/forward`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      recipients: [{ label, ...(handle ? { handle } : {}) }],
    }),
  });
  const data = await response.json() as {
    error?: string;
    recipients?: { link?: string }[];
  };
  if (!response.ok) return { error: data.error ?? "forward_failed" };
  const link = data.recipients?.[0]?.link;
  if (!link) return { error: "forward_failed" };
  return { link };
}

async function internalPost<T>(path: string, body: unknown): Promise<T | { error: string }> {
  try {
    const response = await fetch(`${base()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-six-hops-secret": secret() },
      body: JSON.stringify(body),
    });
    const data = await response.json() as T & { error?: string };
    if (!response.ok) return { error: data.error ?? "unavailable" };
    return data;
  } catch {
    return { error: "unavailable" };
  }
}

export function createDeposit(text: string, hours: number) {
  return internalPost<{ bountyId: string; posterToken: string; posterLink: string; depositAddress: string; minimumSol: number }>(
    "/api/deposits", { text, hours },
  );
}

export function fundDeposit(bountyId: string) {
  return internalPost<{ status: "open" | "funding"; bountyCents: number; minimumSol: number }>(
    `/api/deposits/${encodeURIComponent(bountyId)}/fund`, {},
  );
}

export interface TickNudge {
  handle: string;
  text: string;
}

export interface TickAction {
  bountyId: string;
  kind: string;
  nudge?: TickNudge[];
}

export async function controllerTick(): Promise<TickAction[]> {
  const response = await fetch(`${base()}/api/controller/tick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-six-hops-secret": secret(),
    },
    body: "{}",
  });
  if (!response.ok) {
    console.warn(`[tick] ${response.status}`);
    return [];
  }
  const data = await response.json() as { actions?: TickAction[] };
  return Array.isArray(data.actions) ? data.actions : [];
}
