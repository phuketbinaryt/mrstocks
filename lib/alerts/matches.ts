import type { AlertRule, CandidateForMatch } from './types';

export interface MatchContext {
  /** Symbols on the rule's watchlist. Undefined or empty => no watchlist filter. */
  watchlistSymbols?: Set<string>;
}

/**
 * Pure predicate: does this candidate match the rule?
 *
 * Does NOT consult the DB. Caller must pre-resolve watchlist symbols if the
 * rule has a watchlistId. This makes the predicate trivially testable and
 * lets the worker batch one watchlist-fetch across many rules in evaluate.
 */
export function ruleMatches(
  rule: Pick<AlertRule, 'states' | 'zones' | 'minScore' | 'watchlistId'>,
  candidate: CandidateForMatch,
  ctx: MatchContext = {},
): boolean {
  // State chip filter.
  if (rule.states.length > 0 && !rule.states.includes(candidate.state)) {
    return false;
  }

  // Zone chip filter (normalize the human-string prior45_position to a chip id).
  const zoneId = normalizeZone(candidate.prior45Position ?? '');
  if (rule.zones.length > 0 && !rule.zones.includes(zoneId)) {
    return false;
  }

  // Min-score gate. score is stored as a Postgres numeric => Drizzle returns string.
  const score = Number(candidate.score ?? 0);
  if (Number.isFinite(score) && score < Number(rule.minScore ?? 0)) {
    return false;
  }

  // Optional watchlist filter — only enforce if a watchlist is set and the
  // caller passed in the resolved symbol set. An empty set means "rule has a
  // watchlist but it's empty" => no symbol can match.
  if (rule.watchlistId && ctx.watchlistSymbols) {
    if (!ctx.watchlistSymbols.has(candidate.symbol)) return false;
  }

  return true;
}

/**
 * Maps the scanner's free-text prior45_position values onto the chip IDs the
 * UI exposes. Lowercase + substring match, in priority order (longest first).
 */
export function normalizeZone(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes('upper #1') || r.includes('upper 1')) return 'upper_1';
  if (r.includes('upper #2') || r.includes('upper 2')) return 'upper_2';
  if (r.includes('upper #3') || r.includes('upper 3')) return 'upper_3';
  if (r.includes('lower #1') || r.includes('lower 1')) return 'lower_1';
  if (r.includes('lower #2') || r.includes('lower 2')) return 'lower_2';
  if (r.includes('lower #3') || r.includes('lower 3')) return 'lower_3';
  if (r.includes('inside')) return 'inside';
  return 'unknown';
}
