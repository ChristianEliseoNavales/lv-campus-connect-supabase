import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const QueueRedirect = () => {
  const [redirectPath, setRedirectPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstWindow = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/windows/registrar');
        if (response.ok) {
          const windows = await response.json();
          if (windows.length > 0) {
            // Redirect to the first available window
            setRedirectPath(`/admin/registrar/queue/${windows[0].id}`);
          } else {
            // No windows available, redirect to settings to create one
            setRedirectPath('/admin/registrar/settings');
          }
        } else {
          // API error, redirect to dashboard
          setRedirectPath('/admin/registrar');
        }
      } catch (error) {
        console.error('Error fetching windows:', error);
        // Network error, redirect to dashboard
        setRedirectPath('/admin/registrar');
      } finally {
        setLoading(false);
      }
    };

    fetchFirstWindow();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3463] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading queue...</p>
        </div>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback redirect
  return <Navigate to="/admin/registrar" replace />;
};

export default QueueRedirect;
