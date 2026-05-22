import type { InferSelectModel } from 'drizzle-orm';
import type { watchlists, watchlistSymbols } from '@/lib/db/schema';

export type Watchlist = InferSelectModel<typeof watchlists>;
export type WatchlistSymbol = InferSelectModel<typeof watchlistSymbols>;

export interface WatchlistSummary {
  id: string;
  name: string;
  isDefault: boolean;
  symbolCount: number;
  hitsToday: number;
  updatedAt: Date;
}

export interface WatchlistWithSymbols extends Watchlist {
  symbols: string[];
}
