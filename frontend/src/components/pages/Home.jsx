import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState({
    registrar: { currentNumber: 0, nextNumber: 0, queue: [] },
    admissions: { currentNumber: 0, nextNumber: 0, queue: [] }
  });
  const [loading, setLoading] = useState(true);

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
      <div className="h-full flex flex-col">
        {/* Office Name Header - Added rounded corners to all four corners */}
        <div className="bg-[#1F3463] text-white text-center py-4 rounded-lg">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        {/* NOW SERVING Section */}
        <div className="text-center py-4">
          <p className="text-lg font-bold" style={{ color: '#1F3463' }}>NOW SERVING</p>
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
            {/* Grid Layout: 4 rows with separate containers for window and queue numbers */}
            <div className="flex flex-col gap-2 h-full">
              {/* Row 1 */}
              <div className="flex-1 flex gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-800">1</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold" style={{ color: '#1F3463' }}>
                    {loading ? '--' : String(data.currentNumber).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex-1 flex gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-800">2</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-600">
                    {loading ? '--' : String(data.nextNumber).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex-1 flex gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-800">3</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-400">--</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex-1 flex gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-800">Priority</span>
                </div>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg flex-1">
                  <span className="text-lg font-bold text-gray-400">--</span>
                </div>
              </div>
            </div>
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
          <div className="flex-1 bg-[#FFE251] rounded-2xl shadow-xl drop-shadow-lg hover:shadow-2xl hover:drop-shadow-xl transition-all duration-200 p-6 cursor-pointer relative overflow-hidden">
            {/* Button text positioned at top-left */}
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl font-bold text-[#1F3463] leading-tight">FIND OFFICE LOCATIONS</h3>
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
          <div className="flex-1 bg-[#FFE251] rounded-2xl shadow-xl drop-shadow-lg hover:shadow-2xl hover:drop-shadow-xl transition-all duration-200 p-6 cursor-pointer relative overflow-hidden">
            {/* Button text positioned at top-left */}
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl font-bold text-[#1F3463] leading-tight">GET A QUEUE NUMBER</h3>
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
