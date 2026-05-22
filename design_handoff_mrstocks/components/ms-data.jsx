// Mock scan results + state config for the Opening Scanner dashboard.

const STATES = {
  narrow:            { label: 'NARROW',         tone: 'oklch(0.74 0.17 250)', soft: 'oklch(0.30 0.10 250 / 0.30)' },
  wide_snapback:     { label: 'WIDE SNAPBACK',  tone: 'oklch(0.80 0.16 72)',  soft: 'oklch(0.34 0.10 72 / 0.30)'  },
  trending_near_20:  { label: 'TRENDING',       tone: 'oklch(0.78 0.16 150)', soft: 'oklch(0.30 0.10 150 / 0.30)' },
  watch_loose:       { label: 'WATCH LOOSE',    tone: 'oklch(0.76 0.12 200)', soft: 'oklch(0.30 0.09 200 / 0.30)' },
  too_tight:         { label: 'TOO TIGHT',      tone: 'oklch(0.62 0.01 250)', soft: 'oklch(0.30 0.005 250 / 0.40)' },
  middle:            { label: 'MIDDLE',         tone: 'oklch(0.70 0.01 250)', soft: 'oklch(0.30 0.005 250 / 0.40)' },
};

const ZONES = ['Inside', 'Upper #1', 'Upper #2', 'Upper #3', 'Lower #1', 'Lower #2', 'Lower #3'];

const STATE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'narrow', label: 'Narrow' },
  { id: 'wide_snapback', label: 'Wide snapback' },
  { id: 'trending_near_20', label: 'Trend' },
  { id: 'watch_loose', label: 'Watch loose' },
  { id: 'too_tight', label: 'Too tight' },
  { id: 'middle', label: 'Middle' },
];

const ZONE_FILTERS = [
  { id: 'all', label: 'All zones' },
  { id: 'Inside', label: 'Inside' },
  { id: 'Upper #1', label: 'Upper #1' },
  { id: 'Upper #2', label: 'Upper #2' },
  { id: 'Upper #3', label: 'Upper #3' },
  { id: 'Lower #1', label: 'Lower #1' },
  { id: 'Lower #2', label: 'Lower #2' },
  { id: 'Lower #3', label: 'Lower #3' },
];

const WATCHLISTS = [
  { id: 'all', name: 'All signals', count: 47 },
  { id: 'tech_leaders', name: 'Tech leaders', count: 12 },
  { id: 'megacaps', name: 'Megacaps', count: 8 },
  { id: 'momo', name: 'Momentum book', count: 19 },
  { id: 'overnight_gappers', name: 'Overnight gappers', count: 6 },
];

// Extended watchlist data — for Screen 3 (member-edited collections).
const WATCHLIST_DETAIL = [
  { id: 'tech_leaders',       name: 'Tech leaders',       symbols: ['NVDA','AAPL','MSFT','GOOGL','META','AMZN','AMD','TSLA','AVGO','NFLX','PLTR','ORCL'], isDefault: true,  updated: '20-MAY 08:14', hitsToday: 7 },
  { id: 'megacaps',           name: 'Megacaps',           symbols: ['AAPL','MSFT','GOOGL','AMZN','META','NVDA','TSLA','AVGO'],                              isDefault: false, updated: '18-MAY 14:02', hitsToday: 5 },
  { id: 'momo',               name: 'Momentum book',      symbols: ['PLTR','AMD','SOFI','COIN','MARA','RIOT','HOOD','ARM','SMCI','ANET','MU','MSTR','DELL','APP','CRWD','PANW','SNOW','DDOG','MDB'], isDefault: false, updated: '20-MAY 09:14', hitsToday: 11 },
  { id: 'overnight_gappers',  name: 'Overnight gappers',  symbols: ['PLTR','AMD','CRM','NFLX','META','TSLA'],                                              isDefault: false, updated: '20-MAY 09:11', hitsToday: 3 },
  { id: 'banks',              name: 'Banks · IBKR',       symbols: ['JPM','BAC','WFC','C','GS','MS','SCHW','USB'],                                         isDefault: false, updated: '15-MAY 11:47', hitsToday: 0 },
  { id: 'new_idea',           name: 'New idea',           symbols: [],                                                                                     isDefault: false, updated: '20-MAY 07:02', hitsToday: 0 },
];

