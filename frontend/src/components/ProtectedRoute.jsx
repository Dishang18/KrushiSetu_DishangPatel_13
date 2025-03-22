import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, getHomeRoute } = useAuth();
  const location = useLocation();

  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the appropriate home route for the user's role
    return <Navigate to={getHomeRoute()} replace />;
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute; 