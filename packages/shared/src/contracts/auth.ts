import type { AdminRole, UserRole } from './enums';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  adminRole?: AdminRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface GuestDiscountInput {
  email: string;
}

export interface GuestDiscountResponse {
  couponCode: string;
  discountPercent: number;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface SocialSettings {
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

export interface BrandSettings {
  name: string;
  tagline: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  social: SocialSettings;
}

export interface SalesAnalytics {
  ordersToday: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  ordersByStatus: Record<string, number>;
  revenueByCategory: { category: string; revenue: number }[];
}
