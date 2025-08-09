import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminCard, StatCard, DataTable, Button, StatusBadge, Modal, Form, FormField, FormActions } from '../../ui';

const RegistrarAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    queueLength: 0,
    servedToday: 0,
    activeWindows: 0,
    avgWaitTime: '0 min'
  });
  const [queue, setQueue] = useState([]);
  const [windows, setWindows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState('');

  useEffect(() => {
    fetchRegistrarData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchRegistrarData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRegistrarData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats = {
        queueLength: 8,
        servedToday: 23,
        activeWindows: 3,
        avgWaitTime: '12 min'
      };

      const mockQueue = [
        {
          id: 1,
          queueNumber: 24,
          name: 'John Doe',
          contactNumber: '09123456789',
          service: 'Transcript Request',
          priority: 'normal',
          timestamp: new Date('2024-01-15T10:30:00'),
          status: 'waiting'
        },
        {
          id: 2,
          queueNumber: 25,
          name: 'Jane Smith',
          contactNumber: '09987654321',
          service: 'Certificate of Enrollment',
          priority: 'normal',
          timestamp: new Date('2024-01-15T10:35:00'),
          status: 'waiting'
        },
        {
          id: 3,
          queueNumber: 26,
          name: 'Mike Johnson',
          contactNumber: '09555666777',
          service: 'Grade Report',
          priority: 'urgent',
          timestamp: new Date('2024-01-15T10:40:00'),
          status: 'waiting'
        }
      ];

      const mockWindows = [
        {
          id: 'window1',
          name: 'Window 1',
          isActive: true,
          currentNumber: 23,
          operator: 'Alice Brown',
          status: 'serving'
        },
        {
          id: 'window2',
          name: 'Window 2',
          isActive: true,
          currentNumber: null,
          operator: 'Bob Wilson',
          status: 'available'
        },
        {
          id: 'window3',
          name: 'Window 3',
          isActive: false,
          currentNumber: null,
          operator: null,
          status: 'closed'
        }
      ];

      setStats(mockStats);
      setQueue(mockQueue);
      setWindows(mockWindows);
    } catch (error) {
      console.error('Error fetching registrar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallNext = (windowId) => {
    setSelectedWindow(windowId);
    setShowCallModal(true);
  };

  const handleConfirmCall = async () => {
    try {
      if (queue.length === 0) return;
      
      const nextInQueue = queue[0];
      const updatedQueue = queue.slice(1);
      const updatedWindows = windows.map(w => 
        w.id === selectedWindow 
          ? { ...w, currentNumber: nextInQueue.queueNumber, status: 'serving' }
          : w
      );
      
      setQueue(updatedQueue);
      setWindows(updatedWindows);
      setStats(prev => ({ ...prev, queueLength: prev.queueLength - 1, servedToday: prev.servedToday + 1 }));
      setShowCallModal(false);
    } catch (error) {
      console.error('Error calling next number:', error);
    }
  };

  const handleCompleteService = async (windowId) => {
    try {
      const updatedWindows = windows.map(w => 
        w.id === windowId 
          ? { ...w, currentNumber: null, status: 'available' }
          : w
      );
      setWindows(updatedWindows);
    } catch (error) {
      console.error('Error completing service:', error);
    }
  };

  const queueColumns = [
    {
      key: 'queueNumber',
      label: 'Queue #',
      render: (value) => (
        <span className="font-bold text-lg" style={{ color: '#2F0FE4' }}>
          #{value.toString().padStart(2, '0')}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.contactNumber}</div>
        </div>
      )
    },
    {
      key: 'service',
      label: 'Service',
      render: (value) => <span className="text-gray-700">{value}</span>
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <StatusBadge status={value === 'urgent' ? 'warning' : 'info'} />
      )
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (value) => new Date(value).toLocaleTimeString()
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrar dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Registrar Administration Dashboard
        </h1>
        <p className="text-gray-600">
          Manage registrar queue, windows, and services for efficient student assistance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Queue Length" value={stats.queueLength} icon="📋" color="blue" />
        <StatCard title="Served Today" value={stats.servedToday} icon="✅" color="green" />
        <StatCard title="Active Windows" value={stats.activeWindows} icon="🪟" color="yellow" />
        <StatCard title="Avg Wait Time" value={stats.avgWaitTime} icon="⏱️" color="gray" />
      </div>

      {/* Window Controls */}
      <AdminCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Window Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {windows.map((window) => (
            <div key={window.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{window.name}</h4>
                <StatusBadge 
                  status={window.status === 'serving' ? 'processing' : 
                          window.status === 'available' ? 'active' : 'inactive'} 
                />
              </div>
              
              {window.operator && (
                <p className="text-sm text-gray-600 mb-2">
                  Operator: {window.operator}
                </p>
              )}
              
              {window.currentNumber && (
                <p className="text-sm text-gray-600 mb-3">
                  Serving: #{window.currentNumber.toString().padStart(2, '0')}
                </p>
              )}
              
              <div className="space-y-2">
                {window.isActive && window.status === 'available' && queue.length > 0 && (
                  <Button 
                    onClick={() => handleCallNext(window.id)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Call Next
                  </Button>
                )}
                
                {window.isActive && window.status === 'serving' && (
                  <Button 
                    onClick={() => handleCompleteService(window.id)}
                    variant="success"
                    size="sm"
                    className="w-full"
                  >
                    Complete Service
                  </Button>
                )}
                
                {!window.isActive && (
                  <Button 
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Window Closed
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Current Queue */}
      <AdminCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Queue</h3>
          <div className="text-sm text-gray-500">
            {queue.length} people waiting
          </div>
        </div>
        
        <DataTable
          data={queue}
          columns={queueColumns}
          searchable={false}
          sortable={false}
          pagination={false}
          emptyMessage="No one in queue"
        />
      </AdminCard>

      {/* Call Next Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        title="Call Next Number"
        size="sm"
      >
        {queue.length > 0 ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Call Queue Number
            </h3>
            <div className="text-4xl font-bold mb-4" style={{ color: '#2F0FE4' }}>
              #{queue[0]?.queueNumber.toString().padStart(2, '0')}
            </div>
            <p className="text-gray-600 mb-6">
              {queue[0]?.name} - {queue[0]?.service}
            </p>
            
            <FormActions>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowCallModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleConfirmCall}
              >
                Call Now
              </Button>
            </FormActions>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">No one in queue to call.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegistrarAdminDashboard;
