import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminCard, StatCard } from '../../ui/Card';

const AdmissionsAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    queueLength: 0,
    servedToday: 0,
    activeWindows: 0,
    systemStatus: 'operational'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch windows data
        const windowsResponse = await fetch('http://localhost:5000/api/windows/admissions');
        const windows = windowsResponse.ok ? await windowsResponse.json() : [];

        // Mock stats based on actual data
        const mockStats = {
          queueLength: 5,
          servedToday: 18,
          activeWindows: windows.length,
          systemStatus: 'operational'
        };

        const mockActivity = [
          {
            id: 1,
            action: 'Queue number called',
            details: 'Window 1 - #12',
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            type: 'queue'
          },
          {
            id: 2,
            action: 'Window activated',
            details: 'Window 2 started service',
            timestamp: new Date(Date.now() - 12 * 60 * 1000),
            type: 'window'
          },
          {
            id: 3,
            action: 'Service completed',
            details: 'Admission inquiry processed',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            type: 'service'
          }
        ];

        setStats(mockStats);
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'queue': return '📋';
      case 'window': return '🪟';
      case 'service': return '✅';
      default: return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3463] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F3463]">Admissions Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Admissions Admin'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Queue Length" value={stats.queueLength} icon="📋" color="blue" />
        <StatCard title="Served Today" value={stats.servedToday} icon="✅" color="green" />
        <StatCard title="Active Windows" value={stats.activeWindows} icon="🪟" color="yellow" />
      </div>

      {/* Recent Activity */}
      <AdminCard title="Recent Activity" icon="📊">
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatTime(activity.timestamp)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <AdminCard title="Quick Actions" icon="⚡">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 bg-[#1F3463] text-white rounded-lg hover:bg-[#1F3463]/90 transition-colors">
            <div className="text-2xl mb-2">🪟</div>
            <div className="font-medium">Manage Windows</div>
            <div className="text-sm opacity-90">Configure window settings</div>
          </button>
          <button className="p-4 bg-[#3930A8] text-white rounded-lg hover:bg-[#3930A8]/90 transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">View Queues</div>
            <div className="text-sm opacity-90">Monitor queue status</div>
          </button>
          <button className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">View Reports</div>
            <div className="text-sm opacity-90">Transaction logs & analytics</div>
          </button>
        </div>
      </AdminCard>
    </div>
  );
};

export default AdmissionsAdminDashboard;
