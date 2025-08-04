import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import AdminDashboard from '../components/RoleDashboards/AdminDashboard';
import ArchitectDashboard from '../components/RoleDashboards/ArchitectDashboard';
import CustomerDashboard from '../components/RoleDashboards/CustomerDashboard';
import LoadingSpinner from '../components/ui/loading';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyRoleAndFetchDashboard = async () => {
      try {
        console.log('Starting authentication verification...');
        setSessionLoading(true);
        
        // Get session first
        const session = await getSession();
        if (!mounted) return;

        if (!session?.accessToken) {
          console.log('No active session found');
          setSessionLoading(false);
          return;
        }

        const token = session.accessToken;
        setSessionLoading(false);

        // Verify token with backend
        console.log('Verifying token with backend...');
        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-token`, {
          method: 'GET',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Check response format
        const contentType = verifyResponse.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const responseText = await verifyResponse.text();
          throw new Error(`Invalid response format: ${contentType}. Response: ${responseText.substring(0, 500)}`);
        }

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json().catch(() => ({}));
          throw new Error(`Token verification failed: ${verifyResponse.status} ${errorData.message || 'Unknown error'}`);
        }

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.valid || !verifyData.user) {
          throw new Error('Invalid token response from server');
        }

        // Extract and normalize role
        const userRole = verifyData.user.role?.toLowerCase() || 
                        verifyData.user.user_type?.toLowerCase() || 
                        verifyData.user.userType?.toLowerCase() ||
                        verifyData.role?.toLowerCase() ||
                        verifyData.user_type?.toLowerCase();
        
        if (!userRole) {
          throw new Error('User role not found');
        }

        if (!['admin', 'designer', 'customer'].includes(userRole)) {
          router.push('/unauthorized');
          return;
        }

        setRole(userRole);

        // Fetch welcome message if needed
        try {
          const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
            method: 'GET',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            setWelcomeMessage(dashboardData.message || '');
          }
        } catch (dashboardError) {
          console.warn('Failed to fetch dashboard message:', dashboardError);
        }

      } catch (err) {
        if (!mounted) return;
        console.error('Role verification failed:', err);
        setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
          setSessionLoading(false);
        }
      }
    };

    verifyRoleAndFetchDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Handle redirect after all states are settled
  useEffect(() => {
    if (!sessionLoading && !loading && !role && !error) {
      router.push('/login');
    }
  }, [sessionLoading, loading, role, error, router]);

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner fullScreen />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Authentication Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-red-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {welcomeMessage && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <p className="text-blue-700">{welcomeMessage}</p>
        </div>
      )}
      
      {role === 'admin' && <AdminDashboard />}
      {role === 'designer' && <ArchitectDashboard />}
      {role === 'customer' && <CustomerDashboard />}
    </div>
  );
}