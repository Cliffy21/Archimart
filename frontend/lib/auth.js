// lib/auth.js

export async function sendPasswordResetEmail(email) {
  try {
    const response = await fetch('/api/auth/send-reset-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset email');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token, 
        new_password: newPassword 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

export async function verifyResetToken(token) {
  try {
    const response = await fetch(`/admin/verify-reset-token?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid or expired token');
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error verifying reset token:', error);
    throw error;
  }
}

// Additional auth utilities for Flask backend
export async function login(email, password) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage or handle as needed
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function register(email, password, name) {
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    // Clear token regardless of response
    localStorage.removeItem('access_token');
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear token on error
    localStorage.removeItem('access_token');
    return true;
  }
}

export function getAuthToken() {
  return localStorage.getItem('access_token');
}

export function isAuthenticated() {
  const token = getAuthToken();
  return !!token;
}

// Helper function for authenticated API calls
export function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

// Get current user info
export async function getCurrentUser() {
  try {
    const response = await fetch('/dashboard/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}