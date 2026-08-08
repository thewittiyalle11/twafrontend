import { CampaignType, OrderStatus, type Campaign } from '@twa/shared';

export const campaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Summer Sale',
    code: 'SUMMER26',
    type: CampaignType.Percentage,
    value: 15,
    minOrderAmount: 1499,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    isActive: true,
    bannerId: 'banner_1',
    createdAt: '2026-05-15T00:00:00Z',
  },
  {
    id: 'camp_002',
    name: 'Festive Flat Off',
    code: 'FESTIVE500',
    type: CampaignType.Flat,
    value: 500,
    minOrderAmount: 2999,
    startDate: '2026-09-01',
    endDate: '2026-11-15',
    isActive: true,
    bannerId: 'banner_2',
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'camp_003',
    name: 'Welcome Discount',
    code: 'WELCOME10',
    type: CampaignType.Percentage,
    value: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const shippingCarriers = [
  { id: 'ship_1', name: 'BlueDart', baseRate: 99, estimatedDays: 3, isActive: true },
  { id: 'ship_2', name: 'Delhivery', baseRate: 79, estimatedDays: 5, isActive: true },
  { id: 'ship_3', name: 'India Post', baseRate: 49, estimatedDays: 7, isActive: true },
];

export const orderStatuses = [
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Processing,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
];
