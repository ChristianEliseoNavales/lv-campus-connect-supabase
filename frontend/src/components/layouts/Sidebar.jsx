import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasRole, hasAnyRole } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close mobile sidebar after navigation
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [];

    if (hasRole('super_admin')) {
      // MIS Super Admin Navigation
      items.push(
        {
          section: 'User Management',
          items: [
            {
              name: 'User Management',
              path: '/admin/mis',
              icon: '👥',
              description: 'Manage user accounts and permissions'
            }
          ]
        },
        {
          section: 'System Settings',
          items: [
            {
              name: 'System Settings',
              path: '/admin/mis/settings',
              icon: '⚙️',
              description: 'Configure system settings'
            }
          ]
        },
        {
          section: 'Registrar Management',
          items: [
            {
              name: 'Queue Management',
              path: '/admin/registrar',
              icon: '📋',
              description: 'Manage Registrar queue'
            },

          ]
        },
        {
          section: 'Admissions Management',
          items: [
            {
              name: 'Queue Management',
              path: '/admin/admissions',
              icon: '🎓',
              description: 'Manage Admissions queue'
            },
            {
              name: 'Queue Display',
              path: '/display/admissions',
              icon: '📺',
              description: 'View Admissions queue display'
            }
          ]
        }
      );
    } else if (hasRole('registrar_admin')) {
      // Registrar Admin Navigation
      items.push({
        section: 'Queue Management',
        items: [
          {
            name: 'Window 1 Queue',
            path: '/admin/registrar/window1',
            icon: '📋',
            description: 'Transcript Request, Certificate of Enrollment'
          },
          {
            name: 'Window 2 Queue',
            path: '/admin/registrar/window2',
            icon: '📋',
            description: 'Diploma Verification, Grade Inquiry'
          },
          {
            name: 'Window 3 Queue',
            path: '/admin/registrar/window3',
            icon: '📋',
            description: 'Student Records Update'
          }
        ]
      }, {
        section: 'Display & Overview',
        items: [
          {
            name: 'All Windows Overview',
            path: '/admin/registrar',
            icon: '📊',
            description: 'View all registrar windows'
          },

        ]
      });
    } else if (hasRole('admissions_admin')) {
      // Admissions Admin Navigation
      items.push({
        section: 'Admissions Office',
        items: [
          {
            name: 'Queue Management',
            path: '/admin/admissions',
            icon: '🎓',
            description: 'Manage queue and serve students'
          },

        ]
      });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏛️</div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                University Queue
              </h2>
              <p className="text-xs text-blue-100">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-blue-100 hover:text-white hover:bg-blue-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user?.picture ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.picture}
                  alt={user.name}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">
                {user?.role === 'super_admin' ? 'MIS Super Admin' :
                 user?.role === 'registrar_admin' ? 'Registrar Admin' :
                 user?.role === 'admissions_admin' ? 'Admissions Admin' :
                 user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center">
            University Queue System
            <br />
            Admin Interface
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
