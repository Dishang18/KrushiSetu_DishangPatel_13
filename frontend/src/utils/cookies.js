import Cookies from 'js-cookie';

// Cookie options (expiry, secure, etc.)
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// Set token in cookies
export const setTokenCookie = (token) => {
  Cookies.set('auth_token', token, cookieOptions);
};

// Set refresh token in cookies
export const setRefreshTokenCookie = (refreshToken) => {
  Cookies.set('refresh_token', refreshToken, {
    ...cookieOptions,
    expires: 30 // Longer expiry for refresh token
  });
};

// Get token from cookies
export const getTokenFromCookie = () => {
  return Cookies.get('auth_token');
};

// Get refresh token from cookies
export const getRefreshTokenFromCookie = () => {
  return Cookies.get('refresh_token');
};

// Remove auth cookies
export const removeAuthCookies = () => {
  Cookies.remove('auth_token');
  Cookies.remove('refresh_token');
};

// Check if user is authenticated based on cookie
export const isAuthenticated = () => {
  return !!getTokenFromCookie();
}; 