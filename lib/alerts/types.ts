import type { InferSelectModel } from 'drizzle-orm';
import type { alertRules, notifications, scanCandidates } from '@/lib/db/schema';

export type AlertRule = InferSelectModel<typeof alertRules>;
export type Notification = InferSelectModel<typeof notifications>;

/**
 * Subset of scan_candidates we need to evaluate a rule against. Keeping this
 * narrow lets the pure predicate be unit-tested without a DB.
 */
export type CandidateForMatch = Pick<
  InferSelectModel<typeof scanCandidates>,
  'symbol' | 'state' | 'prior45Position' | 'score'
>;

/**
 * Channel chips persisted in alert_rules.channels. v1 surface: email + webpush.
 */
export type AlertChannel = 'email' | 'webpush';

/**
 * Zone IDs used both in the UI chip filter and the predicate.
 */
export type ZoneId =
  | 'inside'
  | 'upper_1'
  | 'upper_2'
  | 'upper_3'
  | 'lower_1'
  | 'lower_2'
  | 'lower_3';

export const ALL_ZONES: ZoneId[] = [
  'inside',
  'upper_1',
  'upper_2',
  'upper_3',
  'lower_1',
  'lower_2',
  'lower_3',
];

/**
 * Setup states from the scanner. Mirrors W4_STATE_FILTERS in the design data.
 */
export const ALL_STATES = [
  'narrow',
  'wide_snapback',
  'wide_extension',
  'medium',
] as const;
export type StateId = (typeof ALL_STATES)[number];
