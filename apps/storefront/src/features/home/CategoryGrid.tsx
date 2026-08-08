'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@twa/shared';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          className="group relative overflow-hidden rounded-lg"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={cat.imageUrl}
              alt={cat.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-4">
              <h3 className="font-serif text-lg font-semibold text-white">{cat.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
