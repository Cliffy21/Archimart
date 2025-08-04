import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import { flaskApi } from '../../axios';
import { getSession } from '../../utils/auth.js';
import UserManagement from '../Dashboards/userManagement.js';
import ProductManagement from '../Dashboards/productManagement.js';
import Revenue from '../Dashboards/Revenue.js';
import ModernAnalytics from '../Dashboards/Analytics.js';
import ModernSettings from '../Dashboards/Settings.js';
import DashboardSidebar from '../Layout/DashboardSidebar.js';
import DashboardHeader from '../Layout/DashboardHeader.js';
import OverviewCards from '../Dashboards/OverviewCards.js';
import { getServerSession } from 'next-auth';

const AdminDashboard = ({ initialUsers = [], initialProducts = [] }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role || 'customer';

  // State
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersThisMonth: 0,
    totalProducts: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    dailyActiveUsers: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueData, setRevenueData] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getSession();
        const response = await flaskApi.get('/dashboard/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Example response structure, adjust as needed
        const statsData = response.data.stats || {};
        setStats({
          totalUsers: statsData.user_count || 0,
          activeUsers: statsData.active_user_count || 0,
          adminUsers: statsData.admin_count || 0,
          newUsersThisMonth: statsData.new_users_this_month || 0,
          totalProducts: statsData.product_count || 0,
          totalRevenue: parseFloat((statsData.total_sales || '0').replace('$', '').replace(/,/g, '')) || 0,
          revenueGrowth: statsData.revenue_growth || 0,
          dailyActiveUsers: statsData.daily_active_users || 0,
        });

        setUsers(response.data.users || []);
        setProducts(response.data.products || []);
        setRevenueData(response.data.revenueData || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if admin
    if (role === 'admin') {
      fetchDashboardData();
    } else {
      setLoading(false);
      if (role !== 'admin') {
        setError('Admin access required');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Filtering logic for users and products
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      user =>
        (user.username && user.username.toLowerCase().includes(q)) ||
        (user.name && user.name.toLowerCase().includes(q)) ||
        (user.email && user.email.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      product =>
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Currency formatter
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  // User deletion logic
  const handleDeleteUser = async (user) => {
    if (role !== 'admin') {
      toast.error('Only admins can delete users.');
      return;
    }
    if (!user?.id) {
      toast.error('Invalid user.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${user.username || user.name}"?`)) {
      return;
    }
    try {
      const token = await getSession();
      await flaskApi.delete(`/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success('User deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Product deletion logic
  const handleDeleteProduct = async (productId, productName) => {
    if (role !== 'admin') {
      toast.error('Only admins can delete products.');
      return;
    }
    if (!productId) {
      toast.error('Invalid product.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete product "${productName}"?`)) {
      return;
    }
    try {
      const token = await getSession();
      await flaskApi.delete(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Tab rendering logic
  const renderTab = () => {
    switch (activeTab) {
      case 'users':
        return role === 'admin' ? (
          <UserManagement
            filteredUsers={filteredUsers}
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
            setUsers={setUsers}
            confirmDelete={handleDeleteUser}
          />
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">Admin access required.</div>
        );
      case 'products':
        return role === 'admin' ? (
          <ProductManagement
            role={role}
            products={products}
            filteredProducts={filteredProducts}
            formatCurrency={formatCurrency}
            handleDeleteProduct={handleDeleteProduct}
          />
        ) : (
          <div className="text-center text-red-500 font-semibold py-8">Admin access required.</div>
        );
      case 'revenue':
        return <Revenue stats={stats} revenueData={revenueData} formatCurrency={formatCurrency} />;
      case 'analytics':
        return <ModernAnalytics />;
      case 'settings':
        return <ModernSettings session={session} />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <OverviewCards stats={stats} />
            {role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Quick Admin Actions */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Admin Tools</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="w-full flex items-center justify-between p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all"
                    >
                      <span className="text-blue-300">Create New User</span>
                      <UserPlus size={18} className="text-blue-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  // Loading and error handling
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && error.toLowerCase().includes('admin access required')) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        session={session}
      />
      <div className="lg:ml-64">
        <DashboardHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          notifications={[]} // notifications removed
        />
        <main className="p-6">
          {error && !error.toLowerCase().includes('admin access required') && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {/* Search bar for users/products */}
          {(activeTab === 'users' || activeTab === 'products') && (
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === 'users' ? 'users' : 'products'}...`}
                className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {renderTab()}
        </main>
        {/* Add User Modal */}
        {showAddUserModal && (
          <UserManagement
            filteredUsers={filteredUsers}
            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}
            setUsers={setUsers}
            confirmDelete={handleDeleteUser}
          />
        )}
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;