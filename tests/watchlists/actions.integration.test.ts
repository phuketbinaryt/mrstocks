import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import {
  users,
  watchlists,
  watchlistSymbols,
} from '@/lib/db/schema';

// Mock auth() to return our test user before importing the actions.
// MOCK_USER_ID is assigned in beforeAll; the mock factory closes over it
// via the module-scoped binding (vi.mock factories run after this is
// declared but before the actions module imports auth).
let MOCK_USER_ID = '';
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(async () => ({
    user: { id: MOCK_USER_ID, email: 'test' },
  })),
}));
// Mock revalidatePath + redirect so we don't need a Next request context.
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`__REDIRECT__${url}`);
  }),
}));

import {
  createWatchlist,
  renameWatchlist,
  deleteWatchlist,
  setDefaultWatchlist,
  addSymbol,
  removeSymbol,
  ensureDefaultWatchlistForUser,
} from '@/lib/watchlists/actions';

const url = process.env.DATABASE_URL!;
const client = postgres(url, { max: 1 });
const db = drizzle(client, {
  schema: { users, watchlists, watchlistSymbols },
});
const EMAIL = `wl-a-${Date.now()}@example.com`;

describe('watchlist actions', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ email: EMAIL })
      .returning({ id: users.id });
    MOCK_USER_ID = u.id;
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, MOCK_USER_ID));
    await client.end();
  });

  it('ensureDefault creates "All signals" if missing', async () => {
    await ensureDefaultWatchlistForUser(MOCK_USER_ID);
    const rows = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((r) => r.isDefault)).toBe(true);
    expect(rows.some((r) => r.name === 'All signals')).toBe(true);
  });

  it('ensureDefault is idempotent', async () => {
    const before = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    await ensureDefaultWatchlistForUser(MOCK_USER_ID);
    const after = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    expect(after.length).toBe(before.length);
  });

  it('createWatchlist makes a new list', async () => {
    const fd = new FormData();
    fd.set('name', 'Tech leaders');
    try {
      await createWatchlist(fd);
    } catch (e: unknown) {
      // redirect() throws in our mock — that's expected.
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toContain('__REDIRECT__/watchlists/');
    }
    const rows = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    expect(rows.some((r) => r.name === 'Tech leaders')).toBe(true);
  });

  it('addSymbol + removeSymbol round-trip (and uppercases)', async () => {
    const [list] = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID))
      .limit(1);
    await addSymbol(list.id, 'aapl');
    let syms = await db
      .select({ symbol: watchlistSymbols.symbol })
      .from(watchlistSymbols)
      .where(eq(watchlistSymbols.watchlistId, list.id));
    expect(syms.some((r) => r.symbol === 'AAPL')).toBe(true);

    // idempotent — adding the same symbol again is a no-op
    await addSymbol(list.id, 'AAPL');
    syms = await db
      .select({ symbol: watchlistSymbols.symbol })
      .from(watchlistSymbols)
      .where(eq(watchlistSymbols.watchlistId, list.id));
    const aaplCount = syms.filter((r) => r.symbol === 'AAPL').length;
    expect(aaplCount).toBe(1);

    await removeSymbol(list.id, 'AAPL');
    syms = await db
      .select({ symbol: watchlistSymbols.symbol })
      .from(watchlistSymbols)
      .where(eq(watchlistSymbols.watchlistId, list.id));
    expect(syms.some((r) => r.symbol === 'AAPL')).toBe(false);
  });

  it('addSymbol rejects invalid symbols', async () => {
    const [list] = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID))
      .limit(1);
    await expect(addSymbol(list.id, '123')).rejects.toThrow();
    await expect(addSymbol(list.id, 'TOOLONGTICKER')).rejects.toThrow();
  });

  it('renameWatchlist renames', async () => {
    const [list] = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID))
      .limit(1);
    await renameWatchlist(list.id, 'Renamed');
    const [after] = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.id, list.id));
    expect(after.name).toBe('Renamed');
  });

  it('setDefaultWatchlist flips default cleanly', async () => {
    const fd = new FormData();
    fd.set('name', 'Secondary');
    try {
      await createWatchlist(fd);
    } catch {
      // redirect throws — expected
    }
    const all = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    const secondary = all.find((r) => r.name === 'Secondary')!;
    await setDefaultWatchlist(secondary.id);
    const after = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    const defaults = after.filter((r) => r.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].id).toBe(secondary.id);
  });

  it('deleteWatchlist removes a list', async () => {
    const fd = new FormData();
    fd.set('name', 'ToDelete');
    try {
      await createWatchlist(fd);
    } catch {
      // redirect throws
    }
    const before = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    const toDelete = before.find((r) => r.name === 'ToDelete')!;
    await deleteWatchlist(toDelete.id);
    const after = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, MOCK_USER_ID));
    expect(after.some((r) => r.id === toDelete.id)).toBe(false);
  });
});
