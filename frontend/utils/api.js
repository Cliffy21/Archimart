// Mock API functions for the dashboard

// Simulate API call to fetch users
export const fetchUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' }
      ]);
    }, 800);
  });
};

// Simulate API call to fetch products
export const fetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 99.99, stock: 45 },
        { id: 2, name: 'Smart Watch', category: 'electronics', price: 199.99, stock: 32 },
        { id: 3, name: 'Cotton T-Shirt', category: 'clothing', price: 24.99, stock: 78 }
      ]);
    }, 800);
  });
};

// Simulate API call to fetch analytics data
export const fetchAnalytics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenue: [1200, 1900, 1500, 2000, 1700, 2100, 2500],
        users: [100, 150, 130, 200, 180, 220, 250],
        products: [50, 70, 60, 80, 75, 90, 100]
      });
    }, 1000);
  });
};

// Simulate API call to add a new user
export const addUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: { ...userData, id: Math.floor(Math.random() * 1000) + 4 }
      });
    }, 500);
  });
};

// Simulate API call to add a new product
export const addProduct = async (productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        product: { ...productData, id: Math.floor(Math.random() * 1000) + 4 }
      });
    }, 500);
  });
};