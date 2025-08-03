import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegistrarSidebar = ({ selectedWindow, onWindowSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const windows = [
    {
      id: 'window1',
      name: 'Window 1',
      icon: '🪟',
      services: ['Transcript Request', 'Certificate of Enrollment'],
      color: '#3b82f6'
    },
    {
      id: 'window2', 
      name: 'Window 2',
      icon: '🪟',
      services: ['Diploma Verification', 'Grade Inquiry'],
      color: '#10b981'
    },
    {
      id: 'window3',
      name: 'Window 3', 
      icon: '🪟',
      services: ['Student Records Update'],
      color: '#f59e0b'
    }
  ];

  const handleWindowSelect = (windowId) => {
    onWindowSelect(windowId);
    navigate(`/admin/registrar/${windowId}`);
  };

  const isWindowActive = (windowId) => {
    return selectedWindow === windowId || location.pathname.includes(windowId);
  };

  return (
    <>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📋</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Registrar's Office</h2>
              <p className="text-sm text-gray-500">Queue Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Window Management Section */}
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Window Management
            </h3>
            <div className="space-y-1">
              {windows.map((window) => (
                <button
                  key={window.id}
                  onClick={() => handleWindowSelect(window.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isWindowActive(window.id)
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span style={{ color: window.color }}>{window.icon}</span>
                    <span className="font-medium">{window.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-6">
                    {window.services.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Overview
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/admin/registrar')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  location.pathname === '/admin/registrar'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>📊</span>
                <span>All Windows Overview</span>
              </button>

              <button
                onClick={() => navigate('/display/registrar')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <span>📺</span>
                <span>Public Display</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Registrar Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="mr-2">🔓</span>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default RegistrarSidebar;
