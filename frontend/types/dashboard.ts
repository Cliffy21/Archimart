export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  subscribers: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface UsageData {
  day: string;
  visits: number;
}

export interface ProductDistribution {
  name: string;
  value: number;
}

export interface EngagementData {
  date: string;
  newUsers: number;
  returningUsers: number;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
}

export interface GeoDistribution {
  name: string;
  value: number;
}

export interface ActivityItem {
  type: 'signup' | 'purchase' | 'notification';
  message: string;
  time: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
  totalProducts: number;
  totalRevenue: number;
  revenueGrowth: number;
  dailyActiveUsers: number;
} 