import { z } from 'zod';
import { CampaignType, OrderStatus, ProductSize, UserRole } from '../contracts/enums';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const guestDiscountSchema = z.object({
  email: z.string().email('Valid email required'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const addCartItemSchema = z.object({
  productId: z.string(),
  size: z.nativeEnum(ProductSize),
  qty: z.number().int().min(1).max(10),
  customization: z.record(z.string()).optional(),
});

export const createOrderSchema = z.object({
  addressId: z.string().optional(),
  shippingAddress: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      line1: z.string().min(3),
      line2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      stateCode: z.string().length(2),
      pincode: z.string().length(6),
      country: z.string().default('India'),
    })
    .optional(),
  billingAddress: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      line1: z.string().min(3),
      line2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      stateCode: z.string().length(2),
      pincode: z.string().length(6),
      country: z.string().default('India'),
    })
    .optional(),
  couponCode: z.string().optional(),
  gstin: z.string().optional(),
});

export const productFormSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  categoryId: z.string(),
  basePrice: z.number().positive(),
  discountPercent: z.number().min(0).max(100),
  estimatedDeliveryDays: z.number().int().positive(),
  tags: z.array(z.enum(['new-arrival', 'best-seller', 'season-top-pick'])),
  isActive: z.boolean().default(true),
});

export const campaignFormSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(3),
  type: z.nativeEnum(CampaignType),
  value: z.number().positive(),
  minOrderAmount: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().default(true),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const shipOrderSchema = z.object({
  trackingNumber: z.string().min(5),
  carrier: z.string().min(2),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
export type CampaignFormData = z.infer<typeof campaignFormSchema>;
