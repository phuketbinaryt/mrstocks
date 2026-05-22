import 'server-only';
import { Queue } from 'bullmq';
import { getRedis } from './redis';

/**
 * Lazy-instantiated BullMQ queue handles. We avoid creating Queue objects at
 * module-import time because that opens a Redis connection — bad in tests
 * that don't need it and bad during `next build` when Redis may not be up.
 */

let _evaluateAlertsQueue: Queue<{ scanId: string }> | null = null;
let _sendEmailQueue: Queue<SendJobData> | null = null;
let _sendWebpushQueue: Queue<SendJobData> | null = null;

export interface SendJobData {
  userId: string;
  ruleId: string;
  scanId: string;
  symbols: string[];
}

function conn() {
  return { connection: getRedis() } as const;
}

export function getEvaluateAlertsQueue(): Queue<{ scanId: string }> {
  if (!_evaluateAlertsQueue) {
    _evaluateAlertsQueue = new Queue<{ scanId: string }>('evaluate-alerts', conn());
  }
  return _evaluateAlertsQueue;
}

export function getSendEmailQueue(): Queue<SendJobData> {
  if (!_sendEmailQueue) {
    _sendEmailQueue = new Queue<SendJobData>('send-email', conn());
  }
  return _sendEmailQueue;
}

export function getSendWebpushQueue(): Queue<SendJobData> {
  if (!_sendWebpushQueue) {
    _sendWebpushQueue = new Queue<SendJobData>('send-webpush', conn());
  }
  return _sendWebpushQueue;
}

/**
 * Queue names exported as constants so the worker module can spawn matching
 * Workers without importing the Queue objects (which would open producer
 * connections in the worker process unnecessarily).
 */
export const QUEUE_NAMES = {
  evaluateAlerts: 'evaluate-alerts',
  sendEmail: 'send-email',
  sendWebpush: 'send-webpush',
} as const;