const SCAN_RESULTS = [
  { symbol: 'NVDA',  price:  487.21, gap:  2.14, score: 100, state: 'narrow',           dir: 'long_above', maDistAtr: 0.31, maDistPct: 0.04, atr: 0.41, volUsd: '218.4M', slopeFast:  1.84, zone: 'Inside',   starred: true  },
  { symbol: 'AAPL',  price:  229.95, gap:  1.82, score: 96,  state: 'narrow',           dir: 'long_above', maDistAtr: 0.48, maDistPct: 0.06, atr: 0.30, volUsd:  '94.7M', slopeFast:  1.53, zone: 'Inside',   starred: true  },
  { symbol: 'MSFT',  price:  412.34, gap:  0.84, score: 94,  state: 'trending_near_20', dir: 'long_above', maDistAtr: 0.62, maDistPct: 0.07, atr: 0.52, volUsd: '142.8M', slopeFast:  2.04, zone: 'Upper #1', starred: false },
  { symbol: 'GOOGL', price:  172.41, gap:  1.21, score: 92,  state: 'narrow',           dir: 'long_above', maDistAtr: 0.44, maDistPct: 0.05, atr: 0.36, volUsd:  '88.1M', slopeFast:  1.41, zone: 'Inside',   starred: true  },
  { symbol: 'META',  price:  523.18, gap: -0.42, score: 88,  state: 'wide_snapback',    dir: 'short_below', maDistAtr: 1.18, maDistPct: 0.18, atr: 0.74, volUsd: '116.2M', slopeFast: -0.92, zone: 'Upper #2', starred: false },
  { symbol: 'AMZN',  price:  186.72, gap:  0.94, score: 87,  state: 'narrow',           dir: 'long_above', maDistAtr: 0.52, maDistPct: 0.07, atr: 0.38, volUsd: '104.9M', slopeFast:  1.18, zone: 'Inside',   starred: true  },
  { symbol: 'AMD',   price:  156.83, gap:  1.47, score: 85,  state: 'trending_near_20', dir: 'long_above', maDistAtr: 0.78, maDistPct: 0.11, atr: 0.62, volUsd:  '82.4M', slopeFast:  1.96, zone: 'Upper #1', starred: false },
  { symbol: 'TSLA',  price:  245.12, gap: -1.28, score: 82,  state: 'wide_snapback',    dir: 'short_below', maDistAtr: 1.42, maDistPct: 0.22, atr: 0.91, volUsd: '173.5M', slopeFast: -1.12, zone: 'Lower #1', starred: false },
  { symbol: 'AVGO',  price: 1683.41, gap:  0.42, score: 78,  state: 'watch_loose',      dir: 'long_above', maDistAtr: 0.94, maDistPct: 0.13, atr: 1.84, volUsd:  '64.2M', slopeFast:  0.62, zone: 'Inside',   starred: false },
  { symbol: 'PLTR',  price:   24.83, gap:  2.61, score: 76,  state: 'narrow',           dir: 'long_above', maDistAtr: 0.58, maDistPct: 0.09, atr: 0.18, volUsd:  '48.7M', slopeFast:  1.28, zone: 'Upper #2', starred: true  },
  { symbol: 'NFLX',  price:  681.27, gap:  0.18, score: 71,  state: 'middle',           dir: 'wait',       maDistAtr: 0.81, maDistPct: 0.10, atr: 0.88, volUsd:  '52.1M', slopeFast:  0.42, zone: 'Inside',   starred: false },
  { symbol: 'ORCL',  price:  142.18, gap:  0.21, score: 67,  state: 'too_tight',        dir: 'wait',       maDistAtr: 0.12, maDistPct: 0.02, atr: 0.24, volUsd:  '38.9M', slopeFast:  0.18, zone: 'Inside',   starred: false },
];

// Alert rules — Screen 4 mock data.
const ALERT_RULES = [
  { id: 'r_aplus_tech',     name: 'A+ tech setups',       enabled: true,  states: ['narrow','wide_snapback'],                  zones: ['Inside'],                  watchlist: 'tech_leaders',  minScore: 85, channels: ['email','push'], lastFired: '20-MAY 09:15', hitsWeek: 14 },
  { id: 'r_megacap_snap',   name: 'Megacap snapbacks',    enabled: true,  states: ['wide_snapback'],                            zones: ['Upper #1','Upper #2'],     watchlist: 'megacaps',      minScore: 75, channels: ['push'],          lastFired: '19-MAY 09:17', hitsWeek: 8  },
  { id: 'r_inside_any',     name: 'Inside zone — any state', enabled: false, states: ['narrow','trending_near_20','watch_loose'], zones: ['Inside'],                watchlist: null,            minScore: 70, channels: ['email'],         lastFired: '15-MAY 09:15', hitsWeek: 3  },
  { id: 'r_momo_aplus',     name: 'Momentum book — A+',   enabled: true,  states: ['narrow','trending_near_20'],                zones: ['Inside','Upper #1'],       watchlist: 'momo',          minScore: 90, channels: ['email','push'], lastFired: '20-MAY 09:15', hitsWeek: 22 },
];

window.MS_DATA = { STATES, ZONES, STATE_FILTERS, ZONE_FILTERS, WATCHLISTS, WATCHLIST_DETAIL, SCAN_RESULTS, ALERT_RULES };
