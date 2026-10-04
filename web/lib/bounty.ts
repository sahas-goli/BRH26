import { randomBytes } from "node:crypto";
import { db, isPgliteUrl } from "./db";
import { newCustodialAccount, validSolanaAddress } from "./solana";
import { FANOUT, H, INITIAL_SHARE } from "./types";
import type { HintCard, HolderView, PublicBounty, ForwardResult, Rail } from "./types";

const HINT_KEYS = ["city", "organizationType", "field", "skill", "language", "experience"] as const;
type HintKey = (typeof HINT_KEYS)[number];
type HiddenHint = { attr: HintKey; value: string };

export class BountyError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = "BountyError";
  }
}

export interface BountyQuery {
  query<T extends Record<string, unknown>>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
}

export interface BountyDatabase extends BountyQuery {
  // Must use ONE connection and BEGIN/COMMIT; rollback on any rejected callback.
  transaction<T>(work: (tx: BountyQuery) => Promise<T>): Promise<T>;
}

export interface EdgeMemo {
  bountyId: string;
  parentId: string;
  childId: string;
  parentSalt: string;
  childSalt: string;
  at: string;
}

export interface BountyOptions {
  database: BountyDatabase;
  publicBaseUrl?: string;
  now?: () => Date;
  compileHint?: (text: string) => Promise<{ hint: HintCard; hidden?: HiddenHint[] }>;
  // Escrow must be idempotent by bountyId. Live external transfers need an
  // integration-owned recovery mechanism if the subsequent DB commit fails.
  createEscrow?: (input: { bountyId: string; capCents: number; posterRail?: "bank" }) => Promise<{
    posterAccount: string; escrowAccount: string;
  }>;
  generateWantedCard?: (input: { bountyId: string; hint: HintCard }) => Promise<void>;
  sendMessage?: (input: { handle: string; link: string; hint: HintCard }) => Promise<boolean>;
  commitEdgeMemo?: (edge: EdgeMemo) => Promise<void>;
  // Serverless hosts must inject a lifetime-aware scheduler (e.g. Next after).
  // The default is suitable only for tests and long-running Node servers.
  scheduleBackground?: (work: () => Promise<void>) => void;
  // Receives a category only: never expose tokens, handles, salts, or provider errors.
  onBackgroundError?: (kind: "wanted_card" | "edge_memo" | "delivery") => void;
}

let configured: BountyOptions | undefined;

/** Call from server initialization once SWE3's database adapter is available. */
export function configureBounty(options: BountyOptions): void {
  const url = new URL(options.publicBaseUrl ?? process.env.PUBLIC_BASE_URL ?? "http://localhost:3000");
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Invalid public base URL");
  }
  configured = { ...options, publicBaseUrl: url.origin };
}

/**
 * Opens the devnet forward gate. Confirm already sends the Solana pay memo,
 * so this does not submit a second transaction.
 */
export function acknowledgeEdgeMemo(): Promise<void> {
  return Promise.resolve();
}

// Route modules import this file in the Node runtime. Configure the core with
// the shared pool when Tiger/Postgres URL is set. PGlite is wired asynchronously
// via getDatabase() + instrumentation / smoke-mvp (DATABASE_URL=pglite).
if (process.env.DATABASE_URL && !isPgliteUrl(process.env.DATABASE_URL)) {
  configureBounty({ database: db, commitEdgeMemo: acknowledgeEdgeMemo });
}

function options(): BountyOptions {
  if (!configured) throw new BountyError("database_unavailable", 503);
  // Lazy defaults so scaffold can call configureBounty({ database }) only.
  const base = configured;
  return {
    ...base,
    compileHint: base.compileHint ?? (enabled("GEMINI_ENABLED")
      ? (text) => import("./hintcard").then((m) => m.compileHintCard(text))
      : undefined),
    generateWantedCard: base.generateWantedCard ?? (enabled("GROK_ENABLED")
      ? (input) => import("./imagine").then((m) => m.storeWantedCard(base.database, input))
      : undefined),
  };
}

