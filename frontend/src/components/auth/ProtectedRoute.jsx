import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui';

// ============================================================================
// DEVELOPMENT BYPASS FLAG - TEMPORARILY DISABLE AUTHENTICATION
// ============================================================================
// Set to true to bypass all authentication checks during development
// WARNING: Set back to false before deploying to production!
const DEV_BYPASS_AUTH = true;
// ============================================================================

const ProtectedRoute = ({ children, requiredRoles = [], redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, user, canAccessRoute } = useAuth();
  const location = useLocation();

  // DEVELOPMENT BYPASS: Skip all authentication checks if flag is enabled
  if (DEV_BYPASS_AUTH) {
    console.warn('⚠️ DEVELOPMENT MODE: Authentication checks are BYPASSED');
    return children;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user?.role);
    if (!hasRequiredRole) {
      return <Navigate to="/admin/unauthorized" replace />;
    }
  }

  // Check route-specific access
  if (!canAccessRoute(location.pathname)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
