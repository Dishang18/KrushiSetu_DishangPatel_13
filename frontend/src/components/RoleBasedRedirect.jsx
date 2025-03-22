import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RoleBasedRedirect = () => {
  const { isLoggedIn, getHomeRoute } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // Get the appropriate route based on the user's role
      const targetRoute = getHomeRoute();
      
      // Only navigate if we have a valid target route
      if (targetRoute && targetRoute !== '/') {
        console.log(`Auto-redirecting to: ${targetRoute}`);
        navigate(targetRoute);
      }
    }
  }, [isLoggedIn, getHomeRoute, navigate]);

  // This component doesn't render anything
  return null;
};

export default RoleBasedRedirect; 