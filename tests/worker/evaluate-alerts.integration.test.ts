import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import {
  users,
  watchlists,
  watchlistSymbols,
  alertRules,
  scans,
  scanCandidates,
} from '@/lib/db/schema';

// Capture jobs sent to the queues without booting a real BullMQ instance.
const enqueued: Array<{ queue: string; name: string; data: unknown }> = [];

vi.mock('@/lib/queue/queues', () => {
  const add = (queueName: string) => async (name: string, data: unknown) => {
    enqueued.push({ queue: queueName, name, data });
  };
  return {
    getEvaluateAlertsQueue: () => ({ add: add('evaluate-alerts') }),
    getSendEmailQueue: () => ({ add: add('send-email') }),
    getSendWebpushQueue: () => ({ add: add('send-webpush') }),
    QUEUE_NAMES: {
      evaluateAlerts: 'evaluate-alerts',
      sendEmail: 'send-email',
      sendWebpush: 'send-webpush',
    },
  };
});

// Import AFTER the mock so the worker module picks up the stubs.
const { runEvaluateAlerts } = await import('@/worker/evaluate-alerts');

const url = process.env.DATABASE_URL!;
const client = postgres(url, { max: 1 });
const db = drizzle(client, {
  schema: {
    users,
    watchlists,
    watchlistSymbols,
    alertRules,
    scans,
    scanCandidates,
  },
});

const EMAIL = `alerts-eval-${Date.now()}@example.com`;
let userId = '';
let scanId = '';
let ruleEmailId = '';
let ruleBothId = '';
let ruleInactiveId = '';
let ruleMissId = '';
let ruleWatchlistId = '';
let watchlistAId = '';

describe('runEvaluateAlerts integration', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ email: EMAIL })
      .returning({ id: users.id });
    userId = u.id;

    // Insert a scan + 3 candidates that span a couple of states/scores/zones.
    const [s] = await db
      .insert(scans)
      .values({
        generatedAt: new Date(),
        scannerName: 'test',
        candidateCount: 3,
        raw: { test: true },
      })
      .returning({ id: scans.id });
    scanId = s.id;

    await db.insert(scanCandidates).values([
      {
        scanId,
        symbol: 'NVDA',
        state: 'narrow',
        prior45Position: 'Inside',
        score: '95',
        data: {},
      },
      {
        scanId,
        symbol: 'AAPL',
        state: 'narrow',
        prior45Position: 'Upper #1',
        score: '70',
        data: {},
      },
      {
        scanId,
        symbol: 'TSLA',
        state: 'wide_snapback',
        prior45Position: 'Lower #2',
        score: '88',
        data: {},
      },
    ]);

    // Watchlist with just NVDA + a rule scoped to it.
    const [wlA] = await db
      .insert(watchlists)
      .values({ userId, name: 'Mega tech', isDefault: false })
      .returning({ id: watchlists.id });
    watchlistAId = wlA.id;
    await db
      .insert(watchlistSymbols)
      .values({ watchlistId: watchlistAId, symbol: 'NVDA' });

    // Rules under test.
    const [r1] = await db
      .insert(alertRules)
      .values({
        userId,
        name: 'narrow-inside-email',
        active: true,
        states: ['narrow'],
        zones: ['inside'],
        watchlistId: null,
        minScore: '90',
        channels: ['email'],
      })
      .returning({ id: alertRules.id });
    ruleEmailId = r1.id;

    const [r2] = await db
      .insert(alertRules)
      .values({
        userId,
        name: 'wide-snapback-both',
        active: true,
        states: ['wide_snapback'],
        zones: ['lower_2'],
        watchlistId: null,
        minScore: '0',
        channels: ['email', 'webpush'],
      })
      .returning({ id: alertRules.id });
    ruleBothId = r2.id;

    const [r3] = await db
      .insert(alertRules)
      .values({
        userId,
        name: 'inactive-noop',
        active: false,
        states: ['narrow'],
        zones: ['inside'],
        watchlistId: null,
        minScore: '0',
        channels: ['email'],
      })
      .returning({ id: alertRules.id });
    ruleInactiveId = r3.id;

    const [r4] = await db
      .insert(alertRules)
      .values({
        userId,
        name: 'no-match',
        active: true,
        states: ['medium'],
        zones: ['upper_3'],
        watchlistId: null,
        minScore: '0',
        channels: ['email'],
      })
      .returning({ id: alertRules.id });
    ruleMissId = r4.id;

    const [r5] = await db
      .insert(alertRules)
      .values({
        userId,
        name: 'watchlist-scoped',
        active: true,
        states: ['narrow'],
        zones: ['inside'],
        watchlistId: watchlistAId,
        minScore: '0',
        channels: ['email'],
      })
      .returning({ id: alertRules.id });
    ruleWatchlistId = r5.id;

    enqueued.length = 0;
  });

  afterAll(async () => {
    // Clean up — cascade from users will remove rules + scans rows.
    await db.delete(users).where(eq(users.id, userId));
    await client.end({ timeout: 1 });
  });

  it('enqueues email + webpush only for matching active rules', async () => {
    await runEvaluateAlerts({ data: { scanId } } as Parameters<
      typeof runEvaluateAlerts
    >[0]);

    // Rule 1 (narrow-inside-email, min 90): only NVDA matches → send-email.
    const rule1Jobs = enqueued.filter(
      (e) => (e.data as { ruleId?: string }).ruleId === ruleEmailId,
    );
    expect(rule1Jobs.length).toBe(1);
    expect(rule1Jobs[0].queue).toBe('send-email');
    expect((rule1Jobs[0].data as { symbols: string[] }).symbols).toEqual([
      'NVDA',
    ]);

    // Rule 2 (wide-snapback-both): TSLA matches → email + webpush.
    const rule2Jobs = enqueued.filter(
      (e) => (e.data as { ruleId?: string }).ruleId === ruleBothId,
    );
    expect(rule2Jobs.length).toBe(2);
    const qs = new Set(rule2Jobs.map((j) => j.queue));
    expect(qs.has('send-email')).toBe(true);
    expect(qs.has('send-webpush')).toBe(true);
    for (const j of rule2Jobs) {
      expect((j.data as { symbols: string[] }).symbols).toEqual(['TSLA']);
    }

    // Rule 3 (inactive): zero jobs.
    expect(
      enqueued.filter(
        (e) => (e.data as { ruleId?: string }).ruleId === ruleInactiveId,
      ).length,
    ).toBe(0);

    // Rule 4 (no candidates match): zero jobs.
    expect(
      enqueued.filter(
        (e) => (e.data as { ruleId?: string }).ruleId === ruleMissId,
      ).length,
    ).toBe(0);

    // Rule 5 (watchlist-scoped, watchlist = [NVDA], narrow + inside):
    // NVDA matches all three filters → 1 email job.
    const rule5Jobs = enqueued.filter(
      (e) => (e.data as { ruleId?: string }).ruleId === ruleWatchlistId,
    );
    expect(rule5Jobs.length).toBe(1);
    expect(rule5Jobs[0].queue).toBe('send-email');
    expect((rule5Jobs[0].data as { symbols: string[] }).symbols).toEqual([
      'NVDA',
    ]);
  });
});
