import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState({
    registrar: { currentNumber: 0, nextNumber: 0, queue: [] },
    admissions: { currentNumber: 0, nextNumber: 0, queue: [] }
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch queue data from API
  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const [registrarResponse, admissionsResponse] = await Promise.all([
          fetch('http://localhost:3001/api/public/queue/registrar'),
          fetch('http://localhost:3001/api/public/queue/admissions')
        ]);

        const registrarData = await registrarResponse.json();
        const admissionsData = await admissionsResponse.json();

        setQueueData({
          registrar: {
            currentNumber: registrarData.currentNumber || 0,
            nextNumber: registrarData.queue?.[0]?.queueNumber || 0,
            queue: registrarData.queue || []
          },
          admissions: {
            currentNumber: admissionsData.currentNumber || 0,
            nextNumber: admissionsData.queue?.[0]?.queueNumber || 0,
            queue: admissionsData.queue || []
          }
        });
      } catch (error) {
        console.error('Error fetching queue data:', error);
        // Use fallback data if API is not available
        setQueueData({
          registrar: { currentNumber: 5, nextNumber: 6, queue: [] },
          admissions: { currentNumber: 3, nextNumber: 4, queue: [] }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();
    // Refresh queue data every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update digital clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Enhanced Queue Display Component
  const EnhancedQueueDisplay = ({ department, title }) => {
    const data = queueData[department];

    return (
      <div className="h-full bg-white rounded-lg shadow-lg flex flex-col">
        {/* Office Name Header */}
        <div className="bg-[#1F3463] text-white text-center py-4 rounded-t-lg">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        {/* NOW SERVING Section */}
        <div className="text-center py-4">
          <p className="text-lg font-bold" style={{ color: '#1F3463' }}>NOW SERVING</p>
        </div>

        {/* Labels positioned OUTSIDE and ABOVE the grid */}
        <div className="mx-4 mb-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <span className="font-semibold text-gray-700 text-sm">WINDOW</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="font-semibold text-gray-700 text-sm">QUEUE NO.</span>
            </div>
          </div>
        </div>

        {/* Queue Grid Container */}
        <div className="flex-grow mx-4 mb-4">
          <div className="h-full bg-white p-2">
            {/* Grid Layout: 4 rows with unified row borders */}
            <div className="flex flex-col gap-2 h-full">
              {/* Row 1 */}
              <div className="flex-1 border border-gray-300 rounded flex">
                <div className="flex items-center justify-center bg-white rounded-l flex-1">
                  <span className="text-lg font-bold text-gray-800">1</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-r flex-[2]">
                  <span className="text-lg font-bold" style={{ color: '#1F3463' }}>
                    {loading ? '--' : String(data.currentNumber).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex-1 border border-gray-300 rounded flex">
                <div className="flex items-center justify-center bg-white rounded-l flex-1">
                  <span className="text-lg font-bold text-gray-800">2</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-r flex-[2]">
                  <span className="text-lg font-bold text-gray-600">
                    {loading ? '--' : String(data.nextNumber).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex-1 border border-gray-300 rounded flex">
                <div className="flex items-center justify-center bg-white rounded-l flex-1">
                  <span className="text-lg font-bold text-gray-800">3</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-r flex-[2]">
                  <span className="text-lg font-bold text-gray-400">--</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex-1 border border-gray-300 rounded flex">
                <div className="flex items-center justify-center bg-white rounded-l flex-1">
                  <span className="text-lg font-bold text-gray-800">Priority</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-r flex-[2]">
                  <span className="text-lg font-bold text-gray-400">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Digital Clock Component
  const DigitalClock = () => {
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const formatDay = (date) => {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      return { day, month };
    };

    const time = formatTime(currentTime);
    const dayName = formatDay(currentTime);
    const { day, month } = formatDate(currentTime);

    return (
      <div className="w-full h-full bg-[#1F3463] rounded-lg shadow-lg p-4 flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="text-2xl text-black font-bold mb-2 bg-white rounded-xl p-2 px-20">{time}</div>
          <div className="text-sm font-medium mb-1">{dayName}</div>
          <div className="text-3xl font-bold">{day}</div>
          <div className="text-sm font-medium">{month}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">

      {/* 4-Column, 3-Row Grid Layout */}
      <div className="flex-grow grid grid-cols-[1fr_1fr_1fr_0.5fr] grid-rows-3 gap-6 h-full">
        {/* Column 1 (Left sidebar) - Row 1: MAP */}
        <div className="col-span-1 row-span-1 col-start-1 row-start-1">
          <button
            onClick={() => navigate('/map')}
            className="w-full h-full bg-[#1F3463] rounded-lg shadow-lg p-4 flex items-center justify-center hover:bg-[#2a4a7a] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">MAP</h3>
            </div>
          </button>
        </div>

        {/* Column 2 (Main content area 1) - Registrar's Office - Spans all 3 rows */}
        <div className="col-span-1 row-span-3 col-start-2 row-start-1">
          <EnhancedQueueDisplay
            department="registrar"
            title="Registrar's Office"
          />
        </div>

        {/* Column 3 (Main content area 2) - Admissions Office - Spans all 3 rows */}
        <div className="col-span-1 row-span-3 col-start-3 row-start-1">
          <EnhancedQueueDisplay
            department="admissions"
            title="Admissions Office"
          />
        </div>

        {/* Column 4 (Right sidebar) - Digital Clock - Row 1 only */}
        <div className="col-span-1 row-span-1 col-start-4 row-start-1">
          <DigitalClock />
        </div>

        {/* Column 1 (Left sidebar) - Row 2: DIRECTORY */}
        <div className="col-span-1 row-span-1 col-start-1 row-start-2">
          <button
            onClick={() => navigate('/directory')}
            className="w-full h-full bg-[#1F3463] rounded-lg shadow-lg p-4 flex items-center justify-center hover:bg-[#2a4a7a] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">DIRECTORY</h3>
            </div>
          </button>
        </div>

        {/* Column 1 (Left sidebar) - Row 3: HIGHLIGHTS */}
        <div className="col-span-1 row-span-1 col-start-1 row-start-3">
          <button
            onClick={() => navigate('/highlights')}
            className="w-full h-full bg-[#1F3463] rounded-lg shadow-lg p-4 flex items-center justify-center hover:bg-[#2a4a7a] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">HIGHLIGHTS</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
