import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const PublicDisplay = () => {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState({
    registrarWindows: {
      window1: { queue: [], currentNumber: 0, serving: null, name: 'Window 1', services: [] },
      window2: { queue: [], currentNumber: 0, serving: null, name: 'Window 2', services: [] },
      window3: { queue: [], currentNumber: 0, serving: null, name: 'Window 3', services: [] }
    },
    admissions: { queue: [], currentNumber: 0, serving: null }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const departmentInfo = {
    registrarWindows: {
      window1: { name: 'Window 1', color: '#2563eb', icon: '📋' },
      window2: { name: 'Window 2', color: '#1d4ed8', icon: '📋' },
      window3: { name: 'Window 3', color: '#1e40af', icon: '📋' }
    },
    admissions: {
      name: 'Admissions Office',
      color: '#dc2626',
      icon: '🎓'
    }
  };

  useEffect(() => {
    initializeSocket();
    fetchAllQueueData();

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
      console.log('Connected to server');
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === 'registrar' && data.window) {
        // Handle registrar window updates
        setQueueData(prev => ({
          ...prev,
          registrarWindows: {
            ...prev.registrarWindows,
            [data.window]: {
              ...prev.registrarWindows[data.window],
              queue: data.windowQueue,
              serving: data.serving
            }
          }
        }));
      } else if (data.department === 'admissions') {
        // Handle admissions updates
        setQueueData(prev => ({
          ...prev,
          admissions: {
            queue: data.queue,
            currentNumber: data.currentNumbers[data.department],
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

  const fetchAllQueueData = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const [registrarWindowsResponse, admissionsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/public/queue/registrar-windows`),
        axios.get(`${API_URL}/api/public/queue/admissions`)
      ]);

      setQueueData({
        registrarWindows: {
          window1: {
            queue: registrarWindowsResponse.data.window1.queue,
            currentNumber: registrarWindowsResponse.data.window1.currentNumber,
            serving: registrarWindowsResponse.data.window1.serving,
            name: registrarWindowsResponse.data.window1.name,
            services: registrarWindowsResponse.data.window1.services
          },
          window2: {
            queue: registrarWindowsResponse.data.window2.queue,
            currentNumber: registrarWindowsResponse.data.window2.currentNumber,
            serving: registrarWindowsResponse.data.window2.serving,
            name: registrarWindowsResponse.data.window2.name,
            services: registrarWindowsResponse.data.window2.services
          },
          window3: {
            queue: registrarWindowsResponse.data.window3.queue,
            currentNumber: registrarWindowsResponse.data.window3.currentNumber,
            serving: registrarWindowsResponse.data.window3.serving,
            name: registrarWindowsResponse.data.window3.name,
            services: registrarWindowsResponse.data.window3.services
          }
        },
        admissions: {
          queue: admissionsResponse.data.queue,
          currentNumber: admissionsResponse.data.currentNumber,
          serving: admissionsResponse.data.serving
        }
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load queue data. Please try again.');
      console.error('Error fetching queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWaitingCount = (department, window = null) => {
    if (department === 'registrarWindows' && window) {
      return queueData.registrarWindows[window].queue.filter(item => item.status === 'waiting').length;
    }
    return queueData[department].queue.filter(item => item.status === 'waiting').length;
  };

  const getEstimatedWaitTime = (department) => {
    const waitingCount = getWaitingCount(department);
    return waitingCount * 5; // 5 minutes per person estimate
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-2xl">Loading queue information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-4">Unable to load queue information</h2>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={fetchAllQueueData}
            className="bg-red-600 text-white border-none py-4 px-8 rounded-xl text-lg cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex justify-between items-center p-8 bg-white shadow-md">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800">🏛️ University Queue System</h1>
          <p className="text-xl text-gray-600">Real-time Queue Status</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold mb-1 text-gray-800">{formatTime(currentTime)}</div>
          <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Registrar Windows Section */}
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Registrar's Office</h2>
          <p className="text-center text-gray-600">Service Windows</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(queueData.registrarWindows).map(([windowKey, windowData]) => {
            const windowInfo = departmentInfo.registrarWindows[windowKey];
            return (
              <div key={windowKey} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="text-white p-4 text-center" style={{ backgroundColor: windowInfo.color }}>
                  <div className="text-3xl mb-2">{windowInfo.icon}</div>
                  <h3 className="text-xl font-bold">{windowData.name}</h3>
                  <p className="text-sm opacity-90">
                    {windowData.services.join(', ')}
                  </p>
                </div>

                <div className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">Now Serving</h4>
                    {windowData.serving ? (
                      <div
                        className="w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg"
                        style={{ backgroundColor: windowInfo.color }}
                      >
                        {windowData.serving.queueNumber}
                      </div>
                    ) : (
                      <div className="bg-gray-400 text-white py-2 px-4 rounded-lg text-sm">
                        <span>No one being served</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-md font-semibold mb-3 text-center text-gray-800">Next in Line</h5>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {windowData.queue
                        .filter(item => item.status === 'waiting')
                        .slice(0, 3)
                        .map((item, index) => (
                          <div
                            key={item.id}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                              index === 0
                                ? 'text-white shadow-lg ring-2 ring-white ring-opacity-50 animate-pulse'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                            style={index === 0 ? { backgroundColor: windowInfo.color } : {}}
                          >
                            {item.queueNumber}
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                ▶
                              </div>
                            )}
                          </div>
                        ))
                      }
                      {getWaitingCount('registrarWindows', windowKey) === 0 && (
                        <div className="text-gray-500 italic text-sm">No one waiting</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admissions Section */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="text-white p-6 text-center" style={{ backgroundColor: departmentInfo.admissions.color }}>
              <div className="text-4xl mb-2">{departmentInfo.admissions.icon}</div>
              <h2 className="text-2xl font-bold">{departmentInfo.admissions.name}</h2>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Now Serving</h3>
                {queueData.admissions.serving ? (
                  <div
                    className="w-24 h-24 rounded-full text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg"
                    style={{ backgroundColor: departmentInfo.admissions.color }}
                  >
                    {queueData.admissions.serving.queueNumber}
                  </div>
                ) : (
                  <div className="bg-gray-400 text-white py-4 px-6 rounded-xl">
                    <span>No one being served</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-center text-gray-800">Next in Line</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {queueData.admissions.queue
                    .filter(item => item.status === 'waiting')
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold relative transition-all duration-300 ${
                          index === 0
                            ? 'text-white shadow-lg ring-2 ring-white ring-opacity-50 animate-pulse'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                        style={index === 0 ? { backgroundColor: departmentInfo.admissions.color } : {}}
                      >
                        {item.queueNumber}
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            ▶
                          </div>
                        )}
                      </div>
                    ))
                  }
                  {getWaitingCount('admissions') === 0 && (
                    <div className="text-gray-500 italic">No one waiting</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white p-6 mt-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-700">📱 Get your queue number at the kiosk terminal</p>
            <p className="text-lg text-gray-700">🔊 Listen for your number to be called</p>
            <p className="text-lg text-gray-700">ℹ️ For assistance, please contact the information desk</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              🖥️ Kiosk
            </button>
            <button
              onClick={() => navigate('/display/registrar')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📋 Registrar Only
            </button>
            <button
              onClick={() => navigate('/display/admissions')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              🎓 Admissions Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDisplay;
