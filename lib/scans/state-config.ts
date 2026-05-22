// Setup-state palette + filter chip configs. STATES is configuration,
// not mock data — adding a new state means extending this map.

export interface StateConfig {
  label: string;
  tone: string; // oklch() — text + dot color
  soft: string; // oklch() with alpha — badge background
}

export const STATES: Record<string, StateConfig> = {
  narrow: {
    label: 'NARROW',
    tone: 'oklch(0.74 0.17 250)',
    soft: 'oklch(0.30 0.10 250 / 0.30)',
  },
  wide_snapback: {
    label: 'WIDE SNAPBACK',
    tone: 'oklch(0.80 0.16 72)',
    soft: 'oklch(0.34 0.10 72 / 0.30)',
  },
  trending_near_20: {
    label: 'TRENDING',
    tone: 'oklch(0.78 0.16 150)',
    soft: 'oklch(0.30 0.10 150 / 0.30)',
  },
  watch_loose: {
    label: 'WATCH LOOSE',
    tone: 'oklch(0.76 0.12 200)',
    soft: 'oklch(0.30 0.09 200 / 0.30)',
  },
  too_tight: {
    label: 'TOO TIGHT',
    tone: 'oklch(0.62 0.01 250)',
    soft: 'oklch(0.30 0.005 250 / 0.40)',
  },
  middle: {
    label: 'MIDDLE',
    tone: 'oklch(0.70 0.01 250)',
    soft: 'oklch(0.30 0.005 250 / 0.40)',
  },
};
