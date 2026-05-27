import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { searchUniverseSymbols } from '@/lib/watchlists/symbol-universe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/watchlists/symbol-search?prefix=NV
 * Returns up to 50 ticker symbols from the latest scan whose ticker starts
 * with `prefix` (case-insensitive). Member-only — anyone unauthenticated
 * gets 401.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const prefix = req.nextUrl.searchParams.get('prefix') ?? '';
  if (!prefix) {
    return NextResponse.json({ symbols: [] });
  }

  const symbols = await searchUniverseSymbols(prefix);
  return NextResponse.json({ symbols });
}
