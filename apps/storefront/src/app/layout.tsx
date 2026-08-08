import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from './ClientShell';

export const metadata: Metadata = {
  title: 'TWA Fashion | Indian Fashion Ecommerce',
  description: 'Modern Indian fashion store for apparel, accessories and curated collections.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
