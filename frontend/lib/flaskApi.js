import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create the axios instance first
const instance = axios.create({
  baseURL: process.env.FLASK_BACKEND_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Skip auth for public endpoints
    const publicEndpoints = [
      '/login',
      '/register',
      '/verify-token'
    ];
    
    if (publicEndpoints.some(ep => config.url.includes(ep))) {
      return config;
    }

    // Manual auth takes precedence
    if (!config.headers.Authorization) {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 
                       error.response?.statusText || 
                       error.message;
    
    if (error.response?.status === 401) {
      // Handle token expiration
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session_expired=1';
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

// Create the flaskApi object with all methods
const flaskApi = {
  instance,

  // Auth methods
  login: (credentials) => instance.post('/login', credentials),
  verifyToken: () => instance.get('/verify-token'),

  // Dashboard methods
  getAdminDashboard: () => instance.get('/dashboard/admin'),
  getArchitectDashboard: () => instance.get('/dashboard/architect'),
  getCustomerDashboard: () => instance.get('/dashboard/customer'),

  // User management
  createUser: (userData) => instance.post('/admin/users', userData),
  getUsers: () => instance.get('/admin/users'),

  // Purchase handling
  createPurchase: (planId) => instance.post('/purchases', { plan_id: planId }),

  // Fallback methods
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config)
};

export default flaskApi;