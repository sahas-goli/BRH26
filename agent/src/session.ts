/** Per-handle conversation state (in-memory; fine for demo process). */

export type Stage = "idle" | "has_token" | "awaiting_name";

export interface Session {
  handle: string;
  token: string | null;
  stage: Stage;
  updatedAt: number;
}

const sessions = new Map<string, Session>();

export function getSession(handle: string): Session {
  const existing = sessions.get(handle);
  if (existing) return existing;
  const created: Session = { handle, token: null, stage: "idle", updatedAt: Date.now() };
  sessions.set(handle, created);
  return created;
}

export function setToken(handle: string, token: string): Session {
  const session = getSession(handle);
  session.token = token;
  session.stage = "has_token";
  session.updatedAt = Date.now();
  return session;
}

export function awaitName(handle: string): Session {
  const session = getSession(handle);
  session.stage = "awaiting_name";
  session.updatedAt = Date.now();
  return session;
}

export function clearStage(handle: string): void {
  const session = getSession(handle);
  session.stage = session.token ? "has_token" : "idle";
  session.updatedAt = Date.now();
}

/** Outbound delivery: map handle → last known Spectrum space id for send(). */
const spaces = new Map<string, { send: (text: string) => Promise<void> }>();

export function rememberSpace(handle: string, send: (text: string) => Promise<void>): void {
  spaces.set(handle, { send });
}

export async function deliverToHandle(handle: string, text: string): Promise<"sent" | "queued_mock"> {
  const entry = spaces.get(handle);
  if (entry) {
    await entry.send(text);
    return "sent";
  }
  console.log(`[send-mock] no live space for ${handle.slice(0, 4)}… — would send: ${text.slice(0, 120)}`);
  return "queued_mock";
}
