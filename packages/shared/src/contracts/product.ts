import type { ProductSize, ProductTag } from './enums';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductSizeStock {
  size: ProductSize;
  sku: string;
  stock: number;
}

export interface CustomizationOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  maxLength?: number;
  choices?: { value: string; label: string }[];
  additionalPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  categoryId: string;
  basePrice: number;
  discountPercent: number;
  effectivePrice: number;
  sizes: ProductSizeStock[];
  estimatedDeliveryDays: number;
  tags: ProductTag[];
  customizationOptions: CustomizationOption[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export interface ProductFilters {
  category?: string;
  tag?: ProductTag;
  size?: ProductSize;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateProductInput {
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  basePrice: number;
  discountPercent: number;
  estimatedDeliveryDays: number;
  tags: ProductTag[];
  sizes: ProductSizeStock[];
  customizationOptions: CustomizationOption[];
  images: Omit<ProductImage, 'id'>[];
  isActive?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;
