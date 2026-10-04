// Last-passer split. H = 8 matches web/lib/types.ts.
// h = 1: the match gets all of B. There is no passer.
// h >= 2: the match gets B - 7*floor(B/16). That floor does not shrink as h grows.
// Every passer except the last gets floor(B/16). The last passer gets the remainder.
// Shares sum to B. A chain shorter than 1 or longer than 8 pays nobody.
// A last passer who adds one hop they control collects the same total.
// An earlier passer who adds one hop they control gains one floor(B/16), taken from the last passer.
// The match who adds one hop they control keeps the match payout and also collects the new last-passer share.

const H = 8;

export interface HopSplit {
  earlyPasser: number;
  lastPasser: number;
  match: number;
}

export function splitCents(h: number, B: number): HopSplit | null {
  if (h < 1 || h > H || !Number.isInteger(h)) return null;
  const earlyPasser = Math.floor(B / 16);
  if (h === 1) return { earlyPasser, lastPasser: 0, match: B };
  const match = B - 7 * earlyPasser;
  const lastPasser = B - match - (h - 2) * earlyPasser;
  return { earlyPasser, lastPasser, match };
}

export function depthCents(split: HopSplit, depth: number, h: number): number {
  if (depth === h) return split.match;
  if (depth === h - 1) return split.lastPasser;
  return split.earlyPasser;
}

export interface SchemeTake {
  honestFinder: number;
  withFakes: number;
  gainPct: number;
  posterPays: number;
}

export interface AttackComparison {
  h: number;
  k: number;
  budgetCents: number;
  ours: SchemeTake;
  mit: SchemeTake;
}

/** MIT geometric rule: finder gets X, recruiter X/2, and so on. X is the budget. */
function mitGainPct(k: number): number {
  if (k <= 0) return 0;
  return (1 - 2 ** -k) * 100;
}

function mitSeriesCents(X: number, terms: number): number {
  if (terms <= 0) return 0;
  return Math.round((X * (2 ** terms - 1)) / 2 ** (terms - 1));
}

/** Match inserts k hops they control immediately before themselves. */
function matchWithFakes(h: number, k: number, B: number): number {
  const attacked = splitCents(h + k, B);
  if (!attacked) return 0;
  if (k === 0) return attacked.match;
  return (k - 1) * attacked.earlyPasser + attacked.lastPasser + attacked.match;
}

export function attackComparison(h: number, k: number, budgetCents: number): AttackComparison | null {
  if (k < 0 || !Number.isInteger(k) || budgetCents < 0) return null;
  const honest = splitCents(h, budgetCents);
  if (!honest) return null;

  const attacked = splitCents(h + k, budgetCents);
  const oursWith = matchWithFakes(h, k, budgetCents);
  const oursPoster = attacked ? budgetCents : 0;
  const oursGain = honest.match === 0 ? 0 : ((oursWith - honest.match) / honest.match) * 100;

  return {
    h,
    k,
    budgetCents,
    ours: {
      honestFinder: honest.match,
      withFakes: oursWith,
      gainPct: oursGain,
      posterPays: oursPoster,
    },
    mit: {
      honestFinder: budgetCents,
      withFakes: mitSeriesCents(budgetCents, k + 1),
      gainPct: mitGainPct(k),
      posterPays: mitSeriesCents(budgetCents, h + k),
    },
  };
}
