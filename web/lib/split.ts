// (beta, H)-almost-uniform split. H = 8 matches web/lib/types.ts.
// Each relay gets floor(B/16); the finder absorbs rounding, so shares sum to B.
// A finder who inserts k fake hops collects the same total as they did honestly.

const H = 8;

export function splitCents(h: number, B: number): { relay: number; finder: number } | null {
  if (h < 1 || h > H || !Number.isInteger(h)) return null;
  const relay = Math.floor(B / 16);
  return { relay, finder: B - (h - 1) * relay };
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

export function attackComparison(h: number, k: number, budgetCents: number): AttackComparison | null {
  if (k < 0 || !Number.isInteger(k) || budgetCents < 0) return null;
  const honest = splitCents(h, budgetCents);
  if (!honest) return null;

  const attacked = splitCents(h + k, budgetCents);
  const oursWith = attacked ? k * attacked.relay + attacked.finder : 0;
  const oursPoster = attacked ? budgetCents : 0;
  const oursGain = honest.finder === 0 ? 0 : ((oursWith - honest.finder) / honest.finder) * 100;

  return {
    h,
    k,
    budgetCents,
    ours: {
      honestFinder: honest.finder,
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
