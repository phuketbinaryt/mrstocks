/**
 * MrStocks BullMQ worker entry point.
 *
 * Runs as its own process (via systemd `mrstocks-worker.service` in prod,
 * `pnpm worker:dev` locally). Loads .env.local via dotenv so it has the
 * same secret surface as the web app.
 *
 * Started with NODE_OPTIONS=--conditions=react-server so that
 * `'server-only'` imports in lib/db/client.ts + lib/queue/* resolve to the
 * empty.js no-op the way Next.js does. Without this, importing db/client.ts
 * throws.
 */
import 'dotenv/config';
import { Worker } from 'bullmq';
import * as Sentry from '@sentry/node';
import { getRedis } from '@/lib/queue/redis';
import { QUEUE_NAMES } from '@/lib/queue/queues';
import { runEvaluateAlerts } from './evaluate-alerts';
import { runSendEmail } from './send-email';
import { runSendWebpush } from './send-webpush';

// Sentry — gated on SENTRY_DSN being set. No-op when absent.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV ?? 'development',
  });
  console.log('[worker] sentry initialized');
}

const conn = { connection: getRedis() };

console.log('[worker] starting…');

const w1 = new Worker(QUEUE_NAMES.evaluateAlerts, runEvaluateAlerts, conn);
const w2 = new Worker(QUEUE_NAMES.sendEmail, runSendEmail, conn);
const w3 = new Worker(QUEUE_NAMES.sendWebpush, runSendWebpush, conn);

const workers = [w1, w2, w3];
for (const w of workers) {
  w.on('ready', () => {
    console.log(`[worker] ${w.name} ready`);
  });
  w.on('failed', (job, err) => {
    console.error(`[worker] ${w.name} job ${job?.id} failed:`, err.message);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(err, {
        tags: { queue: w.name, jobId: job?.id ?? 'unknown' },
      });
    }
  });
  w.on('completed', (job) => {
    console.log(`[worker] ${w.name} job ${job.id} ok`);
  });
  w.on('error', (err) => {
    console.error(`[worker] ${w.name} error:`, err.message);
  });
}

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[worker] received ${signal}, shutting down…`);
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
