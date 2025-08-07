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

  // Queue Display Component
  const QueueDisplay = ({ department, title, icon }) => {
    const data = queueData[department];

    return (
      <div className="h-full bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-900 flex flex-col">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">{icon}</div>
          <h3 className="text-xl font-bold text-blue-900 mb-4">{title}</h3>
        </div>

        <div className="flex-grow grid grid-cols-2 gap-4">
          {/* Now Serving */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700 mb-1">NOW SERVING</p>
              <p className="text-4xl font-bold text-blue-900">
                {loading ? '--' : String(data.currentNumber).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Next */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">NEXT</p>
              <p className="text-2xl font-semibold text-gray-800">
                {loading ? '--' : String(data.nextNumber).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">

      {/* 5-Column, 2-Row Grid Layout */}
      <div className="flex-grow grid grid-cols-5 grid-rows-2 gap-6 h-full">
        {/* Row 1, Columns 1-2: Registrar Queue Display */}
        <div className="col-span-2 row-span-1">
          <QueueDisplay
            department="registrar"
            title="Registrar's Office"
            icon="📋"
          />
        </div>

        {/* Row 1, Column 3: Map Button */}
        <div className="col-span-1 row-span-1">
          <button
            onClick={() => navigate('/map')}
            className="w-full h-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-green-300 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800">Map</h3>
            </div>
          </button>
        </div>

        {/* Row 1-2, Columns 4-5: Announcement Button */}
        <div className="col-span-2 row-span-2">
          <button
            onClick={() => navigate('/announcement')}
            className="w-full h-full bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-6xl mb-6">📢</div>
              <h3 className="text-3xl font-bold text-gray-800">Announcements</h3>
              <p className="text-lg text-gray-600 mt-4">Latest university news and updates</p>
            </div>
          </button>
        </div>

        {/* Row 2, Columns 1-2: Admissions Queue Display */}
        <div className="col-span-2 row-span-1">
          <QueueDisplay
            department="admissions"
            title="Admissions Office"
            icon="🎓"
          />
        </div>

        {/* Row 2, Column 3: Directory Button */}
        <div className="col-span-1 row-span-1">
          <button
            onClick={() => navigate('/directory')}
            className="w-full h-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-gray-800">Directory</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
