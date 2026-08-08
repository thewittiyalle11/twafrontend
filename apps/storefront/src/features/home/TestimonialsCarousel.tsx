'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Star } from 'lucide-react';
import type { Testimonial } from '@twa/shared';

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="min-w-0 flex-[0_0_100%] rounded-lg border border-gray-100 bg-white p-6 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">&ldquo;{t.comment}&rdquo;</p>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900">{t.customerName}</p>
              <p className="text-xs text-gray-500">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
