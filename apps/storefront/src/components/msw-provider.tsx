'use client';

import { useEffect, useState, type ReactNode } from 'react';

declare global {
  interface Window {
    __MSW_WORKER_START_PROMISE__?: Promise<void>;
    __MSW_WORKER_STARTED__?: boolean;
  }
}

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(
    process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true'
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') return;

    let cancelled = false;

    async function init() {
      if (typeof window !== 'undefined' && window.__MSW_WORKER_STARTED__) {
        setReady(true);
        return;
      }

      if (typeof window !== 'undefined' && !window.__MSW_WORKER_START_PROMISE__) {
        window.__MSW_WORKER_START_PROMISE__ = import(
          '@twa/mock-data/browser'
        ).then(async ({ worker }) => {
          await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
          window.__MSW_WORKER_STARTED__ = true;
        });
      }

      await window.__MSW_WORKER_START_PROMISE__;
      if (!cancelled) {
        setReady(true);
      }
    }

    init().catch((error) => {
      console.error('Failed to start MSW worker', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
