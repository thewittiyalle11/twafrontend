'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestDiscountSchema, type GuestDiscountInput } from '@twa/shared';
import { useGuestDiscount } from '@twa/api-client';
import { useDiscountStore } from '@/lib/stores';
import { X } from 'lucide-react';

export function DiscountLoginModal() {
  const [open, setOpen] = useState(false);
  const setCoupon = useDiscountStore((s) => s.setCoupon);
  const guestDiscount = useGuestDiscount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GuestDiscountInput>({
    resolver: zodResolver(guestDiscountSchema),
  });

  useEffect(() => {
    const shown = sessionStorage.getItem('loginPopupShown');
    if (!shown) setOpen(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('loginPopupShown', 'true');
    setOpen(false);
  };

  const onSubmit = async (data: GuestDiscountInput) => {
    const result = await guestDiscount.mutateAsync(data);
    setCoupon(result.couponCode);
    dismiss();
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="discount-modal-title">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            EXCLUSIVE OFFER
          </span>
          <h2 id="discount-modal-title" className="mt-4 font-serif text-2xl font-bold text-gray-900">
            Get 10% Off Your First Order
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to unlock your welcome discount code.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={guestDiscount.isPending}>
            {guestDiscount.isPending ? 'Sending...' : 'Get My Discount'}
          </button>
          <button type="button" onClick={dismiss} className="w-full text-sm text-gray-500 hover:text-gray-700">
            No thanks, continue shopping
          </button>
        </form>
      </div>
    </div>
  );
}
