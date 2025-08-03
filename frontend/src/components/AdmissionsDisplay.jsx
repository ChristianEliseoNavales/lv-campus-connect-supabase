import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const AdmissionsDisplay = () => {
  const [queueData, setQueueData] = useState({
    queue: [],
    currentNumber: 0,
    serving: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const departmentInfo = {
    name: 'Admissions Office',
    color: '#dc2626',
    icon: '🎓',
    description: 'Application processing, entrance exams, and admission inquiries'
  };

  useEffect(() => {
    initializeSocket();
    fetchQueueData();

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (socket) {
        socket.disconnect();
      }
      clearInterval(timeInterval);
    };
  }, []);

  const initializeSocket = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server for Admissions Display');
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === 'admissions') {
        setQueueData({
          queue: data.queue,
          currentNumber: data.currentNumbers[data.department],
          serving: data.serving
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);
  };

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await axios.get(`${API_URL}/api/public/queue/admissions`);

      setQueueData({
        queue: response.data.queue,
        currentNumber: response.data.currentNumber,
        serving: response.data.serving
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load queue data. Please try again.');
      console.error('Error fetching admissions queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWaitingCount = () => {
    return queueData.queue.filter(item => item.status === 'waiting').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-red-800/20 p-16 rounded-3xl backdrop-blur-md border-4 border-red-600">
          <div className="w-24 h-24 border-8 border-white border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-5xl font-black">Loading Admissions Queue...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-red-800/20 p-16 rounded-3xl backdrop-blur-md border-4 border-red-600">
          <h2 className="text-5xl font-black mb-8">Unable to load queue information</h2>
          <p className="text-3xl mb-12">{error}</p>
          <button
            onClick={fetchQueueData}
            className="bg-red-600 text-white border-none py-6 px-12 rounded-2xl text-2xl font-bold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      {/* Header - Optimized for Large Room Visibility */}
      <div className="flex justify-between items-center p-12 bg-red-800 shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="text-8xl">{departmentInfo.icon}</div>
          <div>
            <h1 className="text-7xl font-black mb-4 text-white drop-shadow-lg">
              {departmentInfo.name}
            </h1>
          </div>
        </div>

        <div className="text-right">
          <div className="text-5xl font-black mb-2 text-white drop-shadow-lg">{formatTime(currentTime)}</div>
          <div className="text-2xl text-red-100">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Main Content - Optimized for Large Room Visibility */}
      <div className="p-12">
        <div className="max-w-6xl mx-auto">
          {/* Now Serving Section - Primary Focus */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-16 border-4 border-red-600">
            <div
              className="text-white p-16 text-center"
              style={{ backgroundColor: departmentInfo.color }}
            >
              <h2 className="text-6xl font-black mb-8 drop-shadow-lg">NOW SERVING</h2>
              {queueData.serving ? (
                <div className="bg-white/20 rounded-full w-48 h-48 flex items-center justify-center mx-auto backdrop-blur-sm border-8 border-white shadow-2xl">
                  <span className="text-8xl font-black">{queueData.serving.queueNumber}</span>
                </div>
              ) : (
                <div className="bg-white/20 rounded-2xl py-12 px-16 backdrop-blur-sm border-4 border-white">
                  <span className="text-5xl font-black">NONE</span>
                </div>
              )}
            </div>
          </div>

          {/* Next in Line Section */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 border-4 border-red-600">
            <h3 className="text-5xl font-black text-center text-white mb-12 drop-shadow-lg">NEXT IN LINE</h3>
            <div className="flex flex-wrap gap-8 justify-center">
              {queueData.queue
                .filter(item => item.status === 'waiting')
                .slice(0, 8)
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl relative transition-all duration-300 border-4 ${
                      index === 0
                        ? 'text-white shadow-2xl ring-4 ring-yellow-400 animate-pulse border-yellow-400'
                        : 'bg-gray-600 text-white border-gray-400'
                    }`}
                    style={index === 0 ? { backgroundColor: departmentInfo.color } : {}}
                  >
                    {item.queueNumber}
                    {index === 0 && (
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xl rounded-full w-10 h-10 flex items-center justify-center font-black">
                        ▶
                      </div>
                    )}
                  </div>
                ))
              }
              {getWaitingCount() === 0 && (
                <div className="text-gray-400 italic text-3xl font-bold">No one waiting</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Footer */}
      <div className="bg-red-800 p-12 mt-16 shadow-2xl">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-3xl text-white font-bold">📱 Get your queue number at the kiosk terminal</p>
          <p className="text-3xl text-white font-bold">🔊 Listen for your number to be called</p>
          <p className="text-3xl text-white font-bold">ℹ️ For assistance, please contact the information desk</p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsDisplay;
