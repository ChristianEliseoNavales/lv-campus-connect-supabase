import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegistrarSidebar from './RegistrarSidebar';
import axios from 'axios';
import io from 'socket.io-client';

const RegistrarWindowDashboard = () => {
  const { window } = useParams();
  const navigate = useNavigate();
  const { user, canAccessDepartment } = useAuth();
  const [queueData, setQueueData] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCallNextLoading, setIsCallNextLoading] = useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const socketRef = useRef(null);

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

  const currentWindow = windowConfig[window];

  // Check department access and window validity
  useEffect(() => {
    if (user && !canAccessDepartment('registrar')) {
      navigate('/unauthorized', { replace: true });
      return;
    }

    if (window && !windowConfig[window]) {
      setError(`Invalid window: ${window}`);
      setLoading(false);
      return;
    }
  }, [user, canAccessDepartment, navigate, window]);

  useEffect(() => {
    if (user && window) {
      initializeSocket();
      fetchQueueData();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, window]);

  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      newSocket.emit('joinDepartment', 'registrar');
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === 'registrar') {
        if (data.window === window || !data.window) {
          setQueueData(data.windowQueue || data.queue || []);
          setCurrentServing(data.serving);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }, [window]);

  const fetchQueueData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const response = await axios.get(`http://localhost:3001/api/queue/registrar/${window}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setQueueData(response.data.queue || []);
      setCurrentServing(response.data.serving);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue data:', error);
      if (error.response?.status === 401) {
        navigate('/login', { replace: true });
      } else {
        setError('Failed to load queue data');
      }
      setLoading(false);
    }
  };

  const callNextPerson = async () => {
    const waitingQueue = queueData.filter(item => item.status === 'waiting');
    
    if (waitingQueue.length === 0) {
      alert('No one is waiting in the queue.');
      return;
    }

    if (currentServing) {
      alert('Please complete the current service before calling the next person.');
      return;
    }

    const nextPerson = waitingQueue[0];
    setIsCallNextLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        navigate('/login', { replace: true });
        return;
      }

      await axios.post(`http://localhost:3001/api/queue/registrar/${window}/call-next`, {
        queueId: nextPerson.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state immediately
      setCurrentServing(nextPerson);
      setQueueData(prev => prev.map(item =>
        item.id === nextPerson.id
          ? { ...item, status: 'serving' }
          : item
      ));

      // Announce the queue number
      announceQueueNumber(nextPerson.queueNumber);
    } catch (error) {
      console.error('Error calling next person:', error);
      alert('Failed to call next person. Please try again.');
    } finally {
      setIsCallNextLoading(false);
    }
  };

  const completeService = async () => {
    if (!currentServing) {
      alert('No one is currently being served.');
      return;
    }

    setIsCompleteLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        navigate('/login', { replace: true });
        return;
      }

      await axios.post(`http://localhost:3001/api/queue/registrar/${window}/complete`, {
        queueId: currentServing.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state immediately
      setCurrentServing(null);
      setQueueData(prev => prev.map(item =>
        item.id === currentServing.id
          ? { ...item, status: 'completed' }
          : item
      ));
    } catch (error) {
      console.error('Error completing service:', error);
      alert('Failed to complete service. Please try again.');
    } finally {
      setIsCompleteLoading(false);
    }
  };

  const announceQueueNumber = (queueNumber) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Queue number ${queueNumber}, please proceed to ${currentWindow.name}.`
      );
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getWaitingCount = () => {
    return queueData.filter(item => item.status === 'waiting').length;
  };

  const getServingCount = () => {
    return queueData.filter(item => item.status === 'serving').length;
  };

  const getCompletedCount = () => {
    return queueData.filter(item => item.status === 'completed').length;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <RegistrarSidebar selectedWindow={window} onWindowSelect={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading window data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <RegistrarSidebar selectedWindow={window} onWindowSelect={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin/registrar')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <RegistrarSidebar selectedWindow={window} onWindowSelect={() => {}} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="text-4xl"
                style={{ color: currentWindow.color }}
              >
                {currentWindow.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentWindow.name}</h1>
                <p className="text-gray-600">Queue Management Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Time</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="px-8 py-4 bg-white border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Services Handled</h3>
          <div className="flex flex-wrap gap-2">
            {currentWindow.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: currentWindow.color }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Waiting</p>
                  <p className="text-3xl font-bold text-orange-600">{getWaitingCount()}</p>
                </div>
                <div className="text-orange-500 text-2xl">⏳</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Serving</p>
                  <p className="text-3xl font-bold text-blue-600">{getServingCount()}</p>
                </div>
                <div className="text-blue-500 text-2xl">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{getCompletedCount()}</p>
                </div>
                <div className="text-green-500 text-2xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Today</p>
                  <p className="text-3xl font-bold text-gray-900">{queueData.length}</p>
                </div>
                <div className="text-gray-500 text-2xl">📊</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Currently Serving */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">👤</span>
                  Currently Serving
                </h2>
              </div>
              <div className="p-6">
                {currentServing ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-700">
                          #{currentServing.queueNumber}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          SERVING
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{currentServing.fullName}</h3>
                      <p className="text-gray-600">{currentServing.service}</p>
                      <p className="text-sm text-gray-500">{currentServing.purpose}</p>
                      <p className="text-xs text-gray-400">Started: {formatTime(currentServing.timestamp)}</p>
                    </div>
                    <button
                      onClick={completeService}
                      disabled={isCompleteLoading}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCompleteLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Completing...
                        </span>
                      ) : (
                        'Complete Service'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">💺</div>
                    <p className="text-gray-500">No one is currently being served</p>
                    <p className="text-sm text-gray-400">Call the next person to start serving</p>
                  </div>
                )}
              </div>
            </div>

            {/* Queue Management */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">📋</span>
                    Queue Management
                  </h2>
                  <button
                    onClick={callNextPerson}
                    disabled={isCallNextLoading || getWaitingCount() === 0 || currentServing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCallNextLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Calling...
                      </span>
                    ) : (
                      'Call Next'
                    )}
                  </button>
                </div>
              </div>
              <div className="p-6">
                {getWaitingCount() > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {queueData
                      .filter(item => item.status === 'waiting')
                      .map((person, index) => (
                        <div
                          key={person.id}
                          className={`p-4 rounded-lg border ${
                            index === 0
                              ? 'border-orange-200 bg-orange-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`text-lg font-bold ${
                                index === 0 ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                #{person.queueNumber}
                              </span>
                              <div>
                                <h4 className="font-semibold text-gray-900">{person.fullName}</h4>
                                <p className="text-sm text-gray-600">{person.service}</p>
                              </div>
                            </div>
                            {index === 0 && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                                NEXT
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📭</div>
                    <p className="text-gray-500">No one is waiting in the queue</p>
                    <p className="text-sm text-gray-400">New submissions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">📈</span>
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {queueData.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {queueData
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-600">#{person.queueNumber}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{person.fullName}</h4>
                            <p className="text-sm text-gray-600">{person.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            person.status === 'waiting' ? 'bg-orange-100 text-orange-800' :
                            person.status === 'serving' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {person.status.toUpperCase()}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(person.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📊</div>
                  <p className="text-gray-500">No activity yet</p>
                  <p className="text-sm text-gray-400">Queue submissions will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarWindowDashboard;
