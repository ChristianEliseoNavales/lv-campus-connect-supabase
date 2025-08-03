import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const DepartmentDisplay = () => {
  const { department } = useParams();
  const navigate = useNavigate();
  
  const [queueData, setQueueData] = useState({ queue: [], currentNumber: 0, serving: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const departmentInfo = {
    registrar: {
      name: "Registrar's Office",
      color: '#2563eb',
      icon: '📋',
      bgColor: 'bg-blue-600'
    },
    admissions: {
      name: 'Admissions Office',
      color: '#dc2626',
      icon: '🎓',
      bgColor: 'bg-red-600'
    }
  };

  useEffect(() => {
    if (!department || !departmentInfo[department]) {
      navigate('/');
      return;
    }

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
  }, [department]);

  const initializeSocket = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinDepartment', department);
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === department) {
        setQueueData({
          queue: data.queue,
          currentNumber: data.currentNumbers[department],
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
      const response = await axios.get(`http://localhost:3001/api/queue/${department}`);
      setQueueData({
        queue: response.data.queue,
        currentNumber: response.data.currentNumber,
        serving: response.data.serving
      });
      setError(null);
    } catch (err) {
      setError('Failed to load queue data. Please try again.');
      console.error('Error fetching queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWaitingCount = () => {
    return queueData.queue.filter(item => item.status === 'waiting').length;
  };

  const getCompletedCount = () => {
    return queueData.queue.filter(item => item.status === 'completed').length;
  };

  const getEstimatedWaitTime = () => {
    const waitingCount = getWaitingCount();
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
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Loading queue information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-4">Unable to load queue information</h2>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={fetchQueueData}
            className="bg-red-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const deptInfo = departmentInfo[department];

  return (
    <div className={`min-h-screen text-white font-sans ${deptInfo.bgColor}`}>
      {/* Header Section - Landscape Optimized */}
      <div className="flex justify-between items-center p-8 bg-white/10 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="text-6xl">{deptInfo.icon}</div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{deptInfo.name}</h1>
            <p className="text-xl opacity-90">Queue Status Display</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold mb-1">{formatTime(currentTime)}</div>
          <div className="text-lg opacity-90">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Main Content - 16:9 Landscape Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Left Section - Now Serving */}
        <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Now Serving</h2>
          {queueData.serving ? (
            <div className="text-center">
              <div
                className="w-32 h-32 rounded-full text-white flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-2xl"
                style={{ backgroundColor: deptInfo.color }}
              >
                {queueData.serving.queueNumber}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">{queueData.serving.fullName}</h3>
                <p className="text-lg opacity-90">{queueData.serving.service}</p>
                <p className="text-sm opacity-75">
                  Called at {new Date(queueData.serving.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏸️</div>
              <p className="text-xl mb-2">No one currently being served</p>
              <small className="text-sm opacity-75">Please wait for your number to be called</small>
            </div>
          )}
        </div>

        {/* Center Section - Statistics */}
        <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🎫</div>
              <div className="text-3xl font-bold mb-2" style={{ color: deptInfo.color }}>{queueData.currentNumber}</div>
              <div className="text-sm opacity-75">Total Issued</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <div className="text-3xl font-bold mb-2 text-yellow-400">{getWaitingCount()}</div>
              <div className="text-sm opacity-75">Waiting</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="text-3xl font-bold mb-2 text-green-400">{getCompletedCount()}</div>
              <div className="text-sm opacity-75">Completed</div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⏰</div>
              <div className="text-3xl font-bold mb-2 text-blue-400">{getEstimatedWaitTime()}</div>
              <div className="text-sm opacity-75">Est. Wait (min)</div>
            </div>
          </div>
        </div>

        {/* Right Section - Next in Line */}
        <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-8 text-center">Next in Line</h2>
          <div className="grid grid-cols-2 gap-4">
            {queueData.queue
              .filter(item => item.status === 'waiting')
              .slice(0, 8)
              .map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 text-center border-2 ${
                    index === 0 ? 'border-white bg-white/20' : 'border-white/30 bg-white/10'
                  }`}
                  style={{
                    borderColor: index === 0 ? deptInfo.color : 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: index === 0 ? `${deptInfo.color}20` : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-2xl font-bold">{item.queueNumber}</div>
                  {index === 0 && <div className="text-xs opacity-75 mt-1">Next Up</div>}
                </div>
              ))
            }
            {getWaitingCount() === 0 && (
              <div className="col-span-2 text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-xl mb-2">No one waiting</p>
                <small className="text-sm opacity-75">All caught up!</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white/10 backdrop-blur-md p-6">
        <div className="flex justify-center items-center gap-12 text-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <span className="text-lg">Get your queue number at the kiosk terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <span className="text-lg">Listen for your number to be called</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <span className="text-lg">For assistance, contact the information desk</span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            🖥️ Kiosk
          </button>
          <button
            onClick={() => navigate('/display')}
            className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            📺 All Departments
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDisplay;
