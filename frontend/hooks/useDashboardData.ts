import { useState, useEffect } from 'react';
import axios from 'axios';
import type {
  User,
  Product,
  RevenueData,
  UsageData,
  ProductDistribution,
  DashboardStats
} from '../types/dashboard';

interface UseDashboardDataReturn {
  stats: DashboardStats;
  users: User[];
  products: Product[];
  revenueData: RevenueData[];
  usageData: UsageData[];
  productData: ProductDistribution[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersThisMonth: 0,
    totalProducts: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    dailyActiveUsers: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [productData, setProductData] = useState<ProductDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch users
      const usersRes = await axios.get<User[]>(`${baseURL}/api/admin/users`);
      setUsers(usersRes.data);
      
      // Fetch products
      const productsRes = await axios.get<Product[]>(`${baseURL}/api/admin/products`);
      setProducts(productsRes.data);
      
      // Fetch revenue data
      const revenueRes = await axios.get(`${baseURL}/api/admin/revenue`);
      setRevenueData(revenueRes.data.monthly);
      
      // Fetch usage data
      const usageRes = await axios.get(`${baseURL}/api/admin/analytics/usage`);
      setUsageData(usageRes.data.usage);
      setProductData(usageRes.data.userTypes);
      
      // Calculate stats
      const activeUsers = usersRes.data.filter(user => user.isActive).length;
      const adminUsers = usersRes.data.filter(user => user.role === 'admin').length;
      
      // Calculate new users this month
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = usersRes.data.filter(user => {
        return new Date(user.createdAt) >= thisMonth;
      }).length;
      
      setStats({
        totalUsers: usersRes.data.length,
        activeUsers,
        adminUsers,
        newUsersThisMonth,
        totalProducts: productsRes.data.length,
        totalRevenue: revenueRes.data.total,
        revenueGrowth: revenueRes.data.growth,
        dailyActiveUsers: usageRes.data.dailyActive
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    users,
    products,
    revenueData,
    usageData,
    productData,
    loading,
    error,
    refetch: fetchData
  };
};

export default useDashboardData; 