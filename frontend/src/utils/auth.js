import { removeAuthCookies, getTokenFromCookie } from './cookies';
import { logout } from '../redux/slices/userSlice';

// Logout function
export const logoutUser = (dispatch) => {
  // Clear cookies
  removeAuthCookies();
  
  // Clear Redux state
  dispatch(logout());
};

// Get auth header for API requests
export const getAuthHeader = () => {
  const token = getTokenFromCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
}; 