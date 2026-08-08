import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AddCartItemInput,
  ContactInput,
  CreateOrderInput,
  GuestDiscountInput,
  LoginInput,
  ProductFilters,
  RegisterInput,
} from '@twa/shared';
import { OrderStatus } from '@twa/shared';
import {
  adminRepository,
  authRepository,
  cartRepository,
  catalogRepository,
  orderRepository,
  productRepository,
} from '../repositories';

export const queryKeys = {
  banners: ['banners'] as const,
  categories: ['categories'] as const,
  products: (filters?: ProductFilters) => ['products', filters] as const,
  product: (slug: string) => ['product', slug] as const,
  testimonials: ['testimonials'] as const,
  social: ['social'] as const,
  brand: ['brand'] as const,
  policies: ['policies'] as const,
  about: ['about'] as const,
  cart: ['cart'] as const,
  orders: ['orders'] as const,
  adminProducts: ['admin', 'products'] as const,
  adminOrders: ['admin', 'orders'] as const,
  adminOrder: (id: string) => ['admin', 'orders', id] as const,
  adminUsers: ['admin', 'users'] as const,
  adminCampaigns: ['admin', 'campaigns'] as const,
  adminInvoices: ['admin', 'invoices'] as const,
  adminAnalytics: ['admin', 'analytics'] as const,
  adminCarriers: ['admin', 'carriers'] as const,
};

export function useBanners() {
  return useQuery({ queryKey: queryKeys.banners, queryFn: catalogRepository.getBanners });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: catalogRepository.getCategories });
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productRepository.list(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => productRepository.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useTestimonials() {
  return useQuery({ queryKey: queryKeys.testimonials, queryFn: catalogRepository.getTestimonials });
}

export function useSocialSettings() {
  return useQuery({ queryKey: queryKeys.social, queryFn: catalogRepository.getSocialSettings });
}

export function useBrandSettings() {
  return useQuery({ queryKey: queryKeys.brand, queryFn: catalogRepository.getBrandSettings });
}

export function usePolicies() {
  return useQuery({ queryKey: queryKeys.policies, queryFn: catalogRepository.getPolicies });
}

export function useAbout() {
  return useQuery({ queryKey: queryKeys.about, queryFn: catalogRepository.getAbout });
}

export function useCart() {
  return useQuery({ queryKey: queryKeys.cart, queryFn: cartRepository.get });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCartItemInput) => cartRepository.addItem(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartRepository.updateItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cartRepository.removeItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}

export function useLogin() {
  return useMutation({ mutationFn: (input: LoginInput) => authRepository.login(input) });
}

export function useRegister() {
  return useMutation({ mutationFn: (input: RegisterInput) => authRepository.register(input) });
}

export function useGuestDiscount() {
  return useMutation({
    mutationFn: (input: GuestDiscountInput) => authRepository.guestDiscount(input),
  });
}

export function useContact() {
  return useMutation({ mutationFn: (input: ContactInput) => authRepository.contact(input) });
}

export function useOrders() {
  return useQuery({ queryKey: queryKeys.orders, queryFn: orderRepository.list });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderRepository.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders });
      qc.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

// Admin hooks
export function useAdminProducts() {
  return useQuery({ queryKey: queryKeys.adminProducts, queryFn: productRepository.adminList });
}

export function useAdminOrders() {
  return useQuery({ queryKey: queryKeys.adminOrders, queryFn: orderRepository.adminList });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.adminOrder(id),
    queryFn: () => orderRepository.adminGet(id),
    enabled: !!id,
  });
}

export function useAdminUsers() {
  return useQuery({ queryKey: queryKeys.adminUsers, queryFn: adminRepository.getUsers });
}

export function useAdminCampaigns() {
  return useQuery({ queryKey: queryKeys.adminCampaigns, queryFn: adminRepository.getCampaigns });
}

export function useAdminInvoices() {
  return useQuery({ queryKey: queryKeys.adminInvoices, queryFn: adminRepository.getInvoices });
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: queryKeys.adminAnalytics, queryFn: adminRepository.getAnalytics });
}

export function useAdminCarriers() {
  return useQuery({ queryKey: queryKeys.adminCarriers, queryFn: adminRepository.getShippingCarriers });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderRepository.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminOrders }),
  });
}

export function useShipOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      trackingNumber,
      carrier,
    }: {
      id: string;
      trackingNumber: string;
      carrier: string;
    }) => orderRepository.ship(id, trackingNumber, carrier),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminOrders }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof adminRepository.updateUser>[1] }) =>
      adminRepository.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminUsers }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productRepository.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminProducts }),
  });
}

export function useGenerateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => adminRepository.generateInvoice(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminInvoices }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteCampaign(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminCampaigns }),
  });
}
