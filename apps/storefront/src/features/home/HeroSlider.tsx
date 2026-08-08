'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Banner } from '@twa/shared';
import { cn } from '@/lib/utils';

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[21/9] w-full md:aspect-[21/8]">
                {banner.type === 'video' ? (
                  <video
                    src={banner.mediaUrl}
                    poster={banner.thumbnailUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={banner.mediaUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={banner.sortOrder === 1}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container-page">
                    <h2 className="max-w-lg font-serif text-3xl font-bold text-white md:text-5xl">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="mt-3 max-w-md text-lg text-white/90">{banner.subtitle}</p>
                    )}
                    {banner.linkUrl && (
                      <Link href={banner.linkUrl} className="btn-primary mt-6">
                        Shop Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              i === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
