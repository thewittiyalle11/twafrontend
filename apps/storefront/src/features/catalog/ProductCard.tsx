'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@twa/shared';
import { formatINR } from '@twa/shared';

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group block overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:shadow-lg ${featured ? 'md:col-span-1' : ''}`}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
        <Image
          src={product.images[0]?.url ?? ''}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes={featured ? '(max-width:768px) 100vw, 33vw' : '(max-width:768px) 50vw, 25vw'}
        />
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.tags.includes('new-arrival') && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-brand-700">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-gray-900">{formatINR(product.effectivePrice)}</span>
          {product.discountPercent > 0 && (
            <span className="text-sm text-gray-400 line-through">{formatINR(product.basePrice)}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Delivery in {product.estimatedDeliveryDays} days
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductScroll({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <div key={product.id} className="w-56 flex-shrink-0 md:w-64">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
