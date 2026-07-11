import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-soft-sage border-t-walnut-brown rounded-full animate-spin"></div>
        <p className="mt-4 text-walnut-brown font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    // Redirect to login but keep the page they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
