import {
  computeCartSummary,
  computeEffectivePrice,
  type AddCartItemInput,
  type Campaign,
  type CartItem,
  type CartSummary,
  type CreateOrderInput,
  type CreateProductInput,
  type Invoice,
  type Order,
  type Product,
  type SalesAnalytics,
  type User,
} from '@twa/shared';
import { OrderStatus } from '@twa/shared';
import { campaigns as initialCampaigns } from '../fixtures/campaigns';
import { products as initialProducts } from '../fixtures/products';
import { users as initialUsers } from '../fixtures/users';
import { sellerGstDetails } from '../fixtures/settings';
import { buildInvoices } from './invoice-builder';

let products = [...initialProducts];
let campaigns = [...initialCampaigns];
let users = [...initialUsers];
let cartItems: CartItem[] = [];
let orders: Order[] = buildInitialOrders();
let invoices: Invoice[] = buildInvoices(orders);
let orderCounter = orders.length + 1;
let currentUserId: string | null = null;
let authToken: string | null = null;

function buildInitialOrders(): Order[] {
  const sampleAddress = {
    fullName: 'Priya Sharma',
    phone: '+91 9876543210',
    line1: '42, Palm Grove Apartments',
    city: 'Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400001',
    country: 'India',
  };

  const p1 = initialProducts[0];
  const p2 = initialProducts[6];

  const items1: CartItem[] = [
    {
      id: 'ci_seed_1',
      productId: p1.id,
      productSlug: p1.slug,
      name: p1.name,
      imageUrl: p1.images[0].url,
      size: p1.sizes[1].size,
      quantity: 1,
      unitPrice: p1.effectivePrice,
      discountPercent: p1.discountPercent,
    },
  ];

  const items2: CartItem[] = [
    {
      id: 'ci_seed_2',
      productId: p2.id,
      productSlug: p2.slug,
      name: p2.name,
      imageUrl: p2.images[0].url,
      size: p2.sizes[0].size,
      quantity: 2,
      unitPrice: p2.effectivePrice,
      discountPercent: p2.discountPercent,
    },
  ];

  const summary1 = { items: items1, ...computeCartSummary(items1, '27') };
  const summary2 = { items: items2, ...computeCartSummary(items2, '29') };

  return [
    {
      id: 'ord_001',
      orderNumber: 'TWA-2026-000001',
      userId: 'user_001',
      items: items1.map(({ id, ...rest }) => ({ id, ...rest })),
      shippingAddress: sampleAddress,
      billingAddress: sampleAddress,
      status: OrderStatus.Delivered,
      paymentStatus: 'paid',
      summary: summary1,
      invoiceId: 'inv_001',
      trackingNumber: 'BD1234567890',
      createdAt: '2026-07-01T10:00:00Z',
      updatedAt: '2026-07-08T14:00:00Z',
    },
    {
      id: 'ord_002',
      orderNumber: 'TWA-2026-000002',
      userId: 'user_002',
      items: items2.map(({ id, ...rest }) => ({ id, ...rest })),
      shippingAddress: { ...sampleAddress, fullName: 'Arjun Mehta', state: 'Telangana', stateCode: '29', city: 'Hyderabad', pincode: '500001' },
      billingAddress: { ...sampleAddress, fullName: 'Arjun Mehta', state: 'Telangana', stateCode: '29', city: 'Hyderabad', pincode: '500001' },
      status: OrderStatus.Shipped,
      paymentStatus: 'paid',
      summary: summary2,
      invoiceId: 'inv_002',
      trackingNumber: 'DL9876543210',
      createdAt: '2026-07-20T09:00:00Z',
      updatedAt: '2026-07-25T11:00:00Z',
    },
    {
      id: 'ord_003',
      orderNumber: 'TWA-2026-000003',
      userId: 'user_001',
      items: items1.map(({ id, ...rest }) => ({ id: `ci_${id}_2`, ...rest })),
      shippingAddress: sampleAddress,
      billingAddress: sampleAddress,
      status: OrderStatus.Processing,
      paymentStatus: 'paid',
      summary: summary1,
      createdAt: '2026-08-01T08:00:00Z',
      updatedAt: '2026-08-02T10:00:00Z',
    },
    {
      id: 'ord_004',
      orderNumber: 'TWA-2026-000004',
      userId: 'user_002',
      items: items2.map(({ id, ...rest }) => ({ id: `ci_${id}_3`, ...rest })),
      shippingAddress: { ...sampleAddress, fullName: 'Arjun Mehta', state: 'Telangana', stateCode: '29', city: 'Hyderabad', pincode: '500001' },
      billingAddress: { ...sampleAddress, fullName: 'Arjun Mehta', state: 'Telangana', stateCode: '29', city: 'Hyderabad', pincode: '500001' },
      status: OrderStatus.Pending,
      paymentStatus: 'pending',
      summary: summary2,
      createdAt: '2026-08-05T16:00:00Z',
      updatedAt: '2026-08-05T16:00:00Z',
    },
  ];
}

