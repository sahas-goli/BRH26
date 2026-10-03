import { formatHintCard, parseIntent, sanitizeOutbound } from "./privacy.js";
import { awaitName, clearStage, getSession, setToken, type Session } from "./session.js";
import { fetchHolder, forwardTo } from "./web.js";

const PUBLIC = () => (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function handleInboundText(handle: string, text: string): Promise<string> {
  const intent = parseIntent(text);
  const session = getSession(handle);

  if (intent.kind === "link") {
    setToken(handle, intent.token);
    const view = await fetchHolder(intent.token);
    if ("error" in view) {
      return sanitizeOutbound("I couldn't open that Six Hops link. Ask the sender for a fresh personal link.");
    }
    return formatHintCard(view.hint);
  }

  if (intent.kind === "pass") {
    if (!session.token) {
      return sanitizeOutbound("Send me your Six Hops personal link first, then say yes to forward it.");
    }
    awaitName(handle);
    return sanitizeOutbound("Who should I send it to? Reply with their first name (or a short label).");
  }

  if (intent.kind === "claim") {
    if (!session.token) {
      return sanitizeOutbound("Send me your Six Hops personal link first, then say this is me.");
    }
    const claimUrl = `${PUBLIC()}/claim/${session.token}`;
    return sanitizeOutbound(`If this search is about you, open your claim page:\n${claimUrl}`);
  }

  if (intent.kind === "forward_name" && session.stage === "awaiting_name" && session.token) {
    return forwardByLabel(session, intent.label);
  }

  if (intent.kind === "forward_name" && session.token && session.stage === "has_token") {
    // Allow skipping the yes step: name alone forwards.
    return forwardByLabel(session, intent.label);
  }

  if (session.token) {
    return sanitizeOutbound("Reply yes to forward, a name to send it, or this is me if you're the person.");
  }
  return sanitizeOutbound("Send a Six Hops /h/… link to get started.");
}

async function forwardByLabel(session: Session, label: string): Promise<string> {
  if (!session.token) return sanitizeOutbound("Missing link — send your /h/… URL first.");
  const result = await forwardTo(session.token, label);
  clearStage(session.handle);
  if ("error" in result) {
    if (result.error === "fanout_exceeded") {
      return sanitizeOutbound("You've already used your three forwards on this hop.");
    }
    if (result.error === "closed" || result.error === "too_deep") {
      return sanitizeOutbound("This search can't take another forward right now.");
    }
    return sanitizeOutbound("I couldn't create that forward. Try again in a moment.");
  }
  return sanitizeOutbound(`Personal link for ${label}:\n${result.link}\nShare only with them.`);
}

export function handleReaction(handle: string): string {
  const session = getSession(handle);
  if (!session.token) {
    return sanitizeOutbound("Got it. Send your Six Hops link if you want to forward.");
  }
  awaitName(handle);
  return sanitizeOutbound("Who should I send it to? Reply with their first name.");
}

export function paidMessage(cents: number, explorerUrl?: string): string {
  const dollars = (cents / 100).toFixed(2);
  const link = explorerUrl ? `\n${explorerUrl}` : "";
  return sanitizeOutbound(`You were paid $${dollars}.${link}`);
}

export function foundMessage(): string {
  return sanitizeOutbound("The search found its person. Payout is processing.");
}
