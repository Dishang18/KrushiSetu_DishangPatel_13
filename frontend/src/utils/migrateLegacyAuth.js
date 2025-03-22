import { setTokenCookie, setRefreshTokenCookie, getTokenFromCookie } from './cookies';
import store from '../redux/store';
import { loginSuccess } from '../redux/slices/userSlice';

// Migrate legacy localStorage auth tokens to cookies
export const migrateLegacyAuth = () => {
  // Check if we already have a token in cookies
  if (getTokenFromCookie()) {
    // We already have a token in cookies, just clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return;
  }

  // Check for token in localStorage
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  // If we have tokens in localStorage, move them to cookies
  if (token) {
    setTokenCookie(token);
    localStorage.removeItem('token');
    
    // Also try to get and migrate user data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        store.dispatch(loginSuccess(userData));
        console.log('Migrated user data from localStorage to Redux:', userData);
      }
    } catch (e) {
      console.error('Error migrating user data from localStorage:', e);
    }
  }
  
  if (refreshToken) {
    setRefreshTokenCookie(refreshToken);
    localStorage.removeItem('refreshToken');
  }
  
  // Clear any user data in localStorage
  localStorage.removeItem('user');
}; 