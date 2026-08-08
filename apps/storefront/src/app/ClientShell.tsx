'use client';

import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { DiscountLoginModal } from '@/features/auth/DiscountLoginModal';
import { CartDrawer } from '@/features/cart/CartDrawer';

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
      <DiscountLoginModal />
      <CartDrawer />
    </Providers>
  );
}
