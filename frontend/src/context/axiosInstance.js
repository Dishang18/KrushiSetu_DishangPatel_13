import axios from 'axios';
import { getTokenFromCookie, removeAuthCookies } from '../utils/cookies';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = getTokenFromCookie();
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear cookies and redirect to login if token is invalid
      removeAuthCookies();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 