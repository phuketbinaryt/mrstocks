import { z } from 'zod';

// Tolerant schema: accepts all fields used downstream, passes through unknowns
// so a scanner-side schema bump (added field) doesn't break ingest.
export const scanCandidateSchema = z
  .object({
    symbol: z.string().min(1),
    state: z.string().min(1),
    score: z.number(),
    watch: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    as_of: z.string().optional(),
    state_as_of: z.string().optional(),
    last_price: z.number().optional(),
    fast_ma: z.number().optional(),
    slow_ma: z.number().optional(),
    atr: z.number().optional(),
    ma_distance: z.number().optional(),
    ma_distance_atr: z.number().optional(),
    ma_distance_pct: z.number().optional(),
    gap_pct: z.number().nullable().optional(),
    gap_atr: z.number().nullable().optional(),
    fast_slope_atr: z.number().optional(),
    slow_slope_atr: z.number().optional(),
    price_fast_distance_atr: z.number().optional(),
    avg_dollar_volume: z.number().optional(),
    bars: z.number().optional(),
    notes: z.array(z.string()).optional(),
    prior45_position: z.string().nullable().optional(),
    prior45_action: z.string().nullable().optional(),
    prior45_side: z.string().nullable().optional(),
    prior45_bucket: z.number().nullable().optional(),
  })
  .passthrough();

export const scanPayloadSchema = z
  .object({
    scanner: z.string().min(1),
    generated_at: z.string().min(1),
    feed: z.string().optional(),
    bar_seconds: z.number().int().optional(),
    universe_size: z.number().int().optional(),
    candidate_count: z.number().int().nonnegative(),
    settings: z.record(z.string(), z.unknown()).optional(),
    candidates: z.array(scanCandidateSchema),
    errors: z.record(z.string(), z.string()).optional(),
  })
  .passthrough();

export type ScanPayload = z.infer<typeof scanPayloadSchema>;
export type ScanCandidate = z.infer<typeof scanCandidateSchema>;
