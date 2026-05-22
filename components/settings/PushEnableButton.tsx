'use client';
import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

type Status =
  | 'idle'
  | 'enabling'
  | 'enabled'
  | 'blocked'
  | 'unsupported'
  | 'error';

interface Props {
  publicKey: string;
}

/**
 * Wraps the browser push-subscription dance:
 *   1. Notification.requestPermission()
 *   2. navigator.serviceWorker.register('/service-worker.js')
 *   3. registration.pushManager.subscribe({ applicationServerKey })
 *   4. POST the subscription to /api/push/subscribe
 *
 * On iOS Safari, push only works after the user adds the site to their home
 * screen (PWA install). We surface that with explanatory copy when the API
 * isn't available.
 */
function initialStatus(): Status {
  if (typeof window === 'undefined') return 'idle';
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'denied') return 'blocked';
  return 'idle';
}

export default function PushEnableButton({ publicKey }: Props) {
  // Use a lazy initializer so we read the browser APIs synchronously on
  // mount instead of via an effect — eslint's react-hooks rule rejects
  // setState-in-effect, and the initial categorization is cheap + sync.
  const [status, setStatus] = useState<Status>(initialStatus);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Existing-subscription probe: if we already have one, we're enabled.
    if (status !== 'idle') return;
    let cancelled = false;
    (async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub && !cancelled) setStatus('enabled');
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  async function enable() {
    if (!publicKey) {
      setError('VAPID public key not configured');
      setStatus('error');
      return;
    }
    setStatus('enabling');
    setError(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'denied') {
        setStatus('blocked');
        return;
      }
      if (perm !== 'granted') {
        setStatus('idle');
        return;
      }
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // Cast to BufferSource — TS DOM lib's ArrayBufferLike is wider than
        // pushManager.subscribe's ArrayBuffer-only param.
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) {
        setError(`server rejected subscription (${res.status})`);
        setStatus('error');
        return;
      }
      setStatus('enabled');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }

  async function disable() {
    setStatus('enabling');
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-white/15 rounded-sm bg-[#0B0B0B] px-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-[12px] text-white font-medium uppercase tracking-[0.08em]">
          WEB PUSH
        </span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">
          {status === 'enabled' && 'BROWSER NOTIFICATIONS ENABLED'}
          {status === 'idle' && 'NOT ENABLED · CLICK TO TURN ON'}
          {status === 'enabling' && 'WORKING…'}
          {status === 'blocked' &&
            'BLOCKED IN BROWSER · UPDATE SITE PERMISSIONS'}
          {status === 'unsupported' &&
            'NOT SUPPORTED · iOS REQUIRES "ADD TO HOME SCREEN"'}
          {status === 'error' && (error?.toUpperCase() ?? 'ERROR')}
        </span>
      </div>
      {status === 'enabled' ? (
        <button
          type="button"
          onClick={disable}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/22 text-[10.5px] uppercase tracking-[0.12em] text-white/75 hover:text-white hover:border-white/35"
        >
          <BellOff size={11} /> DISABLE
        </button>
      ) : (
        <button
          type="button"
          onClick={enable}
          disabled={status === 'unsupported' || status === 'blocked' || status === 'enabling'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[10.5px] uppercase tracking-[0.12em] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Bell size={11} /> ENABLE
        </button>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
