import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Home = () => {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState({
    registrar: { currentNumber: 0, nextNumber: 0, queue: [], windows: [] },
    admissions: { currentNumber: 0, nextNumber: 0, queue: [], windows: [] }
  });
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState({
    registrar: false,
    admissions: false
  });
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join kiosk room for real-time updates
    newSocket.emit('join-room', 'kiosk');

    // Listen for real-time updates
    newSocket.on('windows-updated', (data) => {
      if (data.department === 'registrar' || data.department === 'admissions') {
        fetchQueueData(data.department);
      }
    });

    newSocket.on('queue-updated', (data) => {
      if (data.department === 'registrar' || data.department === 'admissions') {
        fetchQueueData(data.department);
      }
    });

    newSocket.on('settings-updated', (data) => {
      if (data.department === 'registrar' || data.department === 'admissions') {
        fetchQueueData(data.department);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch queue data from API
  const fetchQueueData = async (specificDepartment = null) => {
    const departments = specificDepartment ? [specificDepartment] : ['registrar', 'admissions'];

    try {
      for (const department of departments) {
        // Show section loading for specific department updates
        if (specificDepartment) {
          setSectionLoading(prev => ({ ...prev, [department]: true }));
        }

        const response = await fetch(`http://localhost:5000/api/public/queue/${department}`);
        const data = await response.json();

        // Ensure windows is always an array
        const windows = Array.isArray(data.windows) ? data.windows : [];

        console.log(`${department} queue data:`, {
          windowsCount: windows.length,
          windows: windows,
          isEnabled: data.isEnabled
        });

        setQueueData(prev => ({
          ...prev,
          [department]: {
            currentNumber: data.currentNumber || 0,
            nextNumber: data.nextNumber || 0,
            queue: data.queue || [],
            windows: windows,
            isEnabled: data.isEnabled
          }
        }));

        // Hide section loading after a brief delay for smooth transition
        if (specificDepartment) {
          setTimeout(() => {
            setSectionLoading(prev => ({ ...prev, [department]: false }));
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error fetching queue data:', error);
      // Use fallback data if API is not available
      if (!specificDepartment) {
        setQueueData({
          registrar: { currentNumber: 5, nextNumber: 6, queue: [], windows: [], isEnabled: true },
          admissions: { currentNumber: 3, nextNumber: 4, queue: [], windows: [], isEnabled: true }
        });
      }
    } finally {
      if (!specificDepartment) {
        setLoading(false);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchQueueData();
    // Refresh queue data every 30 seconds
    const interval = setInterval(() => fetchQueueData(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Update digital clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Skeleton Loading Component - Fixed 4-row layout
  const QueueSkeleton = () => (
    <div className="animate-pulse">
      {/* Window Grid Skeleton - Always 4 rows */}
      <div className="grid grid-cols-2 gap-2 h-full">
        {[...Array(4)].map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Window Name Skeleton */}
            <div className="bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
              <div className="bg-gray-300 h-6 w-20 rounded"></div>
            </div>
            {/* Queue Number Skeleton */}
            <div className="bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
              <div className="bg-gray-300 h-8 w-12 rounded"></div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Enhanced Queue Display Component
  const EnhancedQueueDisplay = ({ department, title }) => {
    const data = queueData[department];

    return (
      <div className="h-full flex flex-col">
        {/* Office Name Header - Added rounded corners to all four corners */}
        <div className="bg-[#1F3463] text-white text-center py-4 rounded-lg">
          <h3 className="text-3xl font-bold">{title}</h3>
        </div>

        {/* NOW SERVING Section */}
        <div className="text-center py-4">
          <p className="text-2xl font-bold" style={{ color: '#1F3463' }}>NOW SERVING</p>
        </div>

        {/* Labels positioned OUTSIDE and ABOVE the grid - Updated for 50/50 split */}
        <div className="mx-4 mb-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <span className="font-semibold text-gray-700 text-sm">WINDOW</span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-gray-700 text-sm">QUEUE NO.</span>
            </div>
          </div>
        </div>

        {/* Queue Grid Container */}
        <div className="flex-grow mx-4 mb-4">
          <div className="h-full p-2">
            {/* Show skeleton loading when section is updating */}
            {sectionLoading[department] ? (
              <QueueSkeleton />
            ) : data?.isEnabled === false ? (
              /* Office Closed Message */
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-600 mb-2">Office Closed</p>
                  <p className="text-sm text-gray-500">Please try again later</p>
                </div>
              </div>
            ) : (
              /* Fixed 4-Row Grid Layout - Always shows exactly 4 rows */
              <div className="grid grid-cols-2 gap-2 h-full">
                {[...Array(4)].map((_, rowIndex) => {
                  const window = data?.windows?.[rowIndex];
                  const isRealWindow = window && window.name;
                  const isWindowOpen = window?.isOpen !== false; // Default to true if not specified

                  return (
                    <React.Fragment key={rowIndex}>
                      {/* Window Name */}
                      <div className={`flex items-center justify-center rounded-lg border ${
                        isRealWindow && isWindowOpen
                          ? 'bg-white border-gray-400'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <span className={`text-lg font-bold ${
                          isRealWindow && isWindowOpen
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}>
                          {isRealWindow ? window.name : '--'}
                        </span>
                      </div>
                      {/* Queue Number */}
                      <div className={`flex items-center justify-center rounded-lg border ${
                        isRealWindow && isWindowOpen
                          ? 'bg-white border-gray-400'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <span className="text-xl font-bold" style={{
                          color: isRealWindow && isWindowOpen ? '#1F3463' : '#9CA3AF'
                        }}>
                          {loading ? '--' :
                           isRealWindow && isWindowOpen ?
                           String(window.currentQueueNumber || 0).padStart(2, '0') :
                           '--'}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="h-full flex flex-col">

      {/* 3-Column Grid Layout */}
      <div className="flex-grow grid grid-cols-3 gap-0 h-full">
        {/* Columns 1-2 Combined (Registrar's and Admissions Office) - Single parent container */}
        <div className="col-span-2 px-4">
          {/* White background container wrapping both office sections */}
          <div className="h-full bg-white rounded-lg shadow-xl drop-shadow-lg p-6">
            {/* Grid container for both office sections */}
            <div className="h-full grid grid-cols-2 gap-6">
              {/* Column 1 - Registrar's Office */}
              <div className="h-full">
                <EnhancedQueueDisplay
                  department="registrar"
                  title="Registrar's Office"
                />
              </div>

              {/* Column 2 - Admissions Office */}
              <div className="h-full">
                <EnhancedQueueDisplay
                  department="admissions"
                  title="Admissions Office"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 - New Queue/Directory Section */}
        <div className="col-span-1 flex flex-col gap-6 pl-6">
          {/* Row 1 - FIND OFFICE LOCATIONS */}
          <div
            className="flex-1 bg-[#FFE251] rounded-2xl shadow-xl drop-shadow-lg active:shadow-lg active:scale-95 transition-all duration-150 p-6 cursor-pointer relative overflow-hidden"
            onClick={() => navigate('/map')}
          >
            {/* Button text positioned at top-left */}
            <div className="absolute top-6 left-6">
              <h3 className="text-3xl font-bold text-[#1F3463] leading-tight" style={{ textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)' }}>FIND OFFICE LOCATIONS</h3>
            </div>

            {/* Decorative images */}
            <img
              src="/home/1a.png"
              alt=""
              className="absolute bottom-6 left-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="/home/2a.png"
              alt=""
              className="absolute bottom-6 right-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="/home/3a.png"
              alt=""
              className="absolute top-6 right-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Row 2 - GET A QUEUE NUMBER */}
          <div
            className="flex-1 bg-[#FFE251] rounded-2xl shadow-xl drop-shadow-lg active:shadow-lg active:scale-95 transition-all duration-150 p-6 cursor-pointer relative overflow-hidden"
            onClick={() => navigate('/queue')}
          >
            {/* Button text positioned at top-left */}
            <div className="absolute top-6 left-6">
              <h3 className="text-3xl font-bold text-[#1F3463] leading-tight" style={{ textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)' }}>GET A QUEUE NUMBER</h3>
            </div>

            {/* Decorative images */}
            <img
              src="/home/1b.png"
              alt=""
              className="absolute bottom-6 left-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="/home/2b.png"
              alt=""
              className="absolute bottom-6 right-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="/home/3b.png"
              alt=""
              className="absolute top-6 right-6 w-auto h-auto max-w-24 max-h-24"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
