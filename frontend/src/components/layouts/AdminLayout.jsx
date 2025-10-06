import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MdDashboard,
  MdSettings,
  MdPeople,
  MdQueue,
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
  MdExpandLess,
  MdHistory,
  MdNewspaper,
  MdStar,
  MdBarChart
} from 'react-icons/md';
import { BiSolidNotepad } from 'react-icons/bi';

const AdminLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isQueueExpanded, setIsQueueExpanded] = useState(false);
  const dropdownRef = useRef(null);
  const mainContentRef = useRef(null);

  // Development mode detection - check if using URL-based role switching
  const isDevelopmentMode = user?.id === 'dev-bypass-user';

  // Windows data for queue navigation (should match Settings configuration)
  const windows = [
    { id: 1, name: 'Window 1', serviceName: 'Enrollment' },
    { id: 2, name: 'Window 2', serviceName: 'Transcript Request' },
    { id: 3, name: 'Window 3', serviceName: 'Certificate Request' }
  ];

  // Check if queue menu should be expanded based on current route
  const isQueueRouteActive = () => {
    return location.pathname.includes('/queue');
  };

  // Update queue expanded state based on current route
  useEffect(() => {
    if (isQueueRouteActive()) {
      setIsQueueExpanded(true);
    }
  }, [location.pathname]);

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

  // Detect if main content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (mainContentRef.current) {
        const { scrollHeight, clientHeight } = mainContentRef.current;
        setIsScrollable(scrollHeight > clientHeight);
      }
    };

    // Check on mount and when children change
    checkScrollable();

    // Check on window resize
    window.addEventListener('resize', checkScrollable);

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(checkScrollable);
    if (mainContentRef.current) {
      observer.observe(mainContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      window.removeEventListener('resize', checkScrollable);
      observer.disconnect();
    };
  }, [children]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
    setIsUserDropdownOpen(false);
  };

  // Determine effective role based on current URL path for development testing
  // This allows testing different role-based navigation while DEV_BYPASS_AUTH is enabled
  const getEffectiveRole = () => {
    const currentPath = location.pathname;

    // Map URL paths to roles for development testing
    if (currentPath.startsWith('/admin/registrar')) {
      return 'registrar_admin';
    } else if (currentPath.startsWith('/admin/admissions')) {
      return 'admissions_admin';
    } else if (currentPath.startsWith('/admin/hr')) {
      return 'hr_admin';
    } else if (currentPath.startsWith('/admin/mis')) {
      return 'super_admin';
    }

    // Default to user's actual role from auth context
    return user?.role || 'super_admin';
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const roleSpecificItems = {
      super_admin: [
        { name: 'Dashboard', path: '/admin/mis', icon: MdDashboard, end: true },
        { name: 'Users', path: '/admin/mis/users', icon: MdPeople },
        { name: 'Audit Trail', path: '/admin/mis/audit-trail', icon: MdHistory },
        { name: 'Bulletin', path: '/admin/mis/bulletin', icon: MdNewspaper },
        { name: 'Ratings', path: '/admin/mis/ratings', icon: MdStar }
      ],
      registrar_admin: [
        { name: 'Dashboard', path: '/admin/registrar', icon: MdDashboard, end: true },
        {
          name: 'Queue',
          icon: MdQueue,
          isExpandable: true,
          children: windows.map(window => ({
            name: window.name,
            path: `/admin/registrar/queue/window-${window.id}`,
            windowId: window.id
          }))
        },
        { name: 'Transaction Logs', path: '/admin/registrar/transaction-logs', icon: BiSolidNotepad },
        { name: 'Audit Trail', path: '/admin/registrar/audit-trail', icon: MdHistory },
        { name: 'Settings', path: '/admin/registrar/settings', icon: MdSettings }
      ],
      admissions_admin: [
        { name: 'Dashboard', path: '/admin/admissions', icon: MdDashboard, end: true },
        { name: 'Queue', path: '/admin/admissions/queue', icon: MdQueue },
        { name: 'Transaction Logs', path: '/admin/admissions/transaction-logs', icon: BiSolidNotepad },
        { name: 'Audit Trail', path: '/admin/admissions/audit-trail', icon: MdHistory },
        { name: 'Settings', path: '/admin/admissions/settings', icon: MdSettings }
      ],
      hr_admin: [
        { name: 'Charts', path: '/admin/hr/charts', icon: MdBarChart },
        { name: 'Audit Trail', path: '/admin/hr/audit-trail', icon: MdHistory }
      ]
    };

    // Use effective role (URL-based for dev testing, or actual user role)
    const effectiveRole = getEffectiveRole();
    const userRoleItems = roleSpecificItems[effectiveRole] || [];
    return userRoleItems;
  };

  const navigationItems = getNavigationItems();

  // Get display name based on effective role for development testing
  const getDisplayName = () => {
    const effectiveRole = getEffectiveRole();
    const roleNames = {
      super_admin: 'MIS Super Admin',
      registrar_admin: 'Registrar Admin',
      admissions_admin: 'Admissions Admin',
      hr_admin: 'HR Admin'
    };

    // In development mode with bypass, show role-based name
    // In production, use actual user name
    return user?.name || roleNames[effectiveRole] || 'Admin User';
  };

  // Icon components for header
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
    <div className="min-h-screen flex admin-layout" style={{ backgroundColor: '#efefef' }}>
      {/* Sidebar - fixed position, full height, no scrolling */}
      <div
        className={`fixed left-0 top-0 h-screen shadow-xl transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-72'} flex flex-col z-30 rounded-tr-3xl rounded-br-3xl`}
        style={{
          background: 'linear-gradient(to bottom, #161F55 0%, #161F55 70%, #3044BB 100%)',
          // Ensure smooth transitions by preventing layout shifts
          minWidth: isSidebarCollapsed ? '5rem' : '18rem'
        }}
      >
        {/* Logo Section - centered */}
        <div className="p-6 flex flex-col items-center">
          {/* Logo - actual logo image */}
          <img
            src="/logo.png"
            alt="LV Logo"
            className="w-16 h-16 flex-shrink-0 mb-3 object-contain"
          />
          {/* Title with fade animation - centered */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isSidebarCollapsed
                ? 'opacity-0 h-0 transform scale-y-0'
                : 'opacity-100 h-auto transform scale-y-100'
            }`}
          >
            <h1 className="text-lg font-bold text-white whitespace-nowrap text-center font-days-one">LVCampusConnect</h1>
          </div>
        </div>

        {/* Menu Label - left-aligned */}
        <div
          className={`px-6 mb-2 transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarCollapsed
              ? 'opacity-0 h-0 transform scale-y-0'
              : 'opacity-100 h-auto transform scale-y-100'
          }`}
        >
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Menu</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;

            // Handle expandable items (like Queue)
            if (item.isExpandable) {
              const isExpanded = isQueueExpanded;
              const isAnyChildActive = item.children?.some(child =>
                location.pathname === child.path
              );

              return (
                <div key={item.name} className="space-y-1">
                  {/* Parent item - expandable */}
                  <button
                    onClick={() => setIsQueueExpanded(!isQueueExpanded)}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-2xl transition-all duration-300 ease-in-out ${
                      isAnyChildActive || isExpanded
                        ? 'bg-white/40 text-white'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {/* Icon - always visible with fixed width */}
                    <IconComponent className="text-xl flex-shrink-0" />

                    {/* Text and chevron with fade and slide animation */}
                    <div
                      className={`flex items-center justify-between w-full transition-all duration-300 ease-in-out overflow-hidden ${
                        isSidebarCollapsed
                          ? 'opacity-0 w-0 transform translate-x-4'
                          : 'opacity-100 w-auto transform translate-x-0'
                      }`}
                    >
                      <span className="font-medium whitespace-nowrap text-white">{item.name}</span>
                      {!isSidebarCollapsed && (
                        <div className="ml-2">
                          {isExpanded ? (
                            <MdExpandLess className="text-lg" />
                          ) : (
                            <MdExpandMore className="text-lg" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Child items - windows */}
                  {isExpanded && !isSidebarCollapsed && (
                    <div className="ml-6 space-y-1">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-xl transition-all duration-300 ease-in-out ${
                              isActive
                                ? 'bg-white/50 text-white'
                                : 'text-white/80 hover:bg-white/20 hover:text-white'
                            }`
                          }
                        >
                          <span className="font-medium text-sm">{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Handle regular navigation items
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-2xl transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'bg-white/40 text-white'
                      : 'text-white hover:bg-white/10'
                  }`
                }
              >
                {/* Icon - always visible with fixed width */}
                <IconComponent className="text-xl flex-shrink-0" />

                {/* Text with fade and slide animation */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isSidebarCollapsed
                      ? 'opacity-0 w-0 transform translate-x-4'
                      : 'opacity-100 w-auto transform translate-x-0'
                  }`}
                >
                  <span className="font-medium whitespace-nowrap text-white">{item.name}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area - with left margin to account for fixed sidebar */}
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? '5rem' : '18rem' }}
      >
        {/* Header - fixed position at top of content area */}
        <header
          className={`fixed top-0 right-0 px-6 py-4 flex items-center justify-between z-20 transition-all duration-300 ease-in-out ${isScrollable ? 'shadow-sm' : ''}`}
          style={{
            left: isSidebarCollapsed ? '5rem' : '18rem',
            backgroundColor: '#efefef'
          }}
        >
          {/* Left side: Sidebar Toggle Button and Dev Mode Indicator */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center text-white"
              style={{ backgroundColor: '#161F55' }}
            >
              {isSidebarCollapsed ? (
                <MdChevronRight className="text-xl" />
              ) : (
                <MdChevronLeft className="text-xl" />
              )}
            </button>

            {/* Development Mode Indicator */}
            {isDevelopmentMode && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded-lg">
                <span className="text-xs font-semibold text-yellow-800">DEV MODE</span>
                <span className="text-xs text-yellow-700">• URL-based role switching enabled</span>
              </div>
            )}
          </div>

          {/* Right side: User Profile with navy blue background */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: '#1F3463' }}
            >
              <UserIcon />
              <span className="font-medium">{getDisplayName()}</span>
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

        {/* Page Content - scrollable area with top padding for fixed header */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto pt-20 p-6"
          style={{ backgroundColor: '#efefef' }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-4"
          style={{ backgroundColor: '#efefef' }}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 LVCampusConnect LVCC - Developed by BSIS4 Group 6
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