function enabled(key: string): boolean { return process.env[key] === "true"; }
function liveRequired(condition: boolean, hook: unknown, code: string): void {
  if (condition && !hook) throw new BountyError(code, 503);
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new BountyError("invalid_input", 400);
  return value as Record<string, unknown>;
}
function string(value: unknown, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new BountyError("invalid_input", 400);
  }
  return value.trim();
}
function hintCard(value: unknown): HintCard {
  const input = object(value);
  const hint: Record<string, string> = {};
  for (const key of HINT_KEYS) {
    if (input[key] !== undefined && input[key] !== "") hint[key] = string(input[key], 80);
  }
  if (Object.keys(hint).length === 0) throw new BountyError("hint_required", 400);
  if (hint.organizationType && !["company", "startup", "university", "lab", "nonprofit", "government", "other"].includes(hint.organizationType)) {
    throw new BountyError("invalid_hint", 400);
  }
  return hint as HintCard;
}
function hiddenHints(value: unknown): HiddenHint[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > HINT_KEYS.length) throw new BountyError("invalid_hint", 400);
  const seen = new Set<string>();
  return value.map((entry) => {
    const item = object(entry);
    if (!HINT_KEYS.includes(item.attr as HintKey) || seen.has(item.attr as string)) throw new BountyError("invalid_hint", 400);
    const attr = item.attr as HintKey;
    seen.add(attr);
    const clean = hintCard({ [attr]: item.value });
    return { attr, value: clean[attr]! };
  });
}
function id(prefix: string): string {
  // Rejection sampling avoids modulo bias for the 62-character alphabet.
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  while (result.length < 8) {
    for (const byte of randomBytes(16)) {
      if (byte < 248) result += alphabet[byte % 62];
      if (result.length === 8) break;
    }
  }
  return prefix + result;
}
function token(): string { return randomBytes(16).toString("base64url"); }
function validToken(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{22}$/.test(value)) throw new BountyError("not_found", 404);
  return value;
}
function instant(value: string | Date): string { return new Date(value).toISOString(); }
function now(o: BountyOptions): Date { return o.now?.() ?? new Date(); }

