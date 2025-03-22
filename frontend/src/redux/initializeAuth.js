import { getTokenFromCookie, getRefreshTokenFromCookie } from '../utils/cookies';
import { loginSuccess } from './slices/userSlice';
import { isTokenExpired } from '../utils/auth';
import axiosInstance from '../context/axiosInstance';

// Initialize Redux auth state from cookies
export const initializeAuth = async (store) => {
  // Check if token exists in cookies
  const token = getTokenFromCookie();
  
  if (!token || isTokenExpired(token)) {
    // Token doesn't exist or is expired, do nothing
    return;
  }
  
  try {
    // Fetch user info from API using stored token
    const response = await axiosInstance.get('/auth/me');
    
    // Initialize Redux state with user data
    store.dispatch(loginSuccess(response.data.user));
    
    console.log('Auth initialized with user:', response.data.user);
    
  } catch (error) {
    console.error('Error initializing auth state:', error);
    // In case of error, we don't dispatch any actions,
    // leaving the auth state empty and requiring user to log in again
  }
}; 