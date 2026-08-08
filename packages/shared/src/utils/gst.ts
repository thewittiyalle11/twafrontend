import { GstType } from '../contracts/enums';
import type { CartItem } from '../contracts/cart';
import type { GstBreakdown } from '../contracts/order';

const GST_RATE = 0.18;
const CGST_RATE = 0.09;
const SGST_RATE = 0.09;
const SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 99;

export function computeEffectivePrice(basePrice: number, discountPercent: number): number {
  return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
}

export function computeLineTotal(item: CartItem): number {
  return Math.round(item.unitPrice * item.quantity * 100) / 100;
}

export function computeShippingEstimate(subtotal: number): number {
  return subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
}

export function computeGstBreakdown(
  taxableAmount: number,
  buyerStateCode: string,
  sellerStateCode = '27'
): GstBreakdown {
  if (buyerStateCode === sellerStateCode) {
    const cgst = Math.round(taxableAmount * CGST_RATE * 100) / 100;
    const sgst = Math.round(taxableAmount * SGST_RATE * 100) / 100;
    return {
      gstType: GstType.CGST_SGST,
      taxableAmount,
      cgst,
      sgst,
      totalTax: cgst + sgst,
    };
  }

  const igst = Math.round(taxableAmount * GST_RATE * 100) / 100;
  return {
    gstType: GstType.IGST,
    taxableAmount,
    igst,
    totalTax: igst,
  };
}

export function computeCartSummary(
  items: CartItem[],
  buyerStateCode = '27'
): {
  subtotal: number;
  discountTotal: number;
  shippingEstimate: number;
  taxBreakdown: GstBreakdown;
  grandTotal: number;
} {
  const subtotal = items.reduce((sum, item) => sum + computeLineTotal(item), 0);
  const discountTotal = items.reduce((sum, item) => {
    const original = item.unitPrice / (1 - item.discountPercent / 100);
    return sum + (original - item.unitPrice) * item.quantity;
  }, 0);
  const shippingEstimate = computeShippingEstimate(subtotal);
  const taxableAmount = subtotal + shippingEstimate;
  const taxBreakdown = computeGstBreakdown(taxableAmount, buyerStateCode);
  const grandTotal = Math.round((taxableAmount + taxBreakdown.totalTax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    shippingEstimate,
    taxBreakdown,
    grandTotal,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}
