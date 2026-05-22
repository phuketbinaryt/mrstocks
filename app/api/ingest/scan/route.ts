import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { verifyHmac } from '@/lib/ingest/verify-hmac';
import { scanPayloadSchema } from '@/lib/ingest/schema';
import { saveScan } from '@/lib/ingest/save-scan';
import { getEvaluateAlertsQueue } from '@/lib/queue/queues';

// Node runtime (Drizzle + crypto + postgres.js don't work on Edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Read the raw body for HMAC verification before parsing.
  const body = await req.text();
  const sig = req.headers.get('x-signature') ?? '';

  // 2. Verify HMAC (timing-safe).
  if (!verifyHmac(body, sig, env.INGEST_SHARED_SECRET)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  // 3. Parse JSON.
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // 4. Validate shape.
  const result = scanPayloadSchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json(
      { error: 'invalid payload', issues: result.error.flatten() },
      { status: 422 },
    );
  }

  // 5. Save (idempotent).
  try {
    const saved = await saveScan(result.data);

    // 6. Best-effort: enqueue alert fan-out. Only fire on a fresh insert —
    // replays would re-spam every member. Failures here are NEVER fatal:
    // the ingest endpoint's contract is "scan saved", not "alerts dispatched".
    if (saved.status === 'created') {
      try {
        await getEvaluateAlertsQueue().add(
          'evaluate',
          { scanId: saved.scanId },
          {
            removeOnComplete: 100,
            removeOnFail: 100,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          },
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[ingest/scan] enqueue evaluate-alerts failed:', message);
      }
    }

    return NextResponse.json(saved, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[ingest/scan] save failed:', message);
    return NextResponse.json({ error: 'save failed', message }, { status: 500 });
  }
}

// Health probe so the prod box can sanity-check the endpoint without a payload.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'ingest/scan' });
}
