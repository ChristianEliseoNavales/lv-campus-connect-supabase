import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const SESSION_TIMEOUT_MINUTES = 60; // 60 minutes

  // Configure axios defaults and interceptors
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor to handle session expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 &&
            (error.response?.data?.code === 'TOKEN_EXPIRED' ||
             error.response?.data?.code === 'SESSION_EXPIRED')) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setupSessionTimeout();
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (googleToken) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        token: googleToken
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user and authentication state synchronously
      setUser(userData);
      setIsAuthenticated(true);
      setupSessionTimeout();

      // Wait a brief moment to ensure state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user and authentication state synchronously
      setUser(userData);
      setIsAuthenticated(true);
      setupSessionTimeout();

      // Wait a brief moment to ensure state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Email login failed:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      const errorCode = error.response?.data?.code;
      return { success: false, error: errorMessage, code: errorCode };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint for audit logging
      const token = localStorage.getItem('authToken');
      if (token) {
        await axios.post(`${API_URL}/api/auth/logout`);
      }
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Backend logout call failed:', error);
    }

    // Clear session timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }

    // Clear all authentication data from storage
    localStorage.removeItem('authToken');
    sessionStorage.clear(); // Clear all session storage

    // Clear any other potential auth-related localStorage items
    const authKeys = ['authToken', 'user', 'userRole', 'userDepartment', 'lastLoginTime'];
    authKeys.forEach(key => localStorage.removeItem(key));

    // Clear axios headers completely
    delete axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['X-Auth-Token'];

    // Reset axios defaults to ensure no auth headers persist
    axios.defaults.headers.common = {};

    // Clear React state
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);

    // Clear any cached navigation state by replacing current history entry
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Set up session timeout
  const setupSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(() => {
      logout();
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }, SESSION_TIMEOUT_MINUTES * 60 * 1000);

    setSessionTimeout(timeout);
  };

  // Reset session timeout on user activity
  const resetSessionTimeout = () => {
    if (isAuthenticated) {
      setupSessionTimeout();
    }
  };

  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;

    // Super admin has access to everything
    if (user.role === 'super_admin') return true;

    // Check specific role
    return user.role === requiredRole;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    if (!user) return false;

    // Super admin has access to everything
    if (user.role === 'super_admin') return true;

    // Check if user has any of the specified roles
    return roles.includes(user.role);
  }, [user]);

  const canAccessDepartment = useCallback((department) => {
    if (!user) return false;

    // Super admin can access all departments
    if (user.role === 'super_admin') return true;

    // Department admins can only access their own department
    return user.department === department;
  }, [user]);

  // Set up activity listeners for session timeout reset
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

      const resetTimeout = () => resetSessionTimeout();

      events.forEach(event => {
        document.addEventListener(event, resetTimeout, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimeout, true);
        });
      };
    }
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    login,
    loginWithEmail,
    logout,
    hasRole,
    hasAnyRole,
    canAccessDepartment,
    checkAuthStatus,
    resetSessionTimeout
  }), [user, loading, isAuthenticated, hasRole, hasAnyRole, canAccessDepartment]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
