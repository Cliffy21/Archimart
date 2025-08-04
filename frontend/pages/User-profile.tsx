
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve JWT token from localStorage (adjust if you store JWT elsewhere)
    const token = localStorage.getItem('token'); // Make sure this matches your login logic

    if (!token) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    // Fetch user profile from your backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await res.json();
        setUser(data.user || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 32, minWidth: 320 }}>
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {/* Add more user fields as needed */}
      </div>
    </div>
  );
};

export default ProfilePage;
