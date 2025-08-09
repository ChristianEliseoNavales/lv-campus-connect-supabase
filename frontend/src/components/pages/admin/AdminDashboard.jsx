import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminCard, StatCard } from '../../ui/Card';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeQueues: 0,
    todayServed: 0,
    systemStatus: 'operational'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls - replace with actual API endpoints
        const mockStats = {
          totalUsers: 156,
          activeQueues: 2,
          todayServed: 47,
          systemStatus: 'operational'
        };

        const mockActivity = [
          {
            id: 1,
            action: 'Queue number called',
            details: 'Registrar Window 1 - #23',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            type: 'queue'
          },
          {
            id: 2,
            action: 'New user registered',
            details: 'John Doe joined the system',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            type: 'user'
          },
          {
            id: 3,
            action: 'Service completed',
            details: 'Admissions - Application review',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
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
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'queue': return '📋';
      case 'user': return '👤';
      case 'service': return '✅';
      default: return '📝';
    }
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'super_admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
            <StatCard title="Active Queues" value={stats.activeQueues} icon="📋" color="green" />
            <StatCard title="Served Today" value={stats.todayServed} icon="✅" color="yellow" />
            <StatCard 
              title="System Status" 
              value={stats.systemStatus === 'operational' ? 'Online' : 'Issues'} 
              icon="🟢" 
              color={stats.systemStatus === 'operational' ? 'green' : 'red'} 
            />
          </div>
        );
      case 'registrar_admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Queue Length" value="8" icon="📋" color="blue" />
            <StatCard title="Served Today" value="23" icon="✅" color="green" />
            <StatCard title="Active Windows" value="3" icon="🪟" color="yellow" />
          </div>
        );
      case 'admissions_admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Queue Length" value="5" icon="🎓" color="blue" />
            <StatCard title="Served Today" value="12" icon="✅" color="green" />
            <StatCard title="Applications" value="47" icon="📄" color="yellow" />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in the University Queue System today.
        </p>
      </div>

      {/* Role-specific Stats */}
      {getRoleSpecificContent()}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role === 'super_admin' && (
              <>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">👥</span>
                    <div>
                      <p className="font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-600">Add, edit, or remove user accounts</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">⚙️</span>
                    <div>
                      <p className="font-medium text-gray-900">System Settings</p>
                      <p className="text-sm text-gray-600">Configure system parameters</p>
                    </div>
                  </div>
                </button>
              </>
            )}
            
            {(user?.role === 'registrar_admin' || user?.role === 'super_admin') && (
              <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">Manage Registrar Queue</p>
                    <p className="text-sm text-gray-600">Control queue and windows</p>
                  </div>
                </div>
              </button>
            )}
            
            {(user?.role === 'admissions_admin' || user?.role === 'super_admin') && (
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🎓</span>
                  <div>
                    <p className="font-medium text-gray-900">Manage Admissions Queue</p>
                    <p className="text-sm text-gray-600">Control admissions processes</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
