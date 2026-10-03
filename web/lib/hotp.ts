/**
 * HOTP (RFC 4226) for venue badges — PLAN.md 7.8.
 * Badges display HOTP mod 10^4; server accepts a look-ahead window and rate-limits fails.
 */
import { createHmac } from "node:crypto";

export const HOTP_WINDOW = 10;
export const HOTP_FAIL_LIMIT = 5;
export const HOTP_FAIL_WINDOW_MS = 10 * 60 * 1000;

type FailBucket = { fails: number; resetAt: number };
const failsByBounty = new Map<string, FailBucket>();

/** RFC 4226 HOTP with HMAC-SHA1 dynamic truncation. */
export function hotp(secret: Buffer, counter: number, digits = 6): string {
  if (!Number.isInteger(counter) || counter < 0) throw new Error("invalid_counter");
  if (!Number.isInteger(digits) || digits < 4 || digits > 10) throw new Error("invalid_digits");
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", secret).update(msg).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const bin =
    ((hmac[offset]! & 0x7f) << 24)
    | ((hmac[offset + 1]! & 0xff) << 16)
    | ((hmac[offset + 2]! & 0xff) << 8)
    | (hmac[offset + 3]! & 0xff);
  const mod = 10 ** digits;
  return String(bin % mod).padStart(digits, "0");
}

/** 4-digit badge display value. */
export function hotp4(secret: Buffer, counter: number): string {
  return hotp(secret, counter, 4);
}

export function parseHotpSecret(hexOrAscii: string): Buffer {
  const trimmed = hexOrAscii.trim();
  if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0 && trimmed.length >= 20) {
    return Buffer.from(trimmed, "hex");
  }
  return Buffer.from(trimmed, "utf8");
}

export function loadHotpSecrets(env = process.env.HOTP_SECRETS): Record<string, string> {
  if (!env?.trim()) return {};
  try {
    const parsed = JSON.parse(env) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) out[id] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Accept code if it matches any counter in [lastCounter+1, lastCounter+window]
 * (PLAN 7.8 look-ahead). When lastCounter is 0 (never used), try 1..window.
 */
export function verifyHotpCode(input: {
  secret: Buffer;
  code: string;
  lastCounter: number;
  window?: number;
  digits?: number;
}): { ok: true; counter: number } | { ok: false } {
  const window = input.window ?? HOTP_WINDOW;
  const digits = input.digits ?? 4;
  const code = input.code.trim();
  if (!/^\d+$/.test(code) || code.length !== digits) return { ok: false };
  const start = input.lastCounter + 1;
  const end = input.lastCounter + window;
  for (let counter = start; counter <= end; counter++) {
    if (counter < 0) continue;
    if (hotp(input.secret, counter, digits) === code) return { ok: true, counter };
  }
  return { ok: false };
}

export function isHotpRateLimited(bountyId: string, now = Date.now()): boolean {
  const bucket = failsByBounty.get(bountyId);
  if (!bucket) return false;
  if (now >= bucket.resetAt) {
    failsByBounty.delete(bountyId);
    return false;
  }
  return bucket.fails >= HOTP_FAIL_LIMIT;
}

export function recordHotpFailure(bountyId: string, now = Date.now()): void {
  const bucket = failsByBounty.get(bountyId);
  if (!bucket || now >= bucket.resetAt) {
    failsByBounty.set(bountyId, { fails: 1, resetAt: now + HOTP_FAIL_WINDOW_MS });
    return;
  }
  bucket.fails += 1;
}

export function clearHotpFailures(bountyId: string): void {
  failsByBounty.delete(bountyId);
}

/** Test helper. */
export function _resetHotpFailuresForTests(): void {
  failsByBounty.clear();
}

export interface HotpQuery {
  query<T extends Record<string, unknown>>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
}

/** Last accepted badge counter from claimed events for this bounty+badge. */
export async function lastHotpCounter(db: HotpQuery, bountyId: string, badgeId: string): Promise<number> {
  const { rows } = await db.query<{ detail: unknown }>(
    `SELECT detail FROM events
     WHERE bounty_id=$1 AND kind='claimed'
     ORDER BY time DESC LIMIT 50`,
    [bountyId],
  );
  for (const row of rows) {
    let detail: unknown = row.detail;
    if (typeof detail === "string") {
      try {
        detail = JSON.parse(detail);
      } catch {
        continue;
      }
    }
    if (!detail || typeof detail !== "object") continue;
    const rec = detail as { badgeId?: string; hotpCounter?: number };
    if (rec.badgeId === badgeId && Number.isInteger(rec.hotpCounter)) return Number(rec.hotpCounter);
  }
  return 0;
}

/**
 * Verify a venue badge code against HOTP_SECRETS and event history.
 * On success returns the counter to persist in the claimed event detail.
 */
export async function verifyBadgeHotp(
  db: HotpQuery,
  input: { bountyId: string; badgeId: string; code: string; now?: number },
): Promise<{ ok: true; counter: number } | { ok: false; reason: "bad_code" | "rate_limited" | "unknown_badge" }> {
  const now = input.now ?? Date.now();
  if (isHotpRateLimited(input.bountyId, now)) return { ok: false, reason: "rate_limited" };
  const secrets = loadHotpSecrets();
  const secretHex = secrets[input.badgeId];
  if (!secretHex) return { ok: false, reason: "unknown_badge" };
  const last = await lastHotpCounter(db, input.bountyId, input.badgeId);
  const result = verifyHotpCode({
    secret: parseHotpSecret(secretHex),
    code: input.code,
    lastCounter: last,
    digits: 4,
  });
  if (!result.ok) {
    recordHotpFailure(input.bountyId, now);
    if (isHotpRateLimited(input.bountyId, now)) return { ok: false, reason: "rate_limited" };
    return { ok: false, reason: "bad_code" };
  }
  clearHotpFailures(input.bountyId);
  return result;
}
