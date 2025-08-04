"use client";
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import DashboardHeader from '../Layout/DashboardHeader';
import DashboardSidebar from '../Layout/DashboardSidebar';

export default function ArchitectDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getSession();
      const response = await fetch('/dashboard/architect', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data.dashboard);
    };
    fetchData();
  }, []);

  return (
    <>
      <DashboardHeader title="Architect Dashboard" />
      <div className="flex">
        <DashboardSidebar role="designer" />
        <main className="flex-1 p-6">
          {/* Architect-specific content */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                title="Your Plans" 
                value={stats.total_plans_uploaded} 
                icon="blueprint"
              />
              <StatCard 
                title="Total Earnings" 
                value={stats.total_earnings} 
                icon="payment"
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}