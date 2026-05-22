// Thin re-export so client components can import Server Actions via the
// standard app/ path without leaking the 'server-only' boundary.
export {
  createWatchlist,
  renameWatchlist,
  deleteWatchlist,
  setDefaultWatchlist,
  addSymbol,
  removeSymbol,
} from '@/lib/watchlists/actions';
