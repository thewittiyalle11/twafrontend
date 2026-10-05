'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOrder, useCart } from '@twa/api-client';
import { createOrderSchema, type CreateOrderInput } from '@twa/shared';
import { formatINR } from '@twa/shared';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { data: cart } = useCart();
  const createOrder = useCreateOrder();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderInput>({ resolver: zodResolver(createOrderSchema) });

  const orderTotal = useMemo(() => cart?.grandTotal ?? 0, [cart]);

  const onSubmit = async (data: CreateOrderInput) => {
    await createOrder.mutateAsync(data);
    router.push('/');
  };

  return (
    <div className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Checkout</p>
            <h1 className="text-3xl font-semibold text-gray-900">Shipping details</h1>
            <p className="text-sm text-gray-600">Fill in your delivery address and GST information for faster order processing.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Full name</label>
              <input
                {...register('shippingAddress.fullName')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.fullName && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.fullName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Phone</label>
              <input
                {...register('shippingAddress.phone')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.phone && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Address line 1</label>
              <input
                {...register('shippingAddress.line1')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.line1 && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.line1.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Address line 2</label>
              <input
                {...register('shippingAddress.line2')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">City</label>
              <input
                {...register('shippingAddress.city')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.city && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.city.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">State</label>
              <input
                {...register('shippingAddress.state')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.state && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.state.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">PIN code</label>
              <input
                {...register('shippingAddress.pincode')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.pincode && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.pincode.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">State code</label>
              <input
                {...register('shippingAddress.stateCode')}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
              {errors.shippingAddress?.stateCode && <p className="mt-2 text-xs text-red-600">{errors.shippingAddress.stateCode.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Country</label>
              <input
                {...register('shippingAddress.country')}
                defaultValue="India"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Business / GST details</h2>
            <p className="text-sm text-gray-600">Optional for B2B orders and invoice generation.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">GSTIN</label>
                <input
                  {...register('gstin')}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Billing full name</label>
                <input
                  {...register('billingAddress.fullName')}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">If billing address is left blank, shipping address will be used.</p>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={createOrder.isPending || !cart?.items.length}>
            {createOrder.isPending ? 'Placing order…' : 'Place order'}
          </button>
          {createOrder.isSuccess && <p className="text-sm text-green-600">Order placed successfully! Redirecting…</p>}
        </form>

        <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Order summary</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Total payable</h2>
          </div>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Cart total</span>
              <span>{formatINR(cart?.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{formatINR(cart?.discountTotal ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatINR(cart?.shippingEstimate ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>{formatINR(cart?.taxBreakdown.totalTax ?? 0)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatINR(orderTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
