// API functions for authentication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Login failed. Please try again.' 
      };
    }

    return { 
      success: true, 
      token: data.token, 
      user: data.user 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: 'Network error. Please check your connection and try again.' 
    };
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to get user information.' 
      };
    }

    return { 
      success: true, 
      user: data.user 
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return { 
      success: false, 
      message: 'Network error. Please check your connection and try again.' 
    };
  }
}; 