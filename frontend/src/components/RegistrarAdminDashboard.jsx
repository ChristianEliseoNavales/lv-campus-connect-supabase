import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from './layouts';
import axios from 'axios';
import io from 'socket.io-client';

const RegistrarAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, canAccessDepartment, isAuthenticated, loading: authLoading } = useAuth();

  const [queueData, setQueueData] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [windowStats, setWindowStats] = useState({});

  const windowConfig = {
    window1: {
      name: 'Window 1',
      color: '#3b82f6',
      icon: '🪟',
      services: ['Transcript Request', 'Certificate of Enrollment']
    },
    window2: {
      name: 'Window 2', 
      color: '#10b981',
      icon: '🪟',
      services: ['Diploma Verification', 'Grade Inquiry']
    },
    window3: {
      name: 'Window 3',
      color: '#f59e0b', 
      icon: '🪟',
      services: ['Student Records Update']
    }
  };

  // Check department access
  useEffect(() => {
    if (user && !canAccessDepartment('registrar')) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, canAccessDepartment, navigate]);

  useEffect(() => {
    // Only proceed if auth is not loading and user is authenticated
    if (!authLoading && isAuthenticated && user) {
      initializeSocket();
      fetchQueueData();
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, isAuthenticated, authLoading]);

  const initializeSocket = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinDepartment', 'registrar');
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === 'registrar') {
        setQueueData(data.queue);
        setCurrentNumber(data.currentNumbers.registrar);
        calculateWindowStats(data.queue);
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
      setError(null);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Authentication token not found');
        navigate('/login', { replace: true });
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${API_URL}/api/queue/registrar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setQueueData(response.data.queue || []);
      setCurrentServing(response.data.serving);
      setCurrentNumber(response.data.currentNumber || 0);
      calculateWindowStats(response.data.queue || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching queue data:', error);

      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        navigate('/login', { replace: true });
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to view registrar data.');
        navigate('/unauthorized', { replace: true });
      } else {
        setError(error.response?.data?.error || 'Failed to load queue data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateWindowStats = (queue) => {
    const stats = {};

    Object.entries(windowConfig).forEach(([windowId, config]) => {
      const windowQueue = queue.filter(item =>
        config.services.includes(item.service) && item.status !== 'completed'
      );

      stats[windowId] = {
        waiting: windowQueue.filter(item => item.status === 'waiting').length,
        serving: windowQueue.filter(item => item.status === 'serving').length,
        total: windowQueue.length
      };
    });

    setWindowStats(stats);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getTotalWaiting = () => {
    return queueData.filter(item => item.status === 'waiting').length;
  };

  const getTotalCompleted = () => {
    return queueData.filter(item => item.status === 'completed').length;
  };

  const getTotalServing = () => {
    return queueData.filter(item => item.status === 'serving').length;
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <AdminLayout
        title="Registrar's Office"
        subtitle="Authenticating..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show component loading state
  if (loading) {
    return (
      <AdminLayout
        title="Registrar's Office"
        subtitle="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registrar data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        title="Registrar's Office"
        subtitle="Error"
      >
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchQueueData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Registrar's Office"
      subtitle="Multi-Window Queue Management Overview"
    >
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Total Waiting</h3>
          <div className="text-3xl font-bold text-amber-600">{getTotalWaiting()}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Currently Serving</h3>
          <div className="text-3xl font-bold text-blue-600">{getTotalServing()}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Completed Today</h3>
          <div className="text-3xl font-bold text-emerald-600">{getTotalCompleted()}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Global Queue Number</h3>
          <div className="text-3xl font-bold text-purple-600">{currentNumber}</div>
        </div>
      </div>

      {/* Windows Overview */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Windows Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(windowConfig).map(([windowId, config]) => (
            <div
              key={windowId}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
              onClick={() => navigate(`/admin/registrar/${windowId}`)}
              style={{ borderTopColor: config.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" style={{ color: config.color }}>
                  {config.icon}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{config.name}</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {config.services.map((service, index) => (
                  <span
                    key={index}
                    className="text-white px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: config.color }}
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mb-4 p-3 bg-white rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500 font-medium">Waiting</div>
                  <div className="text-xl font-bold text-gray-900">{windowStats[windowId]?.waiting || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 font-medium">Serving</div>
                  <div className="text-xl font-bold text-gray-900">{windowStats[windowId]?.serving || 0}</div>
                </div>
              </div>

              <button
                className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90 hover:transform hover:-translate-y-0.5"
                style={{ backgroundColor: config.color }}
              >
                Manage {config.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Queue Activity</h2>
        <div className="space-y-4">
          {queueData
            .filter(item => item.status !== 'completed')
            .slice(0, 10)
            .map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-transparent">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">#{item.queueNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">{item.fullName}</h4>
                  <p className="text-gray-600">{item.service}</p>
                  <small className="text-gray-500">{formatTime(item.timestamp)}</small>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'waiting'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.status === 'waiting' && '⏳ Waiting'}
                  {item.status === 'serving' && '👥 Serving'}
                </div>
                <div className="text-sm text-gray-500 font-medium min-w-20 text-right">
                  {windowConfig[item.window]?.name || 'Unassigned'}
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegistrarAdminDashboard;
