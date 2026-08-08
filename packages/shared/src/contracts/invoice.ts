import type { Address } from './common';
import type { GstBreakdown } from './order';

export interface GstEntity {
  legalName: string;
  gstin?: string;
  address: Address;
  stateCode: string;
}

export interface InvoiceLineItem {
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxableAmount: number;
  taxRate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total: number;
}

export interface HsnSummaryRow {
  hsnCode: string;
  taxableAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  seller: GstEntity;
  buyer: GstEntity;
  lineItems: InvoiceLineItem[];
  hsnSummary: HsnSummaryRow[];
  taxBreakdown: GstBreakdown;
  totalInWords: string;
  issuedAt: string;
}