type BountyRow = Record<string, unknown> & {
  id: string; hint: HintCard; bounty_cents: number; cap_cents: number;
  status: PublicBounty["status"]; expires_at: string | Date;
};
type HolderRow = Record<string, unknown> & {
  id: string; bounty_id: string; parent_id: string | null; depth: number;
  label: string | null; rail: Rail; forwards: number; salt: string;
  sol_address?: string | null;
  received_at: string | Date; opened_at: string | Date | null;
};
function storedSolAddress(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
function publicBounty(row: BountyRow, o: BountyOptions): PublicBounty {
  return {
    id: row.id, hint: hintCard(row.hint), bountyCents: row.bounty_cents, capCents: row.cap_cents,
    status: row.status, expiresAt: instant(row.expires_at), ogImageUrl: `${o.publicBaseUrl}/api/og/${row.id}`,
  };
}
async function event(tx: BountyQuery, at: string, bountyId: string, holder: {
  id: string; parent_id: string | null; depth: number;
}, kind: string, latency: number | null = null): Promise<void> {
  await tx.query(
    "INSERT INTO events (time,bounty_id,holder_id,parent_id,depth,kind,latency_s,source,detail) VALUES ($1,$2,$3,$4,$5,$6,$7,'live','{}'::jsonb)",
    [at, bountyId, holder.id, holder.parent_id, holder.depth, kind, latency],
  );
}
function background(o: BountyOptions, kind: "wanted_card" | "edge_memo", work: () => Promise<void>): void {
  const report = () => { try { o.onBackgroundError?.(kind); } catch { /* reporting must not fail a committed request */ } };
  const guarded = async () => { try { await work(); } catch { report(); } };
  try {
    if (o.scheduleBackground) o.scheduleBackground(guarded);
    else void guarded();
  } catch { report(); }
}

async function deliver(work: () => Promise<boolean>): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(work),
      new Promise<boolean>((_, reject) => { timer = setTimeout(() => reject(new Error("delivery_timeout")), 5000); }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export async function createBounty(input: unknown): Promise<{
  bountyId: string; posterToken: string; posterLink: string; publicUrl: string;
}> {
  const body = object(input);
  if (!Number.isSafeInteger(body.capCents) || (body.capCents as number) < 1000 || (body.capCents as number) > 2_147_483_647) {
    throw new BountyError("invalid_cap", 400);
  }
  const hours = body.hours === undefined ? 24 : body.hours;
  if (typeof hours !== "number" || !Number.isFinite(hours) || hours <= 0 || hours > 8760) throw new BountyError("invalid_hours", 400);
  if (body.posterRail !== undefined && body.posterRail !== "bank") throw new BountyError("invalid_rail", 400);
  const o = options();
  liveRequired(process.env.NESSIE_MODE === "live", o.createEscrow, "escrow_unavailable");
  liveRequired(enabled("GROK_ENABLED"), o.generateWantedCard, "wanted_card_unavailable");
  let hint: HintCard;
  let hidden: HiddenHint[];
  if (body.text !== undefined && enabled("GEMINI_ENABLED")) {
    liveRequired(true, o.compileHint, "hint_compiler_unavailable");
    let compiled: { hint: HintCard; hidden?: HiddenHint[] };
    try {
      compiled = await o.compileHint!(string(body.text, 4000));
    } catch {
      throw new BountyError("hint_compiler_unavailable", 503);
    }
    try {
      hint = hintCard(compiled.hint);
      hidden = hiddenHints(compiled.hidden);
    } catch (error) {
      if (error instanceof BountyError) throw error;
      throw new BountyError("hint_compiler_unavailable", 503);
    }
  } else {
    hint = hintCard(body.hint);
    hidden = hiddenHints(body.hidden);
  }
  const bountyId = id("b_");
  const posterToken = token();
  const rootToken = token();
  const root = { id: id("h_"), parent_id: null, depth: 0 };
  const at = now(o);
  const cap = body.capCents as number;
  await o.database.transaction(async (tx) => {
    const escrow = process.env.NESSIE_MODE === "live"
      ? await o.createEscrow!({ bountyId, capCents: cap, posterRail: body.posterRail as "bank" | undefined })
      : undefined;
    await tx.query(
      "INSERT INTO bounties (id,poster_token,hint,hidden_hint,cap_cents,bounty_cents,expires_at,created_at,nessie_poster_acct,nessie_escrow_acct) VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7,$8,$9,$10)",
      [bountyId, posterToken, JSON.stringify(hint), JSON.stringify(hidden), cap, Math.round(cap * INITIAL_SHARE),
        new Date(at.getTime() + hours * 3_600_000).toISOString(), at.toISOString(), escrow?.posterAccount ?? null, escrow?.escrowAccount ?? null],
    );
    await tx.query(
      "INSERT INTO holders (id,bounty_id,token,parent_id,depth,label,salt,rail,received_at) VALUES ($1,$2,$3,NULL,0,NULL,$4,$5,$6)",
      [root.id, bountyId, rootToken, randomBytes(16).toString("hex"), body.posterRail ?? "custodial", at.toISOString()],
    );
    await event(tx, at.toISOString(), bountyId, root, "created");
  });
  if (enabled("GROK_ENABLED")) background(o, "wanted_card", () => o.generateWantedCard!({ bountyId, hint }));
  return { bountyId, posterToken, posterLink: `/h/${rootToken}`, publicUrl: `${o.publicBaseUrl}/?bounty=${bountyId}` };
}

export async function getPublicBounty(bountyId: string): Promise<PublicBounty> {
  if (!/^b_[A-Za-z0-9]{8}$/.test(bountyId)) throw new BountyError("not_found", 404);
  const o = options();
  const { rows } = await o.database.query<BountyRow>(
    "SELECT id,hint,bounty_cents,cap_cents,status,expires_at FROM bounties WHERE id=$1", [bountyId],
  );
  if (!rows[0]) throw new BountyError("not_found", 404);
  return publicBounty(rows[0], o);
}

/** Bytes + hint for GET /api/og. Does not touch holder open state. */
export async function getBountyOgSource(bountyId: string): Promise<{ hint: HintCard; png: Buffer | null }> {
  if (!/^b_[A-Za-z0-9]{8}$/.test(bountyId)) throw new BountyError("not_found", 404);
  const o = options();
  const { rows } = await o.database.query<BountyRow & { og_png: Buffer | Uint8Array | null }>(
    "SELECT id,hint,bounty_cents,cap_cents,status,expires_at,og_png FROM bounties WHERE id=$1",
    [bountyId],
  );
  if (!rows[0]) throw new BountyError("not_found", 404);
  const raw = rows[0].og_png;
  const png = raw == null ? null : Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
  return { hint: hintCard(rows[0].hint), png: png && png.length > 0 ? png : null };
}

/** Share-card metadata for crawlers; must not set opened_at. */
export async function getHolderShareMeta(holderToken: string): Promise<{
  ogImageUrl: string; title: string; description: string;
}> {
  validToken(holderToken);
  const o = options();
  const { rows: holders } = await o.database.query<{ bounty_id: string }>(
    "SELECT bounty_id FROM holders WHERE token=$1", [holderToken],
  );
  if (!holders[0]) throw new BountyError("not_found", 404);
  const bounty = await getPublicBounty(holders[0].bounty_id);
  const bits = Object.values(bounty.hint).filter(Boolean).slice(0, 3).join(" · ");
  return {
    ogImageUrl: bounty.ogImageUrl,
    title: "Wanted · Six Hops",
    description: bits || "Help forward this search to someone closer.",
  };
}

export async function getHolderView(holderToken: string): Promise<HolderView> {
  validToken(holderToken);
  const o = options();
  return o.database.transaction(async (tx) => {
    const { rows: holders } = await tx.query<HolderRow>("SELECT id,bounty_id,parent_id,depth,label,rail,forwards,received_at,opened_at FROM holders WHERE token=$1 FOR UPDATE", [holderToken]);
    const holder = holders[0];
    if (!holder) throw new BountyError("not_found", 404);
    const { rows: bounties } = await tx.query<BountyRow>("SELECT id,hint,bounty_cents,cap_cents,status,expires_at FROM bounties WHERE id=$1", [holder.bounty_id]);
    const bounty = bounties[0];
    if (!bounty) throw new BountyError("not_found", 404);
    const at = now(o);
    if (!holder.opened_at) {
      await tx.query("UPDATE holders SET opened_at=$1 WHERE id=$2", [at.toISOString(), holder.id]);
      await event(tx, at.toISOString(), bounty.id, holder, "opened");
    }
    const forwardsLeft = Math.max(0, FANOUT - holder.forwards);
    const view: HolderView = {
      bounty: publicBounty(bounty, o), depth: holder.depth, forwardsLeft,
      canForward: bounty.status === "open" && new Date(bounty.expires_at).getTime() > at.getTime() && holder.depth < H && forwardsLeft > 0,
      rail: holder.rail,
      // Despite the contract's name, this is THIS holder's sender-supplied label.
      parentLabel: holder.label, talkUrl: `/talk/${holderToken}`, claimUrl: `/claim/${holderToken}`,
    };
    // Poster-only: intro for /confirm (never expose chain members).
    if (holder.depth === 0 && bounty.status === "found") {
      const { rows: claimed } = await tx.query<{ detail: unknown }>(
        `SELECT detail FROM events WHERE bounty_id=$1 AND kind='claimed' ORDER BY time DESC LIMIT 1`,
        [bounty.id],
      );
      const raw = claimed[0]?.detail;
      let intro: unknown;
      try {
        const detail = typeof raw === "string" ? JSON.parse(raw) as { introMessage?: string } : raw as { introMessage?: string } | null;
        intro = detail?.introMessage;
      } catch { /* ignore malformed detail */ }
      if (typeof intro === "string" && intro.trim()) {
        view.pendingClaim = { introMessage: intro.trim() };
      }
    }
    return view;
  });
}

export async function forwardBounty(input: unknown): Promise<ForwardResult> {
  const body = object(input);
  const holderToken = validToken(body.token);
  if (!Array.isArray(body.recipients) || body.recipients.length < 1 || body.recipients.length > FANOUT) throw new BountyError("invalid_recipients", 400);
  const recipients = body.recipients.map((value) => {
    const r = object(value);
    return { label: string(r.label, 80), handle: r.handle === undefined || r.handle === "" ? null : string(r.handle, 254) };
  });
  if (body.rail !== undefined && !["custodial", "wallet", "bank"].includes(body.rail as string)) throw new BountyError("invalid_rail", 400);
  const solAddress = body.solAddress === undefined ? undefined : string(body.solAddress, 44);
  if (body.rail === "wallet" && (!solAddress || !validSolanaAddress(solAddress))) throw new BountyError("invalid_wallet", 400);
  if (solAddress && body.rail !== "wallet") throw new BountyError("invalid_rail", 400);
  const o = options();
  liveRequired(process.env.PAYOUT_MODE === "devnet", o.commitEdgeMemo, "edge_memo_unavailable");
  liveRequired(enabled("PHOTON_ENABLED") && recipients.some((r) => r.handle), o.sendMessage, "delivery_unavailable");
  const result = await o.database.transaction(async (tx) => {
    // Discover the bounty first, then lock bounty -> holder, matching payout's
    // lock order. The bounty lock serializes forwards with claim and expiry.
    const { rows: lookup } = await tx.query<{ bounty_id: string }>("SELECT bounty_id FROM holders WHERE token=$1", [holderToken]);
    if (!lookup[0]) throw new BountyError("not_found", 404);
    const { rows: bounties } = await tx.query<BountyRow>("SELECT id,hint,bounty_cents,cap_cents,status,expires_at FROM bounties WHERE id=$1 FOR UPDATE", [lookup[0].bounty_id]);
    const { rows: holders } = await tx.query<HolderRow>("SELECT id,bounty_id,parent_id,depth,label,rail,forwards,salt,sol_address,received_at,opened_at FROM holders WHERE token=$1 FOR UPDATE", [holderToken]);
    const bounty = bounties[0];
    const parent = holders[0];
    if (!bounty || !parent) throw new BountyError("not_found", 404);
    const at = now(o);
    if (bounty.status !== "open" || new Date(bounty.expires_at).getTime() <= at.getTime()) throw new BountyError("closed", 410);
    if (parent.depth >= H) throw new BountyError("too_deep", 409);
    if (parent.forwards + recipients.length > FANOUT) throw new BountyError("fanout_exceeded", 409);
    const rail = (body.rail ?? parent.rail) as Rail;
    const hadAddress = storedSolAddress(parent.sol_address);
    // Re-selecting the demo wallet must keep an address already stored. Bank clears it.
    const assignedAddress = body.rail === "wallet" ? solAddress ?? null : body.rail === "custodial" ? hadAddress ?? null : null;
    await tx.query("UPDATE holders SET forwards=forwards+$1,rail=$2,sol_address=CASE WHEN $3::boolean THEN $4 ELSE sol_address END WHERE id=$5",
      [recipients.length, rail, body.rail !== undefined, assignedAddress, parent.id]);
    let payoutAddress: string | undefined;
    if (parent.depth > 0 && rail === "wallet") {
      payoutAddress = body.rail === "wallet" ? solAddress : hadAddress;
    } else if (parent.depth > 0 && rail === "custodial" && hadAddress) {
      payoutAddress = hadAddress;
    } else if (parent.depth > 0 && rail === "custodial" && process.env.PAYOUT_MODE === "devnet") {
      const created = newCustodialAccount();
      await tx.query(
        "UPDATE holders SET sol_address=$1, custodial_secret=$2 WHERE id=$3 AND sol_address IS NULL",
        [created.address, created.secret, parent.id],
      );
      payoutAddress = created.address;
    }
    const children = [];
    for (const recipient of recipients) {
      const child = { id: id("h_"), parent_id: parent.id, depth: parent.depth + 1, token: token(), salt: randomBytes(16).toString("hex") };
      await tx.query("INSERT INTO holders (id,bounty_id,token,parent_id,depth,label,handle,salt,received_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [child.id, bounty.id, child.token, parent.id, child.depth, recipient.label, recipient.handle, child.salt, at.toISOString()]);
      await event(tx, at.toISOString(), bounty.id, child, "received");
      await event(tx, at.toISOString(), bounty.id, parent, "forwarded", Math.max(0, (at.getTime() - new Date(parent.received_at).getTime()) / 1000));
      children.push({ ...recipient, link: `${o.publicBaseUrl}/h/${child.token}`, edge: {
        bountyId: bounty.id, parentId: parent.id, childId: child.id, parentSalt: parent.salt, childSalt: child.salt, at: at.toISOString(),
      } });
    }
    return { hint: bounty.hint, children, payoutAddress };
  });
  const delivered = await Promise.all(result.children.map(async (child) => {
    if (o.commitEdgeMemo) background(o, "edge_memo", () => o.commitEdgeMemo!(child.edge));
    let sent = false;
    if (enabled("PHOTON_ENABLED") && child.handle) {
      try { sent = await deliver(() => o.sendMessage!({ handle: child.handle!, link: child.link, hint: result.hint })); }
      catch { try { o.onBackgroundError?.("delivery"); } catch { /* committed forward remains usable */ } }
    }
    return { label: child.label, link: child.link, delivered: sent ? "imessage" as const : "link-only" as const };
  }));
  return result.payoutAddress ? { recipients: delivered, payoutAddress: result.payoutAddress } : { recipients: delivered };
}