// Curated, static sample of a scan for the PUBLIC marketing landing page.
//
// IMPORTANT: this is illustrative, not live. The public landing must NOT call
// the DB (it's anonymous, could be stale/empty pre-market, and adds latency).
// Sections that render this data label it honestly as "a sample of a recent
// scan." All state ids and zone strings here MUST match the real scanner
// vocabulary in lib/scans/state-config.ts + lib/scans/filters-config.ts.

import { STATES } from '@/lib/scans/state-config';

export interface MarketingSampleRow {
  symbol: string;
  /** Last price in USD. */
  price: number;
  /** Pre-market gap, percent (signed). */
  gap: number;
  /** Cluster-tightness score, 0–100. */
  score: number;
  /** One of the six real state ids (see lib/scans/state-config.ts). */
  state: string;
  /** Prior45 position string — one of the seven real zones. */
  zone: string;
}

/**
 * ~12 representative large-caps with plausible states + scores + zones.
 * Hand-curated for the landing page; not pulled from a live scan.
 */
export const MARKETING_SAMPLE: MarketingSampleRow[] = [
  { symbol: 'NVDA', price: 138.42, gap: 1.24, score: 100, state: 'narrow', zone: 'Inside' },
  { symbol: 'AAPL', price: 212.85, gap: 0.62, score: 96, state: 'narrow', zone: 'Inside' },
  { symbol: 'MSFT', price: 448.19, gap: 0.88, score: 94, state: 'trending_near_20', zone: 'Upper #1' },
  { symbol: 'META', price: 583.04, gap: -0.41, score: 88, state: 'wide_snapback', zone: 'Lower #1' },
  { symbol: 'AMD', price: 162.77, gap: 1.05, score: 85, state: 'trending_near_20', zone: 'Upper #2' },
  { symbol: 'GOOGL', price: 176.33, gap: 0.34, score: 91, state: 'narrow', zone: 'Inside' },
  { symbol: 'AMZN', price: 201.58, gap: -0.27, score: 82, state: 'wide_snapback', zone: 'Lower #2' },
  { symbol: 'TSLA', price: 248.91, gap: 2.13, score: 78, state: 'watch_loose', zone: 'Upper #3' },
  { symbol: 'AVGO', price: 167.42, gap: 0.71, score: 89, state: 'trending_near_20', zone: 'Upper #1' },
  { symbol: 'NFLX', price: 905.16, gap: -0.18, score: 74, state: 'too_tight', zone: 'Inside' },
  { symbol: 'CRM', price: 271.05, gap: 0.49, score: 80, state: 'middle', zone: 'Lower #1' },
  { symbol: 'JPM', price: 244.62, gap: 0.22, score: 86, state: 'narrow', zone: 'Lower #3' },
];

/**
 * State id → oklch tone, lifted from the canonical STATES palette so the
 * marketing dots/labels match the dashboard exactly.
 */
export const STATE_TONES: Record<string, string> = Object.fromEntries(
  Object.entries(STATES).map(([id, cfg]) => [id, cfg.tone]),
);
