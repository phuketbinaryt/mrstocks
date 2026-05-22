import { describe, it, expect } from 'vitest';
import { ruleMatches, normalizeZone } from '@/lib/alerts/matches';

const candidate = {
  symbol: 'NVDA',
  state: 'narrow',
  prior45Position: 'inside #1',
  score: '95',
} as const;

describe('normalizeZone', () => {
  it('maps inside variants to "inside"', () => {
    expect(normalizeZone('Inside')).toBe('inside');
    // "inside #1" technically falls back to plain "inside" because the
    // upper/lower checks don't match.
    expect(normalizeZone('inside #1')).toBe('inside');
  });
  it('maps Upper #2 to upper_2', () => {
    expect(normalizeZone('Upper #2')).toBe('upper_2');
  });
  it('maps Lower #3 to lower_3', () => {
    expect(normalizeZone('Lower #3')).toBe('lower_3');
  });
  it('returns unknown for garbage', () => {
    expect(normalizeZone('???')).toBe('unknown');
  });
});

describe('ruleMatches', () => {
  it('matches when all axes align', () => {
    expect(
      ruleMatches(
        { states: ['narrow'], zones: ['inside'], minScore: '90', watchlistId: null },
        candidate,
      ),
    ).toBe(true);
  });

  it('rejects when state is wrong', () => {
    expect(
      ruleMatches(
        { states: ['wide_snapback'], zones: ['inside'], minScore: '0', watchlistId: null },
        candidate,
      ),
    ).toBe(false);
  });

  it('rejects when zone is wrong', () => {
    expect(
      ruleMatches(
        { states: ['narrow'], zones: ['upper_2'], minScore: '0', watchlistId: null },
        candidate,
      ),
    ).toBe(false);
  });

  it('rejects when score is below min', () => {
    expect(
      ruleMatches(
        { states: ['narrow'], zones: ['inside'], minScore: '99', watchlistId: null },
        candidate,
      ),
    ).toBe(false);
  });

  it('rejects when symbol not in watchlist', () => {
    expect(
      ruleMatches(
        {
          states: ['narrow'],
          zones: ['inside'],
          minScore: '0',
          watchlistId: 'wl-xyz',
        },
        candidate,
        { watchlistSymbols: new Set(['AAPL']) },
      ),
    ).toBe(false);
  });

  it('passes when symbol IS in watchlist', () => {
    expect(
      ruleMatches(
        {
          states: ['narrow'],
          zones: ['inside'],
          minScore: '0',
          watchlistId: 'wl-xyz',
        },
        candidate,
        { watchlistSymbols: new Set(['NVDA']) },
      ),
    ).toBe(true);
  });

  it('ignores watchlist filter when watchlistId is null', () => {
    expect(
      ruleMatches(
        { states: ['narrow'], zones: ['inside'], minScore: '0', watchlistId: null },
        candidate,
        { watchlistSymbols: new Set(['IRRELEVANT']) },
      ),
    ).toBe(true);
  });

  it('treats null/undefined score as 0', () => {
    expect(
      ruleMatches(
        { states: ['narrow'], zones: ['inside'], minScore: '50', watchlistId: null },
        { ...candidate, score: null as unknown as string },
      ),
    ).toBe(false);
  });

  it('OR-matches across multiple states', () => {
    expect(
      ruleMatches(
        {
          states: ['narrow', 'wide_snapback'],
          zones: ['inside'],
          minScore: '0',
          watchlistId: null,
        },
        candidate,
      ),
    ).toBe(true);
  });
});
