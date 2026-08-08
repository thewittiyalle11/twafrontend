'use client';

import Link from 'next/link';
import { HeroSlider } from '@/features/home/HeroSlider';
import { CategoryGrid } from '@/features/home/CategoryGrid';
import { ProductCard, ProductScroll } from '@/features/catalog/ProductCard';
import { TestimonialsCarousel } from '@/features/home/TestimonialsCarousel';
import { InstagramShortcut } from '@/features/home/InstagramShortcut';
import { useBanners, useCategories, useProducts, useTestimonials, useSocialSettings } from '@twa/api-client';

export default function HomePage() {
  const bannersQuery = useBanners();
  const categoriesQuery = useCategories();
  const newArrivalsQuery = useProducts({ tag: 'new-arrival', limit: 8 });
  const bestSellersQuery = useProducts({ tag: 'best-seller', limit: 8 });
  const seasonPicksQuery = useProducts({ tag: 'season-top-pick', limit: 6 });
  const testimonialsQuery = useTestimonials();
  const socialQuery = useSocialSettings();

  return (
    <div className="space-y-16 pb-16">
      {bannersQuery.data && <HeroSlider banners={bannersQuery.data} />}

      <section className="container-page space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Collections</p>
            <h2 className="section-title">Shop by category</h2>
          </div>
          <Link href="/products" className="btn-secondary text-sm">
            View all products
          </Link>
        </div>

        {categoriesQuery.data ? (
          <CategoryGrid categories={categoriesQuery.data} />
        ) : (
          <div className="h-48 rounded-3xl bg-gray-100" />
        )}
      </section>

      <section className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">New Arrivals</p>
            <h2 className="section-title">Fresh drops for you</h2>
          </div>
          <Link href="/products?tag=new-arrival" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            See all
          </Link>
        </div>

        {newArrivalsQuery.data ? (
          <ProductScroll products={newArrivalsQuery.data.data} />
        ) : (
          <div className="h-72 rounded-3xl bg-gray-100" />
        )}
      </section>

      <section className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Best Sellers</p>
            <h2 className="section-title">Loved by our customers</h2>
          </div>
          <Link href="/products?tag=best-seller" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Browse best sellers
          </Link>
        </div>

        {bestSellersQuery.data ? (
          <div className="grid gap-6 md:grid-cols-3">
            {bestSellersQuery.data.data.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-72 rounded-3xl bg-gray-100" />
            ))}
          </div>
        )}
      </section>

      <section className="container-page space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Season's top pick</p>
            <h2 className="section-title">Curated for the season</h2>
          </div>
          <Link href="/products?tag=season-top-pick" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Explore seasonal picks
          </Link>
        </div>

        {seasonPicksQuery.data ? (
          <div className="grid gap-6 md:grid-cols-3">
            {seasonPicksQuery.data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-72 rounded-3xl bg-gray-100" />
            ))}
          </div>
        )}
      </section>

      <section className="container-page space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Testimonials</p>
          <h2 className="section-title">What our customers say</h2>
        </div>
        {testimonialsQuery.data ? (
          <TestimonialsCarousel testimonials={testimonialsQuery.data} />
        ) : (
          <div className="h-72 rounded-3xl bg-gray-100" />
        )}
      </section>

      {socialQuery.data && <InstagramShortcut social={socialQuery.data} />}
    </div>
  );
}
