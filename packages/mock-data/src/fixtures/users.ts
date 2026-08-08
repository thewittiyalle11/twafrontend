import { AdminRole, OrderStatus, UserRole, type User } from '@twa/shared';

export const users: User[] = [
  {
    id: 'user_admin',
    name: 'Admin User',
    email: 'admin@twafashion.in',
    phone: '+91 98765 43210',
    role: UserRole.Admin,
    adminRole: AdminRole.SuperAdmin,
    isBlocked: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user_001',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543210',
    role: UserRole.Customer,
    isBlocked: false,
    createdAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'user_002',
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    phone: '+91 9876543211',
    role: UserRole.Customer,
    isBlocked: false,
    createdAt: '2025-07-20T00:00:00Z',
  },
  {
    id: 'user_003',
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
    phone: '+91 9876543212',
    role: UserRole.Customer,
    isBlocked: true,
    createdAt: '2025-08-10T00:00:00Z',
  },
];

export const MOCK_ADMIN_PASSWORD = 'admin123';
export const MOCK_USER_PASSWORD = 'password123';
