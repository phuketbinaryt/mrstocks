// Shape of one candidate row as the dashboard consumes it. We project this
// from the DB row (which stores numerics as Postgres `numeric` -> string)
// plus the original JSON blob in `data` (which preserves numbers as numbers).

export interface DashboardCandidate {
  symbol: string;
  state: string; // narrow / wide_snapback / trending_near_20 / watch_loose / too_tight / middle
  watch: string | null; // e.g. LONG_IF_OPEN_ABOVE_CLUSTER
  location: string | null; // above_cluster / below_cluster / inside
  prior45Position: string | null; // Inside / Upper #1..3 / Lower #1..3
  prior45Action: string | null;

  // Numeric — projected from `data` JSON (preserves precision).
  score: number;
  lastPrice: number;
  gap: number; // % — derived from gap_pct in source JSON
  maDistanceAtr: number;
  maDistancePct: number;
  atr: number;
  avgDollarVolume: number;
  slopeFast: number; // fast_slope_atr in source JSON
}

interface RawCandidateData {
  score?: number;
  last_price?: number;
  gap_pct?: number;
  ma_distance_atr?: number;
  ma_distance_pct?: number;
  atr?: number;
  avg_dollar_volume?: number;
  fast_slope_atr?: number;
}

interface DbCandidateRow {
  symbol: string;
  state: string;
  watch: string | null;
  location: string | null;
  prior45Position: string | null;
  prior45Action: string | null;
  score: string | null;
  lastPrice: string | null;
  maDistanceAtr: string | null;
  maDistancePct: string | null;
  gapAtr: string | null;
  avgDollarVolume: string | null;
  data: unknown;
}

function n(s: string | null, fallback = 0): number {
  if (s === null || s === undefined) return fallback;
  const v = Number(s);
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Project a DB candidate row into the dashboard's shape. We prefer values
 * from the JSON `data` blob (numbers preserved) and fall back to the
 * top-level numeric columns when the JSON is missing a field.
 */
export function toDashboardCandidate(row: DbCandidateRow): DashboardCandidate {
  const data = (row.data ?? {}) as RawCandidateData;
  return {
    symbol: row.symbol,
    state: row.state,
    watch: row.watch,
    location: row.location,
    prior45Position: row.prior45Position,
    prior45Action: row.prior45Action,
    score: data.score ?? n(row.score),
    lastPrice: data.last_price ?? n(row.lastPrice),
    gap: data.gap_pct ?? 0,
    maDistanceAtr: data.ma_distance_atr ?? n(row.maDistanceAtr),
    maDistancePct: data.ma_distance_pct ?? n(row.maDistancePct),
    atr: data.atr ?? 0,
    avgDollarVolume: data.avg_dollar_volume ?? n(row.avgDollarVolume),
    slopeFast: data.fast_slope_atr ?? 0,
  };
}
