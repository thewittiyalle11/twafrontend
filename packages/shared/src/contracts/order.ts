import type { GstType, OrderStatus, PaymentStatus, ProductSize } from './enums';
import type { Address } from './common';
import type { CartSummary } from './cart';

export interface GstBreakdown {
  gstType: GstType;
  taxableAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  imageUrl: string;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  customization?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderLineItem[];
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  summary: CartSummary;
  invoiceId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  addressId?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  couponCode?: string;
  gstin?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface ShipOrderInput {
  trackingNumber: string;
  carrier: string;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  baseRate: number;
  estimatedDays: number;
  isActive: boolean;
}
