'use client';

import Link from 'next/link';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@twa/api-client';
import { useCartUIStore } from '@/lib/stores';
import { formatINR } from '@twa/shared';
import { X, Trash2 } from 'lucide-react';

export function CartDrawer() {
  const isOpen = useCartUIStore((state) => state.isOpen);
  const closeCart = useCartUIStore((state) => state.closeCart);
  const { data: cart, isLoading } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40">
      <button className="flex-1" onClick={closeCart} aria-label="Close cart drawer" />
      <aside className="w-full max-w-md bg-white p-6 shadow-2xl sm:w-96">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Your cart</p>
            <h2 className="text-2xl font-semibold text-gray-900">Shopping bag</h2>
          </div>
          <button onClick={closeCart} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-24 rounded-3xl bg-gray-100" />
              ))}
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-3xl bg-gray-100">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem.mutate(item.id)}
                          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          className="h-8 w-8 rounded-2xl border border-gray-200 bg-white"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          className="h-8 w-8 rounded-2xl border border-gray-200 bg-white"
                        >
                          +
                        </button>
                        <span className="ml-auto font-semibold text-gray-900">{formatINR(item.unitPrice * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{formatINR(cart.discountTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatINR(cart.shippingEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>{formatINR(cart.taxBreakdown.totalTax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatINR(cart.grandTotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary mt-6 block text-center">
              Proceed to checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
