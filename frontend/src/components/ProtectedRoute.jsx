import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = null, 
  requiredDepartment = null,
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole || requiredRoles) {
    const allowedRoles = requiredRoles || [requiredRole];
    const hasRequiredRole = user.role === 'super_admin' || allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      return <UnauthorizedAccess userRole={user.role} requiredRoles={allowedRoles} />;
    }
  }

  // Check department-based access
  if (requiredDepartment) {
    const hasAccess = user.role === 'super_admin' || user.department === requiredDepartment;
    
    if (!hasAccess) {
      return (
        <UnauthorizedAccess 
          userRole={user.role} 
          userDepartment={user.department}
          requiredDepartment={requiredDepartment}
        />
      );
    }
  }

  // User is authenticated and authorized
  return children;
};

const UnauthorizedAccess = ({ 
  userRole, 
  userDepartment, 
  requiredRoles, 
  requiredDepartment 
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'super_admin': 'MIS Super Admin',
      'registrar_admin': 'Registrar Admin',
      'admissions_admin': 'Admissions Admin'
    };
    return roleNames[role] || role;
  };

  const getDepartmentDisplayName = (dept) => {
    const deptNames = {
      'mis': 'MIS',
      'registrar': "Registrar's Office",
      'admissions': 'Admissions Office'
    };
    return deptNames[dept] || dept;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border-2 border-red-200">
        <div className="text-center py-8 px-6 bg-gradient-to-br from-red-50 to-red-100 border-b border-red-200">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-red-800 text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-red-600 text-lg">You don't have permission to access this page</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-gray-800 text-lg font-semibold mb-4">Your Current Access Level</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{getRoleDisplayName(userRole)}</span>
              </div>
              {userDepartment && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Department:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{getDepartmentDisplayName(userDepartment)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
            <h3 className="text-yellow-800 text-lg font-semibold mb-4">Required Access Level</h3>
            <div className="space-y-3">
              {requiredRoles && (
                <div className="flex flex-col space-y-2">
                  <span className="text-yellow-700 font-medium">Required Role(s):</span>
                  <div className="flex flex-wrap gap-2">
                    {requiredRoles.map(role => (
                      <span key={role} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getRoleDisplayName(role)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {requiredDepartment && (
                <div className="flex justify-between items-center py-2 border-t border-yellow-200">
                  <span className="text-yellow-700 font-medium">Required Department:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getDepartmentDisplayName(requiredDepartment)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-blue-800 text-lg font-semibold mb-4">Need Access?</h3>
            <p className="text-blue-700 mb-3">
              If you believe you should have access to this page, please contact the
              MIS Department at <strong>mis@university.edu</strong> with your request.
            </p>
            <p className="text-blue-700">
              Include your name, email, and the specific access you need.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 py-5 px-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={handleGoBack} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-600">
            ← Go Back
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-red-600">
            🔓 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
