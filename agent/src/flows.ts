import { formatHintCard, parseIntent, sanitizeOutbound } from "./privacy.js";
import { awaitName, clearStage, getSession, resetSessions, setStage, setToken, type Session } from "./session.js";
import { createDeposit, fetchHolder, forwardTo, fundDeposit } from "./web.js";

const PUBLIC = () => (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const START = new Set(["new search", "start", "start a search", "new", "post", "create", "create a search", "find someone"]);
const SENT = new Set(["sent", "done", "sent it", "paid", "funded"]);
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export async function handleInboundText(handle: string, text: string): Promise<string | string[]> {
  const session = getSession(handle);
  const lower = text.trim().toLowerCase();

  if (lower === "reset") {
    resetSessions(handle);
    return sanitizeOutbound("Reset. Text new search to start over, or send a Six Hops link to pass one on.");
  }
  if (lower === "cancel" && session.stage.startsWith("awaiting_")) {
    session.draft = undefined;
    clearStage(handle);
    return sanitizeOutbound("Cancelled. Text new search whenever you want to start one.");
  }
  if (START.has(lower)) {
    setStage(handle, "awaiting_hint", {});
    session.draft = {};
    return sanitizeOutbound("Let's start a search. Who are you looking for? Describe them in one message, without names or addresses.");
  }
  if (session.stage === "awaiting_hint") {
    if (text.trim().length < 3) return sanitizeOutbound("Describe who you are looking for in a sentence or two.");
    setStage(handle, "awaiting_hours", { text: text.trim().slice(0, 4000) });
    return sanitizeOutbound("Got it. How many hours should the search stay open? Reply with a number, like 24.");
  }
  if (session.stage === "awaiting_hours") return startDeposit(session, text);
  if (session.stage === "awaiting_funds" && SENT.has(lower)) return checkDeposit(session);
  if (session.stage === "awaiting_funds") {
    const address = session.draft?.depositAddress?.trim();
    const page = fundingPage(session.draft);
    if (!address || !page) return sanitizeOutbound("Send the SOL to the address above, then reply sent.");
    return depositFundingMessages(page, address, session.draft?.minimumSol);
  }

  const intent = parseIntent(text);

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
  return sanitizeOutbound("Text new search to post one, or send a Six Hops /h/… link to pass one on.");
}

export const DEMO_FUND_SENTENCE = "Open that page and tap Use demo wallet to fund the minimum, or send SOL and reply sent.";

export function depositFundingMessages(page: string, address: string, minimumSol?: number): string[] {
  const lead = typeof minimumSol === "number" && Number.isFinite(minimumSol)
    ? `Send at least ${minimumSol} devnet SOL to the address in the next message. Everything you send becomes the reward. `
    : "";
  const prose = `${lead}${DEMO_FUND_SENTENCE}`;
  const safe = sanitizeOutbound(prose);
  return [safe === prose && page ? `${prose}\n${page}` : safe, address.trim()];
}

function fundingPage(draft: { rootToken?: string; posterToken?: string } | undefined): string {
  if (!draft?.rootToken || !draft.posterToken) return "";
  return `${PUBLIC()}/h/${draft.rootToken}#k=${draft.posterToken}`;
}

async function startDeposit(session: Session, text: string): Promise<string | string[]> {
  const hours = Number(text.trim().replace(/\s*(hours?|hrs?|h)$/i, ""));
  if (!Number.isFinite(hours) || hours < 1 || hours > 168) {
    return sanitizeOutbound("Reply with a number of hours from 1 to 168.");
  }
  const created = await createDeposit(session.draft?.text ?? "", Math.round(hours));
  if ("error" in created) {
    return sanitizeOutbound("I couldn't set up that search. Reply with the number of hours to try again.");
  }
  const rootToken = created.posterLink.split("/").at(-1);
  setStage(session.handle, "awaiting_funds", {
    bountyId: created.bountyId,
    posterToken: created.posterToken,
    rootToken,
    depositAddress: created.depositAddress,
    minimumSol: created.minimumSol,
  });
  return depositFundingMessages(
    fundingPage({ rootToken, posterToken: created.posterToken }),
    created.depositAddress.trim(),
    created.minimumSol,
  );
}

async function checkDeposit(session: Session): Promise<string> {
  const draft = session.draft;
  if (!draft?.bountyId || !draft.rootToken || !draft.posterToken) {
    clearStage(session.handle);
    return sanitizeOutbound("I lost track of that search. Text new search to start again.");
  }
  const funded = await fundDeposit(draft.bountyId);
  if ("error" in funded) return sanitizeOutbound("I couldn't check the wallet just now. Reply sent again in a moment.");
  if (funded.status === "funding") {
    return sanitizeOutbound(funded.bountyCents > 0
      ? `I see ${money(funded.bountyCents)} so far. Send at least ${funded.minimumSol} SOL in total, then reply sent again.`
      : "Nothing has landed yet. Devnet can take a few seconds, so reply sent again in a moment.");
  }
  const page = fundingPage(draft);
  session.draft = undefined;
  setToken(session.handle, draft.rootToken);
  return sanitizeOutbound(
    `Your ${money(funded.bountyCents)} search is live.\nYour private page, keep it to yourself:\n${page}\nReply with a friend's name and I'll make their personal link.`,
  );
}

/** Copy a stranger sees with a personal link. Must survive sanitizeOutbound. */
export function personalLinkReply(label: string, link: string): string {
  return sanitizeOutbound(
    `Personal link for ${label}:\nThis is a search for a kind of person; the card is on the link, so tap This is me if it is you, otherwise pass it to someone closer. The route that works gets paid in test SOL.\n${link}\nShare only with them.`,
  );
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
  return personalLinkReply(label, result.link);
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
