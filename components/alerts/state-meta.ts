// Shared label + tone meta for setup states and zones. Mirrors W4_STATES /
// W4_ZONES from the design's MS_DATA.
import type { StateId, ZoneId } from '@/lib/alerts/types';

export const STATE_META: Record<StateId, { label: string; tone: string }> = {
  narrow: { label: 'NARROW', tone: 'oklch(0.82 0.16 75)' },
  wide_snapback: { label: 'WIDE SNAPBACK', tone: 'oklch(0.78 0.16 150)' },
  wide_extension: { label: 'WIDE EXTENSION', tone: 'oklch(0.74 0.20 25)' },
  medium: { label: 'MEDIUM', tone: 'oklch(0.78 0.12 200)' },
};

export const ZONE_LABEL: Record<ZoneId, string> = {
  inside: 'INSIDE',
  upper_1: 'UPPER #1',
  upper_2: 'UPPER #2',
  upper_3: 'UPPER #3',
  lower_1: 'LOWER #1',
  lower_2: 'LOWER #2',
  lower_3: 'LOWER #3',
};
