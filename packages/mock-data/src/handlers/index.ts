import { http, HttpResponse } from 'msw';
import type { ProductFilters } from '@twa/shared';
import { banners } from '../fixtures/banners';
import { categories } from '../fixtures/categories';
import { shippingCarriers } from '../fixtures/campaigns';
import { testimonials } from '../fixtures/testimonials';
import { aboutContent, brandSettings, policySections } from '../fixtures/settings';
import { MOCK_ADMIN_PASSWORD, MOCK_USER_PASSWORD, users } from '../fixtures/users';
import { mockStore } from '../store/mock-store';

const API = '/api/v1';

function paginate<T>(items: T[], page = 1, limit = 12) {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return {
    data,
    page,
    limit,
    total: items.length,
    totalPages: Math.ceil(items.length / limit),
  };
}

function filterProducts(params: URLSearchParams) {
  let items = mockStore.getProducts().filter((p) => p.isActive);

  const category = params.get('category');
  const tag = params.get('tag');
  const search = params.get('search');
  const sort = params.get('sort');
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');

  if (category) {
    const cat = categories.find((c) => c.slug === category || c.id === category);
    if (cat) items = items.filter((p) => p.categoryId === cat.id);
  }

  if (tag) items = items.filter((p) => p.tags.includes(tag as never));
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (minPrice) items = items.filter((p) => p.effectivePrice >= Number(minPrice));
  if (maxPrice) items = items.filter((p) => p.effectivePrice <= Number(maxPrice));

  switch (sort) {
    case 'price_asc':
      items.sort((a, b) => a.effectivePrice - b.effectivePrice);
      break;
    case 'price_desc':
      items.sort((a, b) => b.effectivePrice - a.effectivePrice);
      break;
    case 'newest':
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      break;
  }

  return items;
}

function requireAdmin(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export const handlers = [
  http.get(`${API}/banners`, () => HttpResponse.json(banners)),
  http.get(`${API}/categories`, () => HttpResponse.json(categories)),
  http.get(`${API}/testimonials`, () => HttpResponse.json(testimonials)),
  http.get(`${API}/settings/social`, () => HttpResponse.json(brandSettings.social)),
  http.get(`${API}/settings/brand`, () => HttpResponse.json(brandSettings)),
  http.get(`${API}/policies`, () => HttpResponse.json(policySections)),
  http.get(`${API}/about`, () => HttpResponse.json(aboutContent)),

  http.get(`${API}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 12);
    const items = filterProducts(url.searchParams);
    return HttpResponse.json(paginate(items, page, limit));
  }),

  http.get(`${API}/products/:slug`, ({ params }) => {
    const product = mockStore.getProductBySlug(params.slug as string);
    if (!product) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find((u) => u.email === body.email);
    const validPassword =
      body.password === MOCK_ADMIN_PASSWORD || body.password === MOCK_USER_PASSWORD;
    if (!user || !validPassword) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const token = `mock_token_${user.id}`;
    mockStore.setAuth(user.id, token);
    return HttpResponse.json({ accessToken: token, user });
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };
    const token = `mock_token_new`;
    const user = {
      id: 'user_new',
      name: body.name,
      email: body.email,
      role: 'customer' as const,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    mockStore.setAuth(user.id, token);
    return HttpResponse.json({ accessToken: token, user }, { status: 201 });
  }),

  http.post(`${API}/auth/guest-discount`, async ({ request }) => {
    await request.json();
    return HttpResponse.json({ couponCode: 'WELCOME10', discountPercent: 10 });
  }),

  http.get(`${API}/cart`, () => HttpResponse.json(mockStore.getCart())),
  http.post(`${API}/cart/items`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(mockStore.addToCart(body as never));
  }),
  http.patch(`${API}/cart/items/:id`, async ({ params, request }) => {
    const body = (await request.json()) as { quantity: number };
    return HttpResponse.json(mockStore.updateCartItem(params.id as string, body.quantity));
  }),
  http.delete(`${API}/cart/items/:id`, ({ params }) => {
    return HttpResponse.json(mockStore.removeCartItem(params.id as string));
  }),

  http.get(`${API}/orders`, () => {
    const userId = mockStore.getCurrentUserId();
    return HttpResponse.json(mockStore.getOrders(userId ?? undefined));
  }),

  http.post(`${API}/orders`, async ({ request }) => {
    const body = await request.json();
    const order = mockStore.createOrder(body as never);
    return HttpResponse.json(order, { status: 201 });
  }),

  http.post(`${API}/contact`, async () => {
    return HttpResponse.json({ success: true, message: 'Message received' });
  }),

  // Admin routes
  http.get(`${API}/admin/products`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getProducts());
  }),

  http.post(`${API}/admin/products`, async ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = await request.json();
    const product = mockStore.createProduct(body as never);
    return HttpResponse.json(product, { status: 201 });
  }),

  http.get(`${API}/admin/products/:id`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const product = mockStore.getProductById(params.id as string);
    if (!product) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.patch(`${API}/admin/products/:id`, async ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = await request.json();
    const product = mockStore.updateProduct(params.id as string, body as never);
    if (!product) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.delete(`${API}/admin/products/:id`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    mockStore.deleteProduct(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/admin/orders`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getOrders());
  }),

  http.get(`${API}/admin/orders/:id`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const order = mockStore.getOrders().find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.patch(`${API}/admin/orders/:id`, async ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = (await request.json()) as { status: never };
    const order = mockStore.updateOrderStatus(params.id as string, body.status);
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post(`${API}/admin/orders/:id/ship`, async ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = (await request.json()) as { trackingNumber: string };
    const order = mockStore.shipOrder(params.id as string, body.trackingNumber);
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.get(`${API}/admin/invoices`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getInvoices());
  }),

  http.get(`${API}/admin/invoices/:orderId`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const invoice = mockStore.getInvoiceByOrderId(params.orderId as string);
    if (!invoice) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(invoice);
  }),

  http.post(`${API}/admin/invoices/:orderId`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const invoice = mockStore.generateInvoice(params.orderId as string);
    if (!invoice) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(invoice, { status: 201 });
  }),

  http.get(`${API}/admin/users`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getUsers());
  }),

  http.patch(`${API}/admin/users/:id`, async ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = await request.json();
    const user = mockStore.updateUser(params.id as string, body as never);
    if (!user) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.get(`${API}/admin/campaigns`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getCampaigns());
  }),

  http.post(`${API}/admin/campaigns`, async ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = await request.json();
    const campaign = mockStore.createCampaign(body as never);
    return HttpResponse.json(campaign, { status: 201 });
  }),

  http.patch(`${API}/admin/campaigns/:id`, async ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    const body = await request.json();
    const campaign = mockStore.updateCampaign(params.id as string, body as never);
    if (!campaign) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(campaign);
  }),

  http.delete(`${API}/admin/campaigns/:id`, ({ request, params }) => {
    const err = requireAdmin(request);
    if (err) return err;
    mockStore.deleteCampaign(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/admin/analytics/sales`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(mockStore.getAnalytics());
  }),

  http.get(`${API}/admin/shipping/carriers`, ({ request }) => {
    const err = requireAdmin(request);
    if (err) return err;
    return HttpResponse.json(shippingCarriers);
  }),
];

export type { ProductFilters };
