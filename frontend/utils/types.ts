// User type
export interface User {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  role: string;
  status: string;
  isActive?: boolean;
  createdAt?: string;
  created_at?: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  category?: string;
}

// Dashboard stats
export interface Stats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
  totalProducts: number;
  totalRevenue: number;
  revenueGrowth: number;
  dailyActiveUsers: number;
}

// Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

// Settings type
export interface Settings {
  emailNotifications: boolean;
  autoRefresh: boolean;
  darkMode: boolean;
  displayName: string;
  email: string;
}

// Chart data types
export interface RevenueData {
  month: string;
  revenue: number;
}

export interface UsageData {
  date: string;
  users: number;
}

export interface ProductData {
  name: string;
  value: number;
}

// Dashboard props
export interface DashboardProps {
  initialUsers?: User[];
  initialProducts?: Product[];
}

// Tab component props
export interface TabProps {
  Stats: Stats;
  Users?: User[];
  Products?: Product[];
  revenueData?: RevenueData[];
  usageData?: UsageData[];
  productData?: ProductData[];
  Notifications?: Notification[];
  Settings?: Settings;
  updateSettings?: (settings: Partial<Settings>) => void;
  saveSettings?: () => void;
  setShowAddUserModal?: (show: boolean) => void;
  setShowForm?: (show: boolean) => void;
}