// Filter chip configs for the dashboard. Lifted from the design's ms-data.jsx
// — keep these in sync with the available STATES and Prior45 zone enum.

export interface FilterChip {
  id: string;
  label: string;
}

export const STATE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'narrow', label: 'Narrow' },
  { id: 'wide_snapback', label: 'Wide snapback' },
  { id: 'trending_near_20', label: 'Trend' },
  { id: 'watch_loose', label: 'Watch loose' },
  { id: 'too_tight', label: 'Too tight' },
  { id: 'middle', label: 'Middle' },
];

export const ZONE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All zones' },
  { id: 'inside', label: 'Inside' },
  { id: 'upper_1', label: 'Upper #1' },
  { id: 'upper_2', label: 'Upper #2' },
  { id: 'upper_3', label: 'Upper #3' },
  { id: 'lower_1', label: 'Lower #1' },
  { id: 'lower_2', label: 'Lower #2' },
  { id: 'lower_3', label: 'Lower #3' },
];
