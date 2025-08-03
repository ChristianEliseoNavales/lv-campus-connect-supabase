import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // Longer duration for errors
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove }) => {
  const { id, type, message, title, action } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const handleClose = () => {
    onRemove(id);
  };

  const handleAction = () => {
    if (action && action.handler) {
      action.handler();
    }
    handleClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600';
      case 'error': return 'bg-red-500 border-red-600';
      case 'warning': return 'bg-yellow-500 border-yellow-600';
      case 'info': return 'bg-blue-500 border-blue-600';
      default: return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className={`${getTypeStyles()} text-white p-4 rounded-lg shadow-lg border-l-4 animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          <div className="text-sm">{message}</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3">
        {action && (
          <button
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
            onClick={handleAction}
          >
            {action.label}
          </button>
        )}
        <button
          className="bg-white/20 hover:bg-white/30 text-white w-6 h-6 rounded flex items-center justify-center text-xs transition-colors duration-200"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Helper function to show authentication-related notifications
export const showAuthError = (error, showError) => {
  let message = 'Authentication failed. Please try again.';
  let title = 'Authentication Error';

  if (error.response?.data?.code) {
    switch (error.response.data.code) {
      case 'USER_NOT_AUTHORIZED':
        title = 'Access Denied';
        message = 'Your email is not authorized to access this system. Please contact the administrator.';
        break;
      case 'TOKEN_EXPIRED':
      case 'SESSION_EXPIRED':
        title = 'Session Expired';
        message = 'Your session has expired. Please log in again.';
        break;
      case 'INVALID_GOOGLE_TOKEN':
        title = 'Google Sign-In Failed';
        message = 'Google authentication failed. Please try signing in again.';
        break;
      case 'EMAIL_NOT_VERIFIED':
        title = 'Email Not Verified';
        message = 'Please verify your email address with Google before signing in.';
        break;
      case 'MISSING_TOKEN':
        title = 'Authentication Error';
        message = 'No authentication token received. Please try signing in again.';
        break;
      case 'AUTH_SERVER_ERROR':
        title = 'Server Error';
        message = 'Authentication server error. Please try again later.';
        break;
      case 'RATE_LIMIT_EXCEEDED':
        title = 'Too Many Attempts';
        message = 'Too many sign-in attempts. Please wait a few minutes before trying again.';
        break;
      default:
        message = error.response.data.error || message;
    }
  } else if (error.message) {
    // Handle client-side errors (e.g., from Google Auth)
    if (error.message.includes('Google Identity Services not loaded')) {
      title = 'Google Services Error';
      message = 'Google authentication services failed to load. Please refresh the page and try again.';
    } else if (error.message.includes('Google Client ID not configured')) {
      title = 'Configuration Error';
      message = 'Google authentication is not properly configured. Please contact the administrator.';
    } else if (error.message.includes('No credential received')) {
      title = 'Authentication Cancelled';
      message = 'Google sign-in was cancelled or failed. Please try again.';
    } else if (error.message.includes('popup_closed_by_user')) {
      title = 'Sign-In Cancelled';
      message = 'Google sign-in popup was closed. Please try again.';
    } else {
      message = error.message;
    }
  }

  showError(message, { title, duration: 8000 });
};

export { NotificationProvider as default };
