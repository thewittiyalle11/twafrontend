import { GstType, type Invoice, type Order } from '@twa/shared';
import { sellerGstDetails } from '../fixtures/settings';

function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
    if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
    if (n < 100000) return `${convert(Math.floor(n / 1000))} Thousand ${convert(n % 1000)}`.trim();
    if (n < 10000000) return `${convert(Math.floor(n / 100000))} Lakh ${convert(n % 100000)}`.trim();
    return `${convert(Math.floor(n / 10000000))} Crore ${convert(n % 10000000)}`.trim();
  }

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = `${convert(rupees)} Rupees`;
  if (paise > 0) result += ` and ${convert(paise)} Paise`;
  return `${result} Only`;
}

export function buildInvoices(orders: Order[]): Invoice[] {
  return orders
    .filter((o) => o.paymentStatus === 'paid')
    .slice(0, 2)
    .map((order, index) => {
      const isIntraState = order.shippingAddress.stateCode === sellerGstDetails.stateCode;
      const taxBreakdown = order.summary.taxBreakdown;

      const lineItems = order.items.map((item) => {
        const taxableAmount = item.unitPrice * item.quantity;
        const taxRate = 18;
        const cgst = isIntraState ? taxableAmount * 0.09 : undefined;
        const sgst = isIntraState ? taxableAmount * 0.09 : undefined;
        const igst = !isIntraState ? taxableAmount * 0.18 : undefined;
        const totalTax = (cgst ?? 0) + (sgst ?? 0) + (igst ?? 0);

        return {
          description: `${item.name} (${item.size})`,
          hsnCode: '6204',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0,
          taxableAmount,
          taxRate,
          cgst,
          sgst,
          igst,
          total: taxableAmount + totalTax,
        };
      });

      return {
        id: `inv_${String(index + 1).padStart(3, '0')}`,
        invoiceNumber: `INV/2026-27/TWA/${String(index + 1).padStart(5, '0')}`,
        orderId: order.id,
        seller: {
          legalName: sellerGstDetails.legalName,
          gstin: sellerGstDetails.gstin,
          address: sellerGstDetails.address,
          stateCode: sellerGstDetails.stateCode,
        },
        buyer: {
          legalName: order.shippingAddress.fullName,
          address: order.shippingAddress,
          stateCode: order.shippingAddress.stateCode,
        },
        lineItems,
        hsnSummary: [
          {
            hsnCode: '6204',
            taxableAmount: taxBreakdown.taxableAmount,
            cgst: taxBreakdown.cgst,
            sgst: taxBreakdown.sgst,
            igst: taxBreakdown.igst,
            totalTax: taxBreakdown.totalTax,
          },
        ],
        taxBreakdown: {
          ...taxBreakdown,
          gstType: isIntraState ? GstType.CGST_SGST : GstType.IGST,
        },
        totalInWords: numberToWords(order.summary.grandTotal),
        issuedAt: order.createdAt,
      };
    });
}
