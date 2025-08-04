import { getSession } from 'next-auth/react';
import axios from 'axios';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (req.method === 'GET') {
    try {
      // Make a request to your backend API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Return a more helpful error message
      return res.status(500).json({ 
        message: 'Failed to fetch users',
        error: error.response?.data || error.message
      });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}