'use server';
import 'server-only';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { watchlists, watchlistSymbols } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function userIdOrThrow(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('not authenticated');
  return session.user.id;
}

export async function createWatchlist(formData: FormData): Promise<void> {
  const userId = await userIdOrThrow();
  const name = String(formData.get('name') ?? '').trim();
  if (!name || name.length > 40) throw new Error('name must be 1-40 characters');

  // First list created becomes default automatically.
  const existing = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(watchlists)
    .where(eq(watchlists.userId, userId));
  const isFirst = (existing[0]?.count ?? 0) === 0;

  const [created] = await db
    .insert(watchlists)
    .values({ userId, name, isDefault: isFirst })
    .returning({ id: watchlists.id });

  revalidatePath('/watchlists');
  redirect(`/watchlists/${created.id}`);
}

/**
 * Atomic: create a watchlist with a name AND add the given symbol to it in
 * one transaction. Used from the dashboard's "add to watchlist → NEW LIST"
 * flow. Returns the new watchlist's id so the caller can navigate or refresh.
 */
export async function createWatchlistAndAddSymbol(
  name: string,
  symbol: string,
): Promise<{ id: string }> {
  const userId = await userIdOrThrow();
  const cleanName = name.trim();
  if (!cleanName || cleanName.length > 40)
    throw new Error('name must be 1-40 characters');
  const sym = symbol.trim().toUpperCase();
  if (!/^[A-Z]{1,8}$/.test(sym)) throw new Error('invalid symbol');

  const id = await db.transaction(async (tx) => {
    const existing = await tx
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(watchlists)
      .where(eq(watchlists.userId, userId));
    const isFirst = (existing[0]?.count ?? 0) === 0;

    const [created] = await tx
      .insert(watchlists)
      .values({ userId, name: cleanName, isDefault: isFirst })
      .returning({ id: watchlists.id });

    await tx.insert(watchlistSymbols).values({
      watchlistId: created.id,
      symbol: sym,
    });
    return created.id;
  });

  revalidatePath('/watchlists');
  revalidatePath('/dashboard');
  return { id };
}

export async function renameWatchlist(
  id: string,
  name: string,
): Promise<void> {
  const userId = await userIdOrThrow();
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 40)
    throw new Error('name must be 1-40 characters');
  await db
    .update(watchlists)
    .set({ name: trimmed })
    .where(and(eq(watchlists.id, id), eq(watchlists.userId, userId)));
  revalidatePath('/watchlists');
  revalidatePath(`/watchlists/${id}`);
}

export async function deleteWatchlist(id: string): Promise<void> {
  const userId = await userIdOrThrow();
  await db
    .delete(watchlists)
    .where(and(eq(watchlists.id, id), eq(watchlists.userId, userId)));
  revalidatePath('/watchlists');
  revalidatePath('/dashboard');
}

export async function setDefaultWatchlist(id: string): Promise<void> {
  const userId = await userIdOrThrow();
  // The partial unique index enforces "only one default per user" — we have
  // to clear the existing default first in a transaction.
  await db.transaction(async (tx) => {
    await tx
      .update(watchlists)
      .set({ isDefault: false })
      .where(
        and(
          eq(watchlists.userId, userId),
          eq(watchlists.isDefault, true),
        ),
      );
    await tx
      .update(watchlists)
      .set({ isDefault: true })
      .where(and(eq(watchlists.id, id), eq(watchlists.userId, userId)));
  });
  revalidatePath('/watchlists');
  revalidatePath('/dashboard');
}

export async function addSymbol(
  watchlistId: string,
  symbol: string,
): Promise<void> {
  const userId = await userIdOrThrow();
  const sym = symbol.trim().toUpperCase();
  if (!/^[A-Z]{1,8}$/.test(sym)) throw new Error('invalid symbol');

  // Confirm ownership before inserting.
  const [owned] = await db
    .select({ id: watchlists.id })
    .from(watchlists)
    .where(
      and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)),
    )
    .limit(1);
  if (!owned) throw new Error('not found');

  await db
    .insert(watchlistSymbols)
    .values({ watchlistId, symbol: sym })
    .onConflictDoNothing();
  revalidatePath(`/watchlists/${watchlistId}`);
  revalidatePath('/dashboard');
}

export async function removeSymbol(
  watchlistId: string,
  symbol: string,
): Promise<void> {
  const userId = await userIdOrThrow();
  const sym = symbol.trim().toUpperCase();

  const [owned] = await db
    .select({ id: watchlists.id })
    .from(watchlists)
    .where(
      and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)),
    )
    .limit(1);
  if (!owned) throw new Error('not found');

  await db
    .delete(watchlistSymbols)
    .where(
      and(
        eq(watchlistSymbols.watchlistId, watchlistId),
        eq(watchlistSymbols.symbol, sym),
      ),
    );
  revalidatePath(`/watchlists/${watchlistId}`);
  revalidatePath('/dashboard');
}

/**
 * Ensure the user has at least one watchlist (marked default).
 * Called from events.signIn for new users so the dashboard never shows a
 * "you have no watchlists" empty state by default. Idempotent — a no-op if
 * the user already has any watchlist row.
 */
/**
 * @deprecated No longer called from events.signIn — auto-creating an empty
 * "All signals" watchlist was confusing because the LIST chip row already
 * includes an "All signals" (no-filter) option, so users saw the name twice.
 * Kept for backward compatibility / tests; safe to remove once nothing imports.
 */
export async function ensureDefaultWatchlistForUser(
  _userId: string,
): Promise<void> {
  // intentionally no-op
}
