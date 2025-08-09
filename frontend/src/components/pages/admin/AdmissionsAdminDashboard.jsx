import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AdminCard, StatCard, DataTable, Button, StatusBadge, Modal, Form, FormField, FormActions } from '../../ui';

const AdmissionsAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    queueLength: 0,
    servedToday: 0,
    pendingApplications: 0,
    avgProcessingTime: '0 min'
  });
  const [queue, setQueue] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchAdmissionsData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAdmissionsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdmissionsData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats = {
        queueLength: 5,
        servedToday: 12,
        pendingApplications: 47,
        avgProcessingTime: '8 min'
      };

      const mockQueue = [
        {
          id: 1,
          queueNumber: 15,
          name: 'Sarah Wilson',
          contactNumber: '09123456789',
          service: 'Application Inquiry',
          priority: 'normal',
          timestamp: new Date('2024-01-15T11:00:00'),
          status: 'waiting'
        },
        {
          id: 2,
          queueNumber: 16,
          name: 'Tom Davis',
          contactNumber: '09987654321',
          service: 'Document Submission',
          priority: 'urgent',
          timestamp: new Date('2024-01-15T11:05:00'),
          status: 'waiting'
        },
        {
          id: 3,
          queueNumber: 17,
          name: 'Lisa Chen',
          contactNumber: '09555666777',
          service: 'Interview Schedule',
          priority: 'normal',
          timestamp: new Date('2024-01-15T11:10:00'),
          status: 'waiting'
        }
      ];

      const mockApplications = [
        {
          id: 1,
          applicationId: 'APP-2024-001',
          studentName: 'John Martinez',
          program: 'Computer Science',
          status: 'pending_review',
          submittedDate: new Date('2024-01-10T00:00:00'),
          lastUpdated: new Date('2024-01-14T00:00:00'),
          priority: 'normal'
        },
        {
          id: 2,
          applicationId: 'APP-2024-002',
          studentName: 'Emma Thompson',
          program: 'Business Administration',
          status: 'approved',
          submittedDate: new Date('2024-01-08T00:00:00'),
          lastUpdated: new Date('2024-01-15T00:00:00'),
          priority: 'normal'
        },
        {
          id: 3,
          applicationId: 'APP-2024-003',
          studentName: 'Michael Brown',
          program: 'Engineering',
          status: 'requires_documents',
          submittedDate: new Date('2024-01-12T00:00:00'),
          lastUpdated: new Date('2024-01-13T00:00:00'),
          priority: 'urgent'
        }
      ];

      setStats(mockStats);
      setQueue(mockQueue);
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching admissions data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallNext = () => {
    setShowCallModal(true);
  };

  const handleConfirmCall = async () => {
    try {
      if (queue.length === 0) return;
      
      const nextInQueue = queue[0];
      const updatedQueue = queue.slice(1);
      
      setQueue(updatedQueue);
      setStats(prev => ({ 
        ...prev, 
        queueLength: prev.queueLength - 1, 
        servedToday: prev.servedToday + 1 
      }));
      setShowCallModal(false);
    } catch (error) {
      console.error('Error calling next number:', error);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const updatedApplications = applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, lastUpdated: new Date() }
          : app
      );
      setApplications(updatedApplications);
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Error updating application status:', error);
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

  const applicationColumns = [
    {
      key: 'applicationId',
      label: 'Application ID',
      render: (value) => (
        <span className="font-mono text-sm text-gray-700">{value}</span>
      )
    },
    {
      key: 'studentName',
      label: 'Student',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.program}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusMap = {
          pending_review: 'pending',
          approved: 'completed',
          requires_documents: 'warning',
          rejected: 'cancelled'
        };
        return <StatusBadge status={statusMap[value] || 'pending'} />;
      }
    },
    {
      key: 'submittedDate',
      label: 'Submitted',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, application) => (
        <Button
          onClick={() => handleViewApplication(application)}
          variant="primary"
          size="sm"
        >
          View
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admissions dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admissions Administration Dashboard
        </h1>
        <p className="text-gray-600">
          Manage admissions queue, applications, and student inquiries efficiently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Queue Length" value={stats.queueLength} icon="🎓" color="blue" />
        <StatCard title="Served Today" value={stats.servedToday} icon="✅" color="green" />
        <StatCard title="Pending Applications" value={stats.pendingApplications} icon="📄" color="yellow" />
        <StatCard title="Avg Processing Time" value={stats.avgProcessingTime} icon="⏱️" color="gray" />
      </div>

      {/* Queue Management */}
      <AdminCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Queue</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {queue.length} people waiting
            </div>
            {queue.length > 0 && (
              <Button onClick={handleCallNext} variant="primary">
                Call Next
              </Button>
            )}
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

      {/* Applications Management */}
      <AdminCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <div className="text-sm text-gray-500">
            {applications.filter(app => app.status === 'pending_review').length} pending review
          </div>
        </div>
        
        <DataTable
          data={applications}
          columns={applicationColumns}
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No applications found"
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

      {/* Application Details Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Application Details"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Application ID</label>
                <p className="text-gray-900 font-mono">{selectedApplication.applicationId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <p className="text-gray-900">{selectedApplication.studentName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Program</label>
                <p className="text-gray-900">{selectedApplication.program}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Status</label>
                <StatusBadge 
                  status={
                    selectedApplication.status === 'pending_review' ? 'pending' :
                    selectedApplication.status === 'approved' ? 'completed' :
                    selectedApplication.status === 'requires_documents' ? 'warning' : 'cancelled'
                  } 
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'approved')}
                  variant="success"
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'requires_documents')}
                  variant="warning"
                  size="sm"
                >
                  Request Documents
                </Button>
                <Button
                  onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'rejected')}
                  variant="danger"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdmissionsAdminDashboard;
