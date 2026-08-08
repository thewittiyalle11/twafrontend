export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Returned = 'returned',
}

export enum ProductSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum GstType {
  CGST_SGST = 'intra_state',
  IGST = 'inter_state',
}

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
  Staff = 'staff',
}

export enum CampaignType {
  Percentage = 'percentage',
  Flat = 'flat',
  Bogo = 'bogo',
}

export enum AdminRole {
  SuperAdmin = 'super_admin',
  CatalogManager = 'catalog_manager',
  Fulfillment = 'fulfillment',
  Marketing = 'marketing',
}

export type ProductTag = 'new-arrival' | 'best-seller' | 'season-top-pick';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
