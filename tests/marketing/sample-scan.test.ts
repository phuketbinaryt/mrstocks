import { describe, it, expect } from 'vitest';
import { MARKETING_SAMPLE, STATE_TONES } from '@/lib/marketing/sample-scan';
import { STATES } from '@/lib/scans/state-config';
import { normalizeZone } from '@/lib/alerts/matches';

const REAL_STATE_IDS = Object.keys(STATES);
const REAL_ZONE_IDS = new Set([
  'inside',
  'upper_1',
  'upper_2',
  'upper_3',
  'lower_1',
  'lower_2',
  'lower_3',
]);

describe('MARKETING_SAMPLE', () => {
  it('is a non-trivial curated set', () => {
    expect(MARKETING_SAMPLE.length).toBeGreaterThanOrEqual(10);
  });

  it('only uses the six real state ids', () => {
    for (const row of MARKETING_SAMPLE) {
      expect(REAL_STATE_IDS).toContain(row.state);
    }
  });

  it('uses zone strings that normalize to a real zone chip (no "unknown")', () => {
    for (const row of MARKETING_SAMPLE) {
      const id = normalizeZone(row.zone);
      expect(REAL_ZONE_IDS.has(id), `${row.symbol} zone "${row.zone}" -> ${id}`).toBe(true);
    }
  });

  it('has plausible scores in 0..100', () => {
    for (const row of MARKETING_SAMPLE) {
      expect(row.score).toBeGreaterThanOrEqual(0);
      expect(row.score).toBeLessThanOrEqual(100);
    }
  });
});

describe('STATE_TONES', () => {
  it('maps every real state id to its canonical tone', () => {
    for (const [id, cfg] of Object.entries(STATES)) {
      expect(STATE_TONES[id]).toBe(cfg.tone);
    }
  });
});

describe('RuleSandbox match logic (mirror of the component filter)', () => {
  const matchCount = (states: string[], zones: string[], minScore: number) =>
    MARKETING_SAMPLE.filter(
      (r) => states.includes(r.state) && zones.includes(normalizeZone(r.zone)) && r.score >= minScore,
    ).length;

  it('default rule (narrow+wide_snapback, inside, >=85) returns the expected NARROW inside names', () => {
    const matches = MARKETING_SAMPLE.filter(
      (r) =>
        ['narrow', 'wide_snapback'].includes(r.state) &&
        ['inside'].includes(normalizeZone(r.zone)) &&
        r.score >= 85,
    );
    // NVDA(100), AAPL(96), GOOGL(91) are narrow + Inside + >=85.
    expect(matches.map((m) => m.symbol).sort()).toEqual(['AAPL', 'GOOGL', 'NVDA']);
  });

  it('lowering the score never decreases the match count', () => {
    const hi = matchCount(REAL_STATE_IDS, [...REAL_ZONE_IDS], 90);
    const lo = matchCount(REAL_STATE_IDS, [...REAL_ZONE_IDS], 70);
    expect(lo).toBeGreaterThanOrEqual(hi);
  });

  it('empty state selection yields zero matches', () => {
    expect(matchCount([], ['inside'], 0)).toBe(0);
  });
});
