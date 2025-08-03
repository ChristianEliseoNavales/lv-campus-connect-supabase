import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from './layouts';

const MISAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const fetchTimeoutRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const roles = [
    { value: 'registrar_admin', label: 'Registrar Admin', department: 'registrar' },
    { value: 'admissions_admin', label: 'Admissions Admin', department: 'admissions' },
    { value: 'super_admin', label: 'MIS Super Admin', department: 'mis' }
  ];

  // Define fetchUsers function before it's used in useEffect
  const fetchUsers = useCallback(async () => {
    // Clear any existing timeout to prevent multiple simultaneous requests
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Debounce the request by 300ms
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${API_URL}/api/admin/users`);
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Check if user has super admin access
  useEffect(() => {
    if (user && !hasRole('super_admin')) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, hasRole, navigate]);

  useEffect(() => {
    if (user && hasRole('super_admin')) {
      fetchUsers();
    }
  }, [user, hasRole, fetchUsers]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-set department based on role
      ...(name === 'role' && {
        department: roles.find(r => r.value === value)?.department || ''
      })
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    if (!editingUser && !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!editingUser && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Check for duplicate email
    const existingUser = users.find(user => 
      user.email === formData.email && user.id !== editingUser?.id
    );
    if (existingUser) {
      errors.email = 'Email already exists';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department,
        role: formData.role,
        ...(formData.password && { password: formData.password })
      };

      if (editingUser) {
        await axios.put(`http://localhost:3001/api/admin/users/${editingUser.id}`, userData);
      } else {
        await axios.post('http://localhost:3001/api/admin/users', userData);
      }
      
      await fetchUsers();
      resetForm();
      
    } catch (error) {
      console.error('Error saving user:', error);
      setFormErrors({ submit: 'Failed to save user. Please try again.' });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      password: ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${userId}`);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      password: ''
    });
    setFormErrors({});
    setShowCreateForm(false);
    setEditingUser(null);
  };

  const getRoleLabel = (role) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  const getDepartmentColorClass = (department) => {
    switch (department) {
      case 'registrar': return 'bg-blue-600';
      case 'admissions': return 'bg-red-600';
      case 'mis': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  // Show loading while checking user access
  if (!user || !hasRole('super_admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="MIS Super Admin Dashboard"
      subtitle="User Account Management"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
        >
          ➕ Create New User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-3xl border border-white/30 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">{editingUser ? 'Edit User' : 'Create New User'}</h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              >
                ✕
              </button>
            </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white border ${
                      formErrors.name ? 'border-red-400' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white border ${
                      formErrors.email ? 'border-red-400' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white border ${
                      formErrors.role ? 'border-red-400' : 'border-gray-300'
                    } text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
                  >
                    <option value="" className="bg-white text-gray-900">Select a role</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value} className="bg-white text-gray-900">
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && <span className="text-red-500 text-sm">{formErrors.role}</span>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white border ${
                      formErrors.password ? 'border-red-400' : 'border-gray-300'
                    } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300`}
                    placeholder={editingUser ? "Enter new password" : "Enter password"}
                  />
                  {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>}
                </div>

                {formErrors.submit && (
                  <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {formErrors.submit}
                  </div>
                )}

                <div className="md:col-span-2 flex gap-4 justify-end pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-600">
                    No users found. Create your first user account.
                  </td>
                </tr>
              ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        text-white font-bold text-sm ${getDepartmentColorClass(user.department)}
                      `}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'super_admin' ? 'bg-emerald-100 text-emerald-800' :
                        user.role === 'registrar_admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex px-3 py-1 rounded-full text-xs font-medium
                        text-white ${getDepartmentColorClass(user.department)}
                      `}>
                        {user.department.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-300 hover:scale-105"
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User"
                          disabled={user.role === 'super_admin' && users.filter(u => u.role === 'super_admin').length === 1}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Total Users</h3>
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Registrar Admins</h3>
          <div className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === 'registrar_admin').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Admissions Admins</h3>
          <div className="text-3xl font-bold text-red-600">
            {users.filter(u => u.role === 'admissions_admin').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">Super Admins</h3>
          <div className="text-3xl font-bold text-emerald-600">
            {users.filter(u => u.role === 'super_admin').length}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MISAdminDashboard;
