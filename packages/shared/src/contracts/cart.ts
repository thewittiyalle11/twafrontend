import type { ProductSize } from './enums';
import type { GstBreakdown } from './order';

export interface CartItem {
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

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  shippingEstimate: number;
  taxBreakdown: GstBreakdown;
  grandTotal: number;
}

export interface AddCartItemInput {
  productId: string;
  size: ProductSize;
  qty: number;
  customization?: Record<string, string>;
}

export interface UpdateCartItemInput {
  quantity: number;
}
