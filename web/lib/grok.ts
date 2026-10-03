/** xAI Grok Voice ephemeral tokens + session helpers (PLAN 7.5). */

export const GROK_VOICE_MODEL = "grok-voice-latest";
export const GROK_REALTIME_WS = "wss://api.x.ai/v1/realtime?model=grok-voice-latest";
export const GROK_CLIENT_SECRETS_URL = "https://api.x.ai/v1/realtime/client_secrets";
export const GROK_PCM_RATE = 24_000;

export interface EphemeralToken {
  clientSecret: string;
  expiresAt: string; // ISO
  model: string;
  wsUrl: string;
}

export type VoiceToolName = "get_bounty" | "forward_to" | "claim";

export const VOICE_TOOLS = [
  {
    type: "function" as const,
    name: "get_bounty" as const,
    description: "Load the public hint card, depth, and remaining forwards for this holder.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    type: "function" as const,
    name: "forward_to" as const,
    description: "Forward this bounty to one person the holder named. Creates a child edge and personal link.",
    parameters: {
      type: "object",
      properties: {
        label: { type: "string", description: "Short label for the recipient (first name or nickname)" },
        handle: { type: "string", description: "Optional iMessage phone or email" },
      },
      required: ["label"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "claim" as const,
    description: "Opt the holder in as the target with a short introduction message.",
    parameters: {
      type: "object",
      properties: {
        introMessage: { type: "string", description: "How the holder matches the hint card" },
      },
      required: ["introMessage"],
      additionalProperties: false,
    },
  },
];

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

export function sessionUpdateEvent(): Record<string, unknown> {
  return {
    type: "session.update",
    session: {
      voice: "eve",
      instructions:
        "You help a Six Hops holder. Read the hint card in the user's language (support 20+ languages). " +
        "Help them pick who to forward to, then call forward_to. If they are the target, call claim. " +
        "Never invent names or street addresses. Attributes only. Call get_bounty first if you lack context.",
      turn_detection: { type: "server_vad" },
      audio: {
        input: { format: { type: "audio/pcm", rate: GROK_PCM_RATE } },
        output: { format: { type: "audio/pcm", rate: GROK_PCM_RATE } },
      },
      tools: VOICE_TOOLS,
    },
  };
}

/** Encode Float32 PCM (−1..1) as little-endian PCM16 base64 for input_audio_buffer.append. */
export function floatToPcm16Base64(floats: Float32Array): string {
  const bytes = new Uint8Array(floats.length * 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < floats.length; i++) {
    const sample = Math.max(-1, Math.min(1, floats[i]!));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

/** Decode base64 PCM16 LE into Float32 for Web Audio playback. */
export function pcm16Base64ToFloat(base64: string): Float32Array {
  const binary = atob(base64);
  const floats = new Float32Array(binary.length / 2);
  for (let i = 0; i < floats.length; i++) {
    const lo = binary.charCodeAt(i * 2);
    const hi = binary.charCodeAt(i * 2 + 1);
    const sample = (hi << 8) | lo;
    const signed = sample > 0x7fff ? sample - 0x10000 : sample;
    floats[i] = signed / 0x8000;
  }
  return floats;
}

export async function runVoiceTool(
  name: string,
  args: Record<string, unknown>,
  holderToken: string,
  fetchImpl: typeof fetch = fetch,
): Promise<unknown> {
  if (name === "get_bounty") {
    const response = await fetchImpl(`/api/h/${encodeURIComponent(holderToken)}`, {
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });
    const body = await response.json();
    if (!response.ok) return { error: body.error ?? response.status };
    return body;
  }
  if (name === "forward_to") {
    const label = typeof args.label === "string" ? args.label.trim() : "";
    if (!label) return { error: "label_required" };
    const handle = typeof args.handle === "string" && args.handle.trim() ? args.handle.trim() : undefined;
    const response = await fetchImpl("/api/forward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        token: holderToken,
        recipients: [{ label, ...(handle ? { handle } : {}) }],
      }),
    });
    const body = await response.json();
    if (!response.ok) return { error: body.error ?? response.status };
    return body;
  }
  if (name === "claim") {
    const introMessage = typeof args.introMessage === "string" ? args.introMessage.trim() : "";
    if (!introMessage) return { error: "intro_required" };
    const response = await fetchImpl("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ token: holderToken, introMessage }),
    });
    const body = await response.json();
    if (!response.ok) return { error: body.error ?? response.status };
    return body;
  }
  return { error: "unknown_tool" };
}
