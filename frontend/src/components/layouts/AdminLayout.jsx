import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
    setIsUserDropdownOpen(false);
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        path: '/admin',
        icon: '📊',
        roles: ['super_admin', 'registrar_admin', 'admissions_admin']
      }
    ];

    const roleSpecificItems = {
      super_admin: [
        { name: 'MIS Dashboard', path: '/admin/mis', icon: '⚙️' },
        { name: 'User Management', path: '/admin/mis/users', icon: '👥' },
        { name: 'System Settings', path: '/admin/mis/settings', icon: '🔧' },
        { name: 'Registrar Module', path: '/admin/registrar', icon: '📋' },
        { name: 'Admissions Module', path: '/admin/admissions', icon: '🎓' },
        { name: 'Reports', path: '/admin/reports', icon: '📈' }
      ],
      registrar_admin: [
        { name: 'Queue Management', path: '/admin/registrar/queue', icon: '📋' },
        { name: 'Window Controls', path: '/admin/registrar/windows', icon: '🪟' },
        { name: 'Services', path: '/admin/registrar/services', icon: '📝' },
        { name: 'Reports', path: '/admin/registrar/reports', icon: '📊' }
      ],
      admissions_admin: [
        { name: 'Queue Management', path: '/admin/admissions/queue', icon: '🎓' },
        { name: 'Applications', path: '/admin/admissions/applications', icon: '📄' },
        { name: 'Services', path: '/admin/admissions/services', icon: '📝' },
        { name: 'Reports', path: '/admin/admissions/reports', icon: '📊' }
      ]
    };

    const userRoleItems = roleSpecificItems[user?.role] || [];
    return [...baseItems, ...userRoleItems];
  };

  const navigationItems = getNavigationItems();

  // Icon components
  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - positioned above header in z-index */}
      <div
        className={`shadow-lg transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col relative z-20 overflow-hidden`}
        style={{
          backgroundColor: '#1e3a8a',
          // Ensure smooth transitions by preventing layout shifts
          minWidth: isSidebarCollapsed ? '4rem' : '16rem'
        }}
      >
        {/* Logo and Title Section */}
        <div className="p-4 border-b" style={{ borderBottomColor: '#1e40af' }}>
          <div className="flex items-center space-x-3">
            {/* Logo - prevent squishing with fixed dimensions */}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-900 font-bold text-sm">LV</span>
            </div>
            {/* Title with fade animation */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isSidebarCollapsed
                  ? 'opacity-0 w-0 transform scale-x-0'
                  : 'opacity-100 w-auto transform scale-x-100'
              }`}
            >
              <h1 className="text-lg font-bold text-white whitespace-nowrap">LVCampusConnect</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-blue-50 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {/* Icon - always visible with fixed width */}
              <span className="text-lg flex-shrink-0 w-6 text-center">{item.icon}</span>

              {/* Text with fade and slide animation */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isSidebarCollapsed
                    ? 'opacity-0 w-0 transform translate-x-4'
                    : 'opacity-100 w-auto transform translate-x-0'
                }`}
              >
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - simplified without logo */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between relative z-10">
          {/* Left side: Hamburger only */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <MenuIcon />
            </button>
          </div>

          {/* Right side: User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <UserIcon />
              <span className="font-medium">{user?.name}</span>
              <ChevronDownIcon />
            </button>

            {/* User Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogoutIcon />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2024 University Queue System - Developed by BSIS4 Team
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
