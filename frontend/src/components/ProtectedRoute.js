import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Using the AuthContext for state

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Get user object and loading state

  if (loading) {
    // Show a loading spinner or null while auth state is being determined
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Authenticated, but role not allowed, redirect to dashboard or unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and authorized, render the child routes/component
  return <Outlet />;
};

export default ProtectedRoute;