import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Menu button and title */}
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="ml-4 lg:ml-0">
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                  )}
                </div>
              </div>

              {/* Right side - User info and actions */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex sm:items-center sm:space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome, {user?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user?.role === 'super_admin' ? 'MIS Super Admin' :
                       user?.role === 'registrar_admin' ? 'Registrar Admin' :
                       user?.role === 'admissions_admin' ? 'Admissions Admin' :
                       user?.role}
                    </p>
                  </div>

                  {user?.picture && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.picture}
                      alt={user.name}
                    />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
