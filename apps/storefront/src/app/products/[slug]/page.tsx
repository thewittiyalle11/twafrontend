'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProduct, useProducts, useAddToCart } from '@twa/api-client';
import { useCartUIStore } from '@/lib/stores';
import { formatINR } from '@twa/shared';
import type { ProductSize } from '@twa/shared';
import { ProductScroll } from '@/features/catalog/ProductCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Search, X } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams() as { slug?: string };
  const slug = params?.slug || '';
  const { data: product, isLoading } = useProduct(slug);
  const newArrivalQuery = useProducts({ tag: 'new-arrival', limit: 8 });
  const addToCart = useAddToCart();
  const openCart = useCartUIStore((state) => state.openCart);
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'customization'>('details');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const mediaItems = useMemo(() => {
    if (!product) return [];

    const images = product.images.slice(0, 6).map((image) => ({ type: 'image' as const, image }));
    return product.videoUrl
      ? [...images, { type: 'video' as const, url: product.videoUrl, poster: images[0]?.image.url }]
      : images;
  }, [product]);

  useEffect(() => {
    if (product && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0].size);
    }
  }, [product, selectedSize]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setIsZoomOpen(false);
  }, [slug]);

  const effectivePrice = product?.effectivePrice ?? 0;
  const activeMedia = mediaItems[activeMediaIndex] ?? mediaItems[0];
  const showPreviousMedia = () => {
    setActiveMediaIndex((index) => (index - 1 + mediaItems.length) % mediaItems.length);
  };
  const showNextMedia = () => {
    setActiveMediaIndex((index) => (index + 1) % mediaItems.length);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;
    await addToCart.mutateAsync({
      productId: product.id,
      size: selectedSize,
      qty: 1,
      customization: Object.keys(customization).length ? customization : undefined,
    });
    openCart();
  };

  if (isLoading) {
    return <div className="container-page py-20">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Product not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900">We couldn&apos;t locate that item.</h1>
        <Link href="/products" className="btn-primary mt-8 inline-block">
          Browse all products
        </Link>
      </div>
    );
  }

  const recommendedProducts =
    newArrivalQuery.data?.data.filter((item) => item.id !== product.id) ?? [];

  return (
    <div className="container-page py-12 space-y-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-xs tracking-wide text-gray-500">
        <Link href="/" className="transition hover:text-gray-900">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          className={`grid gap-2 sm:gap-3 ${
            mediaItems.length > 1
              ? 'grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[92px_minmax(0,1fr)]'
              : 'grid-cols-1'
          }`}
        >
          {mediaItems.length > 1 && (
            <div className="flex max-h-[680px] flex-col gap-2 overflow-y-auto">
              {mediaItems.map((media, index) => (
                <button
                  key={media.type === 'image' ? media.image.id : 'product-video'}
                  type="button"
                  onClick={() => setActiveMediaIndex(index)}
                  aria-label={media.type === 'image' ? `Show image ${index + 1}` : 'Show product video'}
                  aria-pressed={activeMediaIndex === index}
                  className={`relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-gray-100 transition ${
                    activeMediaIndex === index ? 'ring-2 ring-inset ring-brand-700' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  {media.type === 'image' ? (
                    <img src={media.image.url} alt={media.image.alt} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      {media.poster ? (
                        <img src={media.poster} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="block h-full w-full bg-gray-900" />
                      )}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                        <Play aria-hidden="true" className="h-6 w-6 fill-current" />
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="relative min-h-[420px] overflow-hidden bg-gray-100 sm:min-h-[560px] lg:min-h-[680px]">
            {activeMedia?.type === 'video' ? (
              <video
                key={activeMedia.url}
                src={activeMedia.url}
                poster={activeMedia.poster}
                autoPlay
                muted
                controls
                playsInline
                className="h-full min-h-[420px] w-full object-contain sm:min-h-[560px] lg:min-h-[680px]"
              >
                Your browser does not support the product video.
              </video>
            ) : activeMedia?.type === 'image' ? (
              <img
                src={activeMedia.image.url}
                alt={activeMedia.image.alt || product.name}
                className="h-full min-h-[420px] w-full object-cover sm:min-h-[560px] lg:min-h-[680px]"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center text-sm text-gray-500 sm:min-h-[560px] lg:min-h-[680px]">
                No product media available
              </div>
            )}

            {mediaItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousMedia}
                  aria-label="Show previous product media"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
                >
                  <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={showNextMedia}
                  aria-label="Show next product media"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
                >
                  <ChevronRight aria-hidden="true" className="h-6 w-6" />
                </button>
              </>
            )}
            {activeMedia?.type === 'image' && (
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                aria-label="Zoom product image"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
              >
                <Search aria-hidden="true" className="h-5 w-5" />
              </button>
            )}
            {mediaItems.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {activeMediaIndex + 1} / {mediaItems.length}
              </span>
            )}
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-700">{product.tags.join(' • ')}</p>
                <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {product.discountPercent}% OFF
              </div>
            </div>
            <p className="text-sm text-gray-600">{product.shortDescription ?? product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold text-gray-900">{formatINR(effectivePrice)}</span>
              <span className="text-sm text-gray-500 line-through">{formatINR(product.basePrice)}</span>
            </div>
            <p className="text-sm text-gray-500">Estimated delivery in {product.estimatedDeliveryDays} days</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">Choose size</label>
            <div className="grid grid-cols-3 gap-3">
              {product.sizes.map((option) => (
                <button
                  key={option.sku}
                  type="button"
                  onClick={() => setSelectedSize(option.size)}
                  className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${selectedSize === option.size ? 'border-brand-700 bg-brand-50 text-brand-900' : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300'}`}
                >
                  {option.size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatINR(effectivePrice)}</span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary w-full"
              disabled={!selectedSize || addToCart.isPending}
            >
              {addToCart.isPending ? 'Adding to cart…' : 'Add to cart'}
            </button>
            <Link href="/checkout" className="btn-secondary w-full text-center">
              Buy now
            </Link>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 lg:max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-900">Product details</h2>
            <p className="text-sm leading-7 text-gray-600">{product.description}</p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="rounded-2xl bg-white p-3 text-brand-700">info</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Dispatch</p>
                <p className="text-sm text-gray-600">Ships in {product.estimatedDeliveryDays} business days</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="rounded-2xl bg-white p-3 text-brand-700">✔</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Customization</p>
                <p className="text-sm text-gray-600">Designed for you: Your preferred neck, sleeves, and outfit length to create your perfect style.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`text-sm font-semibold transition ${activeTab === 'details' ? 'text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customization')}
              className={`text-sm font-semibold transition ${activeTab === 'customization' ? 'text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Customization
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <p>{product.description}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                <li>Category: {product.tags.join(', ')}</li>
                <li>Available sizes: {product.sizes.map((item) => item.size).join(', ')}</li>
                <li>Discount: {product.discountPercent}%</li>
                <li>Estimated delivery: {product.estimatedDeliveryDays} days</li>
              </ul>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {product.customizationOptions.length > 0 ? (
                product.customizationOptions.map((option) => (
                  <div key={option.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">{option.label}</label>
                    {option.type === 'select' ? (
                      <select
                        value={customization[option.key] ?? option.choices?.[0]?.value ?? ''}
                        onChange={(event) => setCustomization((current) => ({ ...current, [option.key]: event.target.value }))}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                      >
                        {option.choices?.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    ) : option.type === 'textarea' ? (
                      <textarea
                        value={customization[option.key] ?? ''}
                        onChange={(event) => setCustomization((current) => ({ ...current, [option.key]: event.target.value }))}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                        rows={4}
                        maxLength={option.maxLength}
                      />
                    ) : (
                      <input
                        value={customization[option.key] ?? ''}
                        onChange={(event) => setCustomization((current) => ({ ...current, [option.key]: event.target.value }))}
                        type="text"
                        maxLength={option.maxLength}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                      />
                    )}
                    {option.additionalPrice ? (
                      <p className="text-xs text-gray-500">Add-on: {formatINR(option.additionalPrice)}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No customization options are available for this product.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {recommendedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="section-title">You may also like this products</h2>
          <ProductScroll products={recommendedProducts} />
        </section>
      )}

      {isZoomOpen && activeMedia?.type === 'image' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close image preview"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
          <img
            src={activeMedia.image.url}
            alt={activeMedia.image.alt || product.name}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
