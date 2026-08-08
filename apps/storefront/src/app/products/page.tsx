'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCategories, useProducts } from '@twa/api-client';
import { ProductCard } from '@/features/catalog/ProductCard';

export default function ProductsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const category = useMemo(() => {
    const value = searchParams?.category;
    return Array.isArray(value) ? value[0] : value;
  }, [searchParams]);

  const tag = useMemo(() => {
    const value = searchParams?.tag;
    return Array.isArray(value) ? value[0] : value;
  }, [searchParams]);

  const search = useMemo(() => {
    const value = searchParams?.search;
    return Array.isArray(value) ? value[0] : value;
  }, [searchParams]);

  const productsQuery = useProducts({
    category,
    tag: tag as any,
    search,
    sort: (Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort) as any,
    page: Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page) || 1,
    limit: 24,
  });

  const categoriesQuery = useCategories();

  return (
    <div className="container-page py-12 space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Products</p>
        <h1 className="section-title">Browse our latest collection</h1>
        <p className="max-w-2xl text-sm text-gray-600">
          Filter by category, tag, and search to discover premium Indian fashion for every occasion.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
            <div className="mt-4 space-y-3">
              {categoriesQuery.data?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`block rounded-xl px-4 py-3 text-sm transition hover:bg-brand-50 ${category === cat.slug ? 'bg-brand-100 text-brand-900' : 'text-gray-700'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Quick links</h2>
            <div className="mt-4 space-y-3">
              <Link href="/products?tag=new-arrival" className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-brand-50">
                New arrivals
              </Link>
              <Link href="/products?tag=best-seller" className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-brand-50">
                Best sellers
              </Link>
              <Link href="/products?tag=season-top-pick" className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-brand-50">
                Season's top pick
              </Link>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {productsQuery.data ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {productsQuery.data.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-72 rounded-3xl bg-gray-100" />
              ))}
            </div>
          )}

          {productsQuery.data && productsQuery.data.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">
              <span>
                Showing {productsQuery.data.data.length} of {productsQuery.data.total} products
              </span>
              <div className="flex gap-2">
                {Array.from({ length: productsQuery.data.totalPages }).map((_, index) => (
                  <Link
                    key={index}
                    href={`/products?page=${index + 1}`}
                    className={`rounded-full px-4 py-2 transition ${Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page) === index + 1 ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {index + 1}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
