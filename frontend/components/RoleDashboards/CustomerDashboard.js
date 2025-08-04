"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import DashboardHeader from '../Layout/DashboardHeader';
import DashboardSidebar from '../Layout/DashboardSidebar';
import PlanCard from '../cards/planCard';
import { toast } from 'react-toastify';

export default function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/dashboard/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error(error.message);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handlePurchase = async (planId) => {
  try {
    const token = getSession();
    if (!token) {
      router.push('/login');
      return;
    }

    toast.info('Processing purchase...', { autoClose: false });
    
    const response = await fetch('/api/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ plan_id: planId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Purchase failed');
    }

    const result = await response.json();
    
    toast.dismiss();
    toast.success('Purchase successful!');
    
    // Refresh dashboard data
    const dashboardRes = await fetch('/dashboard/customer', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDashboardData(await dashboardRes.json());

    // Optional: Redirect to purchased item
    if (result.redirect_url) {
      router.push(result.redirect_url);
    }

  } catch (error) {
    toast.dismiss();
    toast.error(`Purchase failed: ${error.message}`);
    console.error('Purchase error:', error);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Customer Dashboard" />
      <div className="flex">
        <DashboardSidebar role="customer" />
        
        <main className="flex-1 p-6">
          {dashboardData ? (
            <div className="space-y-8">
              {/* Welcome Header */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">
                  {dashboardData.message || 'Welcome to Your Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Browse your purchased plans and discover new recommendations
                </p>
              </div>

              {/* Purchased Plans Section */}
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Purchased Plans
                  </h2>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => router.push('/plans/purchased')}
                  >
                    View All →
                  </button>
                </div>

                {dashboardData.dashboard.purchased_plans?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.dashboard.purchased_plans.map(plan => (
                      <PlanCard 
                        key={plan.id} 
                        plan={plan}
                        isPurchased={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No purchased plans yet</p>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => router.push('/plans')}
                    >
                      Browse Plans
                    </button>
                  </div>
                )}
              </section>

              {/* Recommended Plans Section */}
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Recommended For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.dashboard.recommended?.map(plan => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan}
                      onPurchase={() => handlePurchase(plan.id)}
                    />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load dashboard data</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}