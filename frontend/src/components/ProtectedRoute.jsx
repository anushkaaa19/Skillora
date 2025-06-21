import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
