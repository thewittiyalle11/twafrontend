import type {
  AddCartItemInput,
  AuthResponse,
  Banner,
  BrandSettings,
  Campaign,
  CartSummary,
  Category,
  ContactInput,
  CreateCampaignInput,
  CreateOrderInput,
  CreateProductInput,
  GuestDiscountInput,
  GuestDiscountResponse,
  Invoice,
  LoginInput,
  Order,
  Paginated,
  Product,
  ProductFilters,
  RegisterInput,
  SalesAnalytics,
  ShippingCarrier,
  SocialSettings,
  SuccessResponse,
  Testimonial,
  UpdateProductInput,
  User,
} from '@twa/shared';
import { OrderStatus } from '@twa/shared';
import { apiFetch, buildQuery } from '../client';

export interface IProductRepository {
  list(filters?: ProductFilters): Promise<Paginated<Product>>;
  getBySlug(slug: string): Promise<Product>;
  adminList(): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}

export interface ICartRepository {
  get(): Promise<CartSummary>;
  addItem(input: AddCartItemInput): Promise<CartSummary>;
  updateItem(id: string, quantity: number): Promise<CartSummary>;
  removeItem(id: string): Promise<CartSummary>;
}

export interface IOrderRepository {
  list(): Promise<Order[]>;
  create(input: CreateOrderInput): Promise<Order>;
  adminList(): Promise<Order[]>;
  adminGet(id: string): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  ship(id: string, trackingNumber: string, carrier: string): Promise<Order>;
}

export const productRepository: IProductRepository = {
  list: (filters) =>
    apiFetch<Paginated<Product>>(`/products${buildQuery(filters ?? {})}`),
  getBySlug: (slug) => apiFetch<Product>(`/products/${slug}`),
  adminList: () => apiFetch<Product[]>('/admin/products'),
  create: (input) =>
    apiFetch<Product>('/admin/products', { method: 'POST', body: JSON.stringify(input) }),
  update: (id, input) =>
    apiFetch<Product>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  delete: (id) => apiFetch<void>(`/admin/products/${id}`, { method: 'DELETE' }),
};

export const catalogRepository = {
  getBanners: () => apiFetch<Banner[]>('/banners'),
  getCategories: () => apiFetch<Category[]>('/categories'),
  getTestimonials: () => apiFetch<Testimonial[]>('/testimonials'),
  getSocialSettings: () => apiFetch<SocialSettings>('/settings/social'),
  getBrandSettings: () => apiFetch<BrandSettings>('/settings/brand'),
  getPolicies: () => apiFetch<{ id: string; title: string; content: string; sortOrder: number }[]>('/policies'),
  getAbout: () =>
    apiFetch<{
      brandStory: string;
      mission: string;
      team: { name: string; role: string; imageUrl: string }[];
    }>('/about'),
};

export const authRepository = {
  login: (input: LoginInput) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  register: (input: RegisterInput) =>
    apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  guestDiscount: (input: GuestDiscountInput) =>
    apiFetch<GuestDiscountResponse>('/auth/guest-discount', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  contact: (input: ContactInput) =>
    apiFetch<SuccessResponse>('/contact', { method: 'POST', body: JSON.stringify(input) }),
};

export const cartRepository: ICartRepository = {
  get: () => apiFetch<CartSummary>('/cart'),
  addItem: (input) =>
    apiFetch<CartSummary>('/cart/items', { method: 'POST', body: JSON.stringify(input) }),
  updateItem: (id, quantity) =>
    apiFetch<CartSummary>(`/cart/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (id) => apiFetch<CartSummary>(`/cart/items/${id}`, { method: 'DELETE' }),
};

export const orderRepository: IOrderRepository = {
  list: () => apiFetch<Order[]>('/orders'),
  create: (input) =>
    apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(input) }),
  adminList: () => apiFetch<Order[]>('/admin/orders'),
  adminGet: (id) => apiFetch<Order>(`/admin/orders/${id}`),
  updateStatus: (id, status) =>
    apiFetch<Order>(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  ship: (id, trackingNumber, carrier) =>
    apiFetch<Order>(`/admin/orders/${id}/ship`, {
      method: 'POST',
      body: JSON.stringify({ trackingNumber, carrier }),
    }),
};

export const adminRepository = {
  getUsers: () => apiFetch<User[]>('/admin/users'),
  updateUser: (id: string, data: Partial<User>) =>
    apiFetch<User>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getCampaigns: () => apiFetch<Campaign[]>('/admin/campaigns'),
  createCampaign: (input: CreateCampaignInput) =>
    apiFetch<Campaign>('/admin/campaigns', { method: 'POST', body: JSON.stringify(input) }),
  updateCampaign: (id: string, input: Partial<CreateCampaignInput>) =>
    apiFetch<Campaign>(`/admin/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteCampaign: (id: string) =>
    apiFetch<void>(`/admin/campaigns/${id}`, { method: 'DELETE' }),
  getInvoices: () => apiFetch<Invoice[]>('/admin/invoices'),
  getInvoiceByOrder: (orderId: string) => apiFetch<Invoice>(`/admin/invoices/${orderId}`),
  generateInvoice: (orderId: string) =>
    apiFetch<Invoice>(`/admin/invoices/${orderId}`, { method: 'POST' }),
  getAnalytics: () => apiFetch<SalesAnalytics>('/admin/analytics/sales'),
  getShippingCarriers: () => apiFetch<ShippingCarrier[]>('/admin/shipping/carriers'),
};
