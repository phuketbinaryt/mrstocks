import { NextResponse, type NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { pushSubscriptions } from '@/lib/db/schema';

export const runtime = 'nodejs';

interface UnsubscribeBody {
  endpoint?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as UnsubscribeBody | null;
  if (!body?.endpoint) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, session.user.id),
        eq(pushSubscriptions.endpoint, body.endpoint),
      ),
    );
  return NextResponse.json({ ok: true });
}
