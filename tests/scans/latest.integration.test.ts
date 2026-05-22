import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { scans, scanCandidates } from '@/lib/db/schema';
import { getLatestScan, getCandidatesForScan } from '@/lib/scans/latest';

const url = process.env.DATABASE_URL!;
const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema: { scans, scanCandidates } });

describe('scans queries', () => {
  const generatedAt = new Date();
  let createdScanId = '';

  beforeAll(async () => {
    const [s] = await db
      .insert(scans)
      .values({
        generatedAt,
        scannerName: 'test_scanner',
        candidateCount: 2,
        raw: { test: true },
      })
      .returning({ id: scans.id });
    createdScanId = s.id;
    await db.insert(scanCandidates).values([
      {
        scanId: s.id,
        symbol: 'AAA',
        state: 'narrow',
        score: '90',
        data: {},
      },
      {
        scanId: s.id,
        symbol: 'BBB',
        state: 'middle',
        score: '50',
        data: {},
      },
    ]);
  });

  afterAll(async () => {
    await db.delete(scans).where(eq(scans.id, createdScanId));
    await client.end();
  });

  it('getLatestScan returns the just-inserted row', async () => {
    const s = await getLatestScan();
    expect(s?.id).toBe(createdScanId);
  });

  it('getCandidatesForScan returns candidates sorted by score desc', async () => {
    const rows = await getCandidatesForScan(createdScanId);
    expect(rows.map((r) => r.symbol)).toEqual(['AAA', 'BBB']);
  });
});
