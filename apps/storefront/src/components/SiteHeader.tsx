'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@twa/api-client';
import { useAuthStore, useCartUIStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/policies', label: 'Policies' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/about', label: 'About Us' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openCart = useCartUIStore((s) => s.openCart);
  const user = useAuthStore((s) => s.user);
  const { data: cart } = useCart();
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-brand-800">
          TWA Fashion
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition hover:text-brand-700',
                pathname === link.href ? 'text-brand-700' : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? '/account' : '/login'}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-700"
          >
            <User className="h-4 w-4" />
            {user ? user.name.split(' ')[0] : 'Login'}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-700"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-xs font-medium text-white">
                {itemCount}
              </span>
            )}
          </button>

          <button
            className="rounded-md p-2 text-gray-600 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? '/account' : '/login'}
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-600 hover:text-brand-700"
          >
            {user ? 'My Account' : 'Login'}
          </Link>
        </nav>
      )}
    </header>
  );
}
