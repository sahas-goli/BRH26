/** xAI Grok Voice ephemeral tokens + helpers (PLAN 7.5, VERIFY G). */

export const GROK_VOICE_MODEL = "grok-voice-latest";
export const GROK_REALTIME_WS = "wss://api.x.ai/v1/realtime?model=grok-voice-latest";
export const GROK_CLIENT_SECRETS_URL = "https://api.x.ai/v1/realtime/client_secrets";

export interface EphemeralToken {
  clientSecret: string;
  expiresAt: string; // ISO
  model: string;
  wsUrl: string;
}

export function grokEnabled(): boolean {
  return process.env.GROK_ENABLED === "true" && Boolean(process.env.XAI_API_KEY?.trim());
}

/**
 * Mint a short-lived client secret for browser WebSocket auth.
 * Docs: POST https://api.x.ai/v1/realtime/client_secrets
 * Browser connects with protocol `xai-client-secret.${value}`.
 */
export async function mintEphemeralToken(
  expiresSeconds = 300,
  fetchImpl: typeof fetch = fetch,
): Promise<EphemeralToken> {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) throw new Error("missing_xai_key");
  const response = await fetchImpl(GROK_CLIENT_SECRETS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expires_after: { seconds: expiresSeconds } }),
  });
  if (!response.ok) throw new Error(`client_secrets_${response.status}`);
  const body = await response.json() as { value?: string; expires_at?: number };
  if (!body.value || typeof body.expires_at !== "number") throw new Error("client_secrets_shape");
  return {
    clientSecret: body.value,
    expiresAt: new Date(body.expires_at * 1000).toISOString(),
    model: GROK_VOICE_MODEL,
    wsUrl: GROK_REALTIME_WS,
  };
}

/** Protocol entry for browser WebSocket (sec-websocket-protocol). */
export function browserWsProtocols(clientSecret: string): string[] {
  return [`xai-client-secret.${clientSecret}`];
}
