'use client';

import { Instagram } from 'lucide-react';
import type { SocialSettings } from '@twa/shared';

export function InstagramShortcut({ social }: { social: SocialSettings }) {
  return (
    <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-12">
      <div className="container-page flex flex-col items-center text-center text-white md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-serif text-2xl font-bold md:text-3xl">Follow Us on Instagram</h2>
          <p className="mt-2 text-white/90">{social.instagramHandle}</p>
        </div>
        <a
          href={social.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-pink-600 transition hover:bg-gray-100 md:mt-0"
        >
          <Instagram className="h-5 w-5" />
          Follow {social.instagramHandle}
        </a>
      </div>
    </section>
  );
}
