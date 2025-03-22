import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../utils/auth';
import { getTokenFromCookie, isAuthenticated } from '../utils/cookies';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated: reduxIsAuthenticated } = useSelector((state) => state.user);
  
  // Get auth status from both Redux and cookie
  const isLoggedIn = user && isAuthenticated();
  
  // Get token from cookie
  const token = getTokenFromCookie();
  
  // Logout function
  const logout = () => logoutUser(dispatch);
  
  // Helper functions for role checking
  const isAdmin = user?.role === 'admin';
  const isFarmer = user?.role === 'farmer';
  const isConsumer = user?.role === 'consumer';
  
  // Get role-based home route
  const getHomeRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin': return '/admin/';
      case 'farmer': return '/farmer/';
      case 'consumer': return '/consumer/';
      default: return '/';
    }
  };
  
  return {
    user,
    loading,
    error,
    isLoggedIn,
    token,
    logout,
    isAdmin,
    isFarmer,
    isConsumer,
    getHomeRoute
  };
};

export default useAuth; 