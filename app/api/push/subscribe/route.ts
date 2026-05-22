import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { pushSubscriptions } from '@/lib/db/schema';
import { logAuditEvent } from '@/lib/audit/log';

export const runtime = 'nodejs';

interface SubscribeBody {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as SubscribeBody | null;
  if (
    !body?.endpoint ||
    !body.keys?.p256dh ||
    !body.keys?.auth
  ) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const result = await db
    .insert(pushSubscriptions)
    .values({
      userId: session.user.id,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      authKey: body.keys.auth,
      userAgent: req.headers.get('user-agent') ?? null,
    })
    .onConflictDoNothing()
    .returning({ id: pushSubscriptions.id });

  // Only audit if we actually inserted a new row (idempotent re-subscribe
  // is uninteresting noise).
  if (result.length > 0) {
    await logAuditEvent({
      actorUserId: session.user.id,
      action: 'member.push_enabled',
      target: session.user.id,
      meta: {
        userAgent: req.headers.get('user-agent')?.slice(0, 200) ?? null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
