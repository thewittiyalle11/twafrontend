'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@twa/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'twa-auth' }
  )
);

interface CartUIState {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartUIStore = create<CartUIState>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
}));

interface DiscountState {
  couponCode: string | null;
  setCoupon: (code: string) => void;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set) => ({
      couponCode: null,
      setCoupon: (code) => set({ couponCode: code }),
    }),
    { name: 'twa-discount' }
  )
);
