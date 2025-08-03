import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const RegistrarDisplay = () => {
  const [queueData, setQueueData] = useState({
    window1: { queue: [], currentNumber: 0, serving: null, name: 'Window 1', services: [] },
    window2: { queue: [], currentNumber: 0, serving: null, name: 'Window 2', services: [] },
    window3: { queue: [], currentNumber: 0, serving: null, name: 'Window 3', services: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const departmentInfo = {
    name: "Registrar's Office",
    color: '#2563eb',
    icon: '📋',
    description: 'Student records, transcripts, certificates, and academic documentation',
    windows: {
      window1: { name: 'Window 1', color: '#2563eb', icon: '📋' },
      window2: { name: 'Window 2', color: '#1d4ed8', icon: '📋' },
      window3: { name: 'Window 3', color: '#1e40af', icon: '📋' }
    }
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
      console.log('Connected to server for Registrar Display');
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === 'registrar' && data.window) {
        setQueueData(prev => ({
          ...prev,
          [data.window]: {
            ...prev[data.window],
            queue: data.windowQueue,
            serving: data.serving
          }
        }));
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

      const response = await axios.get(`${API_URL}/api/public/queue/registrar-windows`);

      setQueueData(response.data);
      
      setError(null);
    } catch (err) {
      setError('Failed to load queue data. Please try again.');
      console.error('Error fetching registrar queue data:', err);
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

  const getWaitingCount = (windowKey) => {
    return queueData[windowKey].queue.filter(item => item.status === 'waiting').length;
  };

  const getEstimatedWaitTime = (windowKey) => {
    const waitingCount = getWaitingCount(windowKey);
    return waitingCount * 5; // Estimate 5 minutes per person
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-blue-800/20 p-16 rounded-3xl backdrop-blur-md border-4 border-blue-600">
          <div className="w-24 h-24 border-8 border-white border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-5xl font-black">Loading Registrar Queue...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-blue-800/20 p-16 rounded-3xl backdrop-blur-md border-4 border-blue-600">
          <h2 className="text-5xl font-black mb-8">Unable to load queue information</h2>
          <p className="text-3xl mb-12">{error}</p>
          <button
            onClick={fetchQueueData}
            className="bg-blue-600 text-white border-none py-6 px-12 rounded-2xl text-2xl font-bold cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1"
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
      <div className="flex justify-between items-center p-12 bg-blue-800 shadow-2xl">
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
          <div className="text-2xl text-blue-100">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Service Windows - Optimized for Large Room Visibility */}
      <div className="p-12">
        <div className="mb-16">
          <h2 className="text-6xl font-black text-center text-white mb-4 drop-shadow-lg">Service Windows</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {Object.entries(queueData).map(([windowKey, windowData]) => {
            const windowInfo = departmentInfo.windows[windowKey];
            return (
              <div key={windowKey} className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-600">
                <div className="text-white p-8 text-center" style={{ backgroundColor: windowInfo.color }}>
                  <div className="text-6xl mb-4">{windowInfo.icon}</div>
                  <h3 className="text-4xl font-black">{windowData.name}</h3>
                </div>

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-3xl font-black mb-6 text-white">NOW SERVING</h4>
                    {windowData.serving ? (
                      <div
                        className="w-32 h-32 rounded-full text-white flex items-center justify-center text-6xl font-black mx-auto shadow-2xl border-4 border-white"
                        style={{ backgroundColor: windowInfo.color }}
                      >
                        {windowData.serving.queueNumber}
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-white py-6 px-8 rounded-2xl text-2xl font-bold">
                        <span>NONE</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-2xl font-black mb-6 text-center text-white">NEXT IN LINE</h5>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {windowData.queue
                        .filter(item => item.status === 'waiting')
                        .slice(0, 3)
                        .map((item, index) => (
                          <div
                            key={item.id}
                            className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl relative transition-all duration-300 border-4 ${
                              index === 0
                                ? 'text-white shadow-2xl ring-4 ring-yellow-400 animate-pulse border-yellow-400'
                                : 'bg-gray-600 text-white border-gray-400'
                            }`}
                            style={index === 0 ? { backgroundColor: windowInfo.color } : {}}
                          >
                            {item.queueNumber}
                            {index === 0 && (
                              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-lg rounded-full w-8 h-8 flex items-center justify-center font-black">
                                ▶
                              </div>
                            )}
                          </div>
                        ))
                      }
                      {getWaitingCount(windowKey) === 0 && (
                        <div className="text-gray-400 italic text-xl font-bold">No one waiting</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Footer */}
      <div className="bg-blue-800 p-12 mt-16 shadow-2xl">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-3xl text-white font-bold">📱 Get your queue number at the kiosk terminal</p>
          <p className="text-3xl text-white font-bold">🔊 Listen for your number to be called</p>
          <p className="text-3xl text-white font-bold">ℹ️ For assistance, please contact the information desk</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrarDisplay;
