import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const KioskLayout = ({ children, hideHeader = false, customFooter = null }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDayOfWeek = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDayOfMonth = (date) => {
    return date.getDate().toString();
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Icon components with proper SVG icons
  const HomeIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  const AnnouncementIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );

  const MapIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  const DirectoryIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
    </svg>
  );

  const QueueIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );

  const FaqIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );

  const HelpIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div
      className="flex flex-col w-screen h-screen overflow-hidden kiosk-container bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/main-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header - Conditionally rendered */}
      {!hideHeader && (
        <header className="bg-white bg-opacity-50 text-white flex justify-between items-start" style={{ height: '90px' }}>
          {/* Left side: Logo and title container with bottom-right border-radius - flush to top */}
          <div className="bg-blue-900 px-6 pt-4 pb-4 rounded-br-lg flex items-center h-full">
            {/* University Logo Placeholder */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 m">
              <span className="text-blue-900 font-bold text-lg">LV</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wide">LVCampusConnect</h1>
          </div>

          {/* Right side: Date and time container with full border-radius */}
          <div className="bg-blue-900 text-white px-1 py-1 pr-2 rounded-lg shadow-md mr-6 mt-4 flex items-center space-x-4">
            {/* Time Display - Left side with border */}
            <div className="bg-white text-blue-900 border-2 border-blue-900 rounded-lg px-3 py-4">
              <p className="text-xl font-bold">{formatTime(time)}</p>
            </div>

            {/* Date Display - Right side with multi-line layout */}
            <div className="text-center text-white">
              <p className="text-sm font-medium">{formatDayOfWeek(time)}</p>
              <p className="text-1xl font-bold leading-tight">{formatDayOfMonth(time)}</p>
              <p className="text-sm font-medium">{formatMonth(time)}</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - Full width utilization for 16:9 landscape */}
      <main className="flex-grow px-6 py-6 overflow-auto w-full bg-white bg-opacity-50">
        {children}
      </main>

      {/* Bottom Navigation - White background with proper color scheme */}
      <footer className="bg-white bg-opacity-50 px-6 pb-3 w-full">
        {customFooter ? (
          customFooter
        ) : (
          <nav className="bg-transparent flex justify-center items-center space-x-6 w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <HomeIcon />
            <span className="mt-2 font-semibold text-sm">HOME</span>
          </NavLink>

          <NavLink
            to="/announcement"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <AnnouncementIcon />
            <span className="mt-1 font-semibold text-xs text-center leading-tight">ANNOUNCEMENT</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <SearchIcon />
            <span className="mt-2 font-semibold text-sm">SEARCH</span>
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <MapIcon />
            <span className="mt-2 font-semibold text-sm">MAP</span>
          </NavLink>

          <NavLink
            to="/directory"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <DirectoryIcon />
            <span className="mt-2 font-semibold text-sm">DIRECTORY</span>
          </NavLink>

          <NavLink
            to="/queue"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <QueueIcon />
            <span className="mt-2 font-semibold text-sm">QUEUE</span>
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
              }`
            }
          >
            <FaqIcon />
            <span className="mt-2 font-semibold text-sm">FAQs</span>
          </NavLink>

          {/* Help Button with Dialogue Bubble Tooltip */}
          <div className="relative">
            {/* Dialogue Bubble Tooltip - Compact version */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="relative bg-white bg-opacity-65 text-black px-2 py-2 rounded-md shadow-md whitespace-nowrap animate-pulse">
                <span className="text-xs font-medium">Need help? Touch here.</span>
                {/* Speech bubble pointer/tail pointing downward - positioned outside container */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-20 mt-1">
                  <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white relative z-10"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white z-20"></div>
                </div>
              </div>
            </div>

            <NavLink
              to="/help"
              className={({ isActive }) =>
                `w-16 h-16 flex items-center justify-center border-2 border-white rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                    : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
                }`
              }
              title="Help & Support"
            >
              <HelpIcon />
            </NavLink>
          </div>
        </nav>
        )}
      </footer>
    </div>
  );
};

export default KioskLayout;

// HMR compatibility check
if (import.meta.hot) {
  import.meta.hot.accept();
}