import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminCard, StatCard, DataTable, Modal, Form, FormField, FormActions, Button, StatusBadge, RoleBadge } from '../../ui';

const MISAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQueues: 0,
    systemUptime: '99.9%'
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    isActive: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats = {
        totalUsers: 156,
        activeUsers: 142,
        totalQueues: 2,
        systemUptime: '99.9%'
      };

      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@university.edu',
          role: 'super_admin',
          department: 'mis',
          isActive: true,
          lastLogin: new Date('2024-01-15T10:30:00'),
          createdAt: new Date('2024-01-01T00:00:00')
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@university.edu',
          role: 'registrar_admin',
          department: 'registrar',
          isActive: true,
          lastLogin: new Date('2024-01-15T09:15:00'),
          createdAt: new Date('2024-01-02T00:00:00')
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@university.edu',
          role: 'admissions_admin',
          department: 'admissions',
          isActive: false,
          lastLogin: new Date('2024-01-10T14:20:00'),
          createdAt: new Date('2024-01-03T00:00:00')
        }
      ];

      setStats(mockStats);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'user',
      department: '',
      isActive: true
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...userForm, updatedAt: new Date() }
            : u
        );
        setUsers(updatedUsers);
      } else {
        // Add new user
        const newUser = {
          id: Date.now(),
          ...userForm,
          lastLogin: null,
          createdAt: new Date()
        };
        setUsers([...users, newUser]);
      }
      setShowUserModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const userColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, user) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <RoleBadge role={value} />
    },
    {
      key: 'department',
      label: 'Department',
      render: (value) => (
        <span className="capitalize text-gray-700">{value}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MIS dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          MIS Administration Dashboard
        </h1>
        <p className="text-gray-600">
          Complete system administration and user management for the University Queue System.
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
        <StatCard title="Active Users" value={stats.activeUsers} icon="✅" color="green" />
        <StatCard title="Active Queues" value={stats.totalQueues} icon="📋" color="yellow" />
        <StatCard title="System Uptime" value={stats.systemUptime} icon="🟢" color="green" />
      </div>

      {/* User Management */}
      <AdminCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <Button onClick={handleAddUser} variant="primary">
            Add New User
          </Button>
        </div>
        
        <DataTable
          data={users}
          columns={userColumns}
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No users found"
        />
      </AdminCard>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <Form onSubmit={handleSaveUser}>
          <FormField
            label="Full Name"
            type="text"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
          
          <FormField
            label="Email Address"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
          
          <FormField
            label="Role"
            type="select"
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            required
          >
            <option value="user">User</option>
            <option value="registrar_admin">Registrar Admin</option>
            <option value="admissions_admin">Admissions Admin</option>
            <option value="super_admin">Super Admin</option>
          </FormField>
          
          <FormField
            label="Department"
            type="select"
            value={userForm.department}
            onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
            required
          >
            <option value="">Select Department</option>
            <option value="mis">MIS</option>
            <option value="registrar">Registrar</option>
            <option value="admissions">Admissions</option>
          </FormField>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={userForm.isActive}
              onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active User
            </label>
          </div>
          
          <FormActions>
            <Button type="button" variant="secondary" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </div>
  );
};

export default MISAdminDashboard;