function getCartSummary(stateCode = '27'): CartSummary {
  const totals = computeCartSummary(cartItems, stateCode);
  return { items: [...cartItems], ...totals };
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const mockStore = {
  getProducts: () => products,
  getProductBySlug: (slug: string) => products.find((p) => p.slug === slug),
  getProductById: (id: string) => products.find((p) => p.id === id),

  createProduct: (input: CreateProductInput): Product => {
    const product: Product = {
      id: generateId('prod'),
      slug: input.slug,
      name: input.name,
      description: input.description,
      shortDescription: input.shortDescription,
      images: input.images.map((img, i) => ({
        ...img,
        id: generateId('img'),
        sortOrder: i + 1,
      })),
      categoryId: input.categoryId,
      basePrice: input.basePrice,
      discountPercent: input.discountPercent,
      effectivePrice: computeEffectivePrice(input.basePrice, input.discountPercent),
      sizes: input.sizes,
      estimatedDeliveryDays: input.estimatedDeliveryDays,
      tags: input.tags,
      customizationOptions: input.customizationOptions,
      isActive: input.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [product, ...products];
    return product;
  },

  updateProduct: (id: string, input: Partial<CreateProductInput>): Product | undefined => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    const existing = products[index];
    const updated: Product = {
      ...existing,
      ...input,
      effectivePrice: computeEffectivePrice(
        input.basePrice ?? existing.basePrice,
        input.discountPercent ?? existing.discountPercent
      ),
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    return updated;
  },

  deleteProduct: (id: string): boolean => {
    const len = products.length;
    products = products.filter((p) => p.id !== id);
    return products.length < len;
  },

  getCart: (stateCode?: string) => getCartSummary(stateCode),

  addToCart: (input: AddCartItemInput): CartSummary => {
    const product = products.find((p) => p.id === input.productId);
    if (!product) throw new Error('Product not found');

    const existing = cartItems.find(
      (item) =>
        item.productId === input.productId &&
        item.size === input.size &&
        JSON.stringify(item.customization) === JSON.stringify(input.customization)
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + input.qty, 10);
    } else {
      cartItems.push({
        id: generateId('ci'),
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        imageUrl: product.images[0]?.url ?? '',
        size: input.size,
        quantity: input.qty,
        unitPrice: product.effectivePrice,
        discountPercent: product.discountPercent,
        customization: input.customization,
      });
    }

    return getCartSummary();
  },

  updateCartItem: (id: string, quantity: number): CartSummary => {
    cartItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item
    );
    return getCartSummary();
  },

  removeCartItem: (id: string): CartSummary => {
    cartItems = cartItems.filter((item) => item.id !== id);
    return getCartSummary();
  },

  clearCart: () => {
    cartItems = [];
  },

  getOrders: (userId?: string) =>
    userId ? orders.filter((o) => o.userId === userId) : orders,

  createOrder: (input: CreateOrderInput): Order => {
    const address = input.shippingAddress ?? {
      fullName: 'Guest User',
      phone: '+91 9999999999',
      line1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '400001',
      country: 'India',
    };

    const summary = getCartSummary(address.stateCode);
    const order: Order = {
      id: generateId('ord'),
      orderNumber: `TWA-2026-${String(orderCounter++).padStart(6, '0')}`,
      userId: currentUserId ?? 'guest',
      items: summary.items.map(({ id, ...rest }) => ({ id, ...rest })),
      shippingAddress: address,
      billingAddress: input.billingAddress ?? address,
      status: OrderStatus.Pending,
      paymentStatus: 'paid',
      summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders = [order, ...orders];
    cartItems = [];
    return order;
  },

  updateOrderStatus: (id: string, status: OrderStatus): Order | undefined => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;
    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
    return orders[index];
  },

  shipOrder: (id: string, trackingNumber: string): Order | undefined => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;
    orders[index] = {
      ...orders[index],
      status: OrderStatus.Shipped,
      trackingNumber,
      updatedAt: new Date().toISOString(),
    };
    return orders[index];
  },

  getInvoices: () => invoices,

  getInvoiceByOrderId: (orderId: string) => invoices.find((i) => i.orderId === orderId),

  generateInvoice: (orderId: string): Invoice | undefined => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;
    const existing = invoices.find((i) => i.orderId === orderId);
    if (existing) return existing;

    const invoice = buildInvoices([order])[0];
    invoices = [invoice, ...invoices];
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    orders[orderIndex] = { ...orders[orderIndex], invoiceId: invoice.id };
    return invoice;
  },

  getUsers: () => users,

  updateUser: (id: string, data: Partial<User>): User | undefined => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...data };
    return users[index];
  },

  getCampaigns: () => campaigns,

  createCampaign: (input: Omit<Campaign, 'id' | 'createdAt'>): Campaign => {
    const campaign: Campaign = {
      ...input,
      id: generateId('camp'),
      createdAt: new Date().toISOString(),
    };
    campaigns = [campaign, ...campaigns];
    return campaign;
  },

  updateCampaign: (id: string, input: Partial<Campaign>): Campaign | undefined => {
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    campaigns[index] = { ...campaigns[index], ...input };
    return campaigns[index];
  },

  deleteCampaign: (id: string): boolean => {
    const len = campaigns.length;
    campaigns = campaigns.filter((c) => c.id !== id);
    return campaigns.length < len;
  },

  setAuth: (userId: string | null, token: string | null) => {
    currentUserId = userId;
    authToken = token;
  },

  getAuthToken: () => authToken,
  getCurrentUserId: () => currentUserId,

  getAnalytics: (): SalesAnalytics => {
    const today = new Date().toISOString().slice(0, 10);
    const ordersToday = orders.filter((o) => o.createdAt.startsWith(today));
    const revenueToday = ordersToday.reduce((s, o) => s + o.summary.grandTotal, 0);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const ordersThisMonth = orders.filter((o) => o.createdAt.startsWith(thisMonth));

    const lowStockProducts = products
      .flatMap((p) =>
        p.sizes.map((s) => ({
          id: p.id,
          name: `${p.name} (${s.size})`,
          stock: s.stock,
        }))
      )
      .filter((p) => p.stock <= 5)
      .slice(0, 5);

    const ordersByStatus = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      ordersToday: ordersToday.length,
      revenueToday,
      revenueThisMonth: ordersThisMonth.reduce((s, o) => s + o.summary.grandTotal, 0),
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + o.summary.grandTotal, 0),
      lowStockProducts,
      ordersByStatus,
      revenueByCategory: [
        { category: 'Men', revenue: 45000 },
        { category: 'Women', revenue: 78000 },
        { category: 'Kids', revenue: 12000 },
        { category: 'Accessories', revenue: 8500 },
        { category: 'Festive', revenue: 95000 },
        { category: 'Sustainable', revenue: 22000 },
      ],
    };
  },

  getSellerGst: () => sellerGstDetails,
};
