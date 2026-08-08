'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(
    process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true'
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') return;

    async function init() {
      const { worker } = await import('@twa/mock-data/browser');
      await worker.start({ onUnhandledRequest: 'bypass', quiet: true });
      setReady(true);
    }

    init();
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
