import React, { useState } from 'react';
import { MdAdd, MdLocationOn, MdClose } from 'react-icons/md';
import { AiOutlineEye, AiOutlineMinusCircle } from 'react-icons/ai';
import { LuSettings2 } from 'react-icons/lu';

// Add/Edit Window Modal Component - Moved outside to prevent re-creation on every render
const AddEditWindowModal = ({
  isOpen,
  onClose,
  windowFormData,
  onFormChange,
  onSave,
  services,
  adminEmails,
  isEditing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-[#1F3463] border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-colors"
          >
            <MdClose className="w-4 h-4" />
          </button>

          {/* Row 1: Header */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Adjusting Windows
            </h3>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Row 2: Window Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Name for Window
              </label>
              <input
                type="text"
                value={windowFormData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter window name"
              />
            </div>

            {/* Row 3: Service */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Service
              </label>
              <select
                value={windowFormData.serviceName}
                onChange={(e) => onFormChange('serviceName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4: Assign */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Assign
              </label>
              <select
                value={windowFormData.adminEmail}
                onChange={(e) => onFormChange('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an admin</option>
                {adminEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 5: Save Button */}
            <button
              onClick={onSave}
              className="w-full flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1F3463' }}
            >
              <span className="font-medium">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Service Modal Component - Moved outside to prevent re-creation on every render
const AddServiceModal = ({
  isOpen,
  onClose,
  serviceFormData,
  onFormChange,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-[#1F3463] border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-colors"
          >
            <MdClose className="w-4 h-4" />
          </button>

          {/* Row 1: Header */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Adding Service
            </h3>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Row 2: Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Name of the Service
              </label>
              <input
                type="text"
                value={serviceFormData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter service name"
              />
            </div>

            {/* Row 3: Save Button */}
            <button
              onClick={onSave}
              className="w-full flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1F3463' }}
            >
              <span className="font-medium">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [isQueueingEnabled, setIsQueueingEnabled] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [services, setServices] = useState([
    { id: 1, name: 'Enrollment' },
    { id: 2, name: 'Transcript Request' },
    { id: 3, name: 'Certificate Request' },
    { id: 4, name: 'Grade Inquiry' },
    { id: 5, name: 'Schedule Consultation' }
  ]);
  const [windows, setWindows] = useState([
    {
      id: 1,
      name: 'Window 1',
      serviceName: 'Enrollment',
      adminEmail: 'admin1@lvcampusconnect.edu'
    },
    {
      id: 2,
      name: 'Window 2',
      serviceName: 'Transcript Request',
      adminEmail: 'admin2@lvcampusconnect.edu'
    },
    {
      id: 3,
      name: 'Window 3',
      serviceName: 'Certificate Request',
      adminEmail: 'admin3@lvcampusconnect.edu'
    }
  ]);

  // Modal states
  const [showAddEditWindowModal, setShowAddEditWindowModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState(null);

  // Form states for Add/Edit Window Modal
  const [windowFormData, setWindowFormData] = useState({
    name: '',
    serviceName: '',
    adminEmail: ''
  });

  // Form state for Add Service Modal
  const [serviceFormData, setServiceFormData] = useState({
    name: ''
  });

  // Mock admin emails for dropdown
  const adminEmails = [
    'admin1@lvcampusconnect.edu',
    'admin2@lvcampusconnect.edu',
    'admin3@lvcampusconnect.edu',
    'registrar.admin@lvcampusconnect.edu',
    'window.manager@lvcampusconnect.edu'
  ];

  const handleToggleQueueing = () => {
    setIsQueueingEnabled(!isQueueingEnabled);
  };

  // Modal handlers
  const openAddWindowModal = () => {
    setEditingWindow(null);
    setWindowFormData({ name: '', serviceName: '', adminEmail: '' });
    setShowAddEditWindowModal(true);
  };

  const openEditWindowModal = (window) => {
    setEditingWindow(window);
    setWindowFormData({
      name: window.name,
      serviceName: window.serviceName,
      adminEmail: window.adminEmail
    });
    setShowAddEditWindowModal(true);
  };

  const closeAddEditWindowModal = () => {
    setShowAddEditWindowModal(false);
    setEditingWindow(null);
    setWindowFormData({ name: '', serviceName: '', adminEmail: '' });
  };

  const openAddServiceModal = () => {
    setServiceFormData({ name: '' });
    setShowAddServiceModal(true);
  };

  const closeAddServiceModal = () => {
    setShowAddServiceModal(false);
    setServiceFormData({ name: '' });
  };

  // Form handlers
  const handleWindowFormChange = (field, value) => {
    setWindowFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceFormChange = (field, value) => {
    setServiceFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveWindow = () => {
    if (!windowFormData.name.trim() || !windowFormData.serviceName || !windowFormData.adminEmail) {
      alert('Please fill in all fields');
      return;
    }

    if (editingWindow) {
      // Edit existing window
      setWindows(prev => prev.map(window =>
        window.id === editingWindow.id
          ? { ...window, ...windowFormData }
          : window
      ));
    } else {
      // Add new window
      const newWindow = {
        id: Date.now(),
        ...windowFormData
      };
      setWindows(prev => [...prev, newWindow]);
    }

    closeAddEditWindowModal();
  };

  const handleSaveService = () => {
    if (!serviceFormData.name.trim()) {
      alert('Please enter a service name');
      return;
    }

    const newService = {
      id: Date.now(),
      name: serviceFormData.name.trim()
    };
    setServices(prev => [...prev, newService]);
    closeAddServiceModal();
  };

  const handleAddService = () => {
    openAddServiceModal();
  };

  const handleViewService = (serviceId) => {
    console.log('View service:', serviceId);
  };

  const handleRemoveService = (serviceId) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleViewWindow = (windowId) => {
    console.log('View window:', windowId);
  };

  const handleConfigureWindow = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      openEditWindowModal(window);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Management Grid Container - with visible background, rounded corners, and padding */}
      <div className="grid gap-4 h-[calc(100vh-12rem)] bg-white p-6 border border-gray-200" style={{ gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 1fr 1fr' }}>
        {/* First div: Row 1, spanning both columns */}
        <div className="col-span-2 row-span-1 bg-white rounded-xl p-6 flex items-center">
          <h1 className="text-4xl font-semibold text-gray-900">Settings Management</h1>
        </div>

        {/* Second div: Row 2, Column 1 only - Toggle Section */}
        <div className="col-span-1 row-span-1 bg-white rounded-xl border border-gray-300 shadow-md p-6 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Tap to Enable Queueing</span>
          <button
            onClick={handleToggleQueueing}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none  ${
              isQueueingEnabled ? 'bg-[#1F3463]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isQueueingEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Third div: Column 1, spanning rows 3-4 - Services Section */}
        <div className="col-span-1 row-span-2 bg-white rounded-xl border border-gray-300 shadow-md p-6 flex flex-col">
          {/* Row 1: Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Services</h2>
          </div>

          {/* Row 2: Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-900 font-medium">{service.name}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewService(service.id)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Service"
                  >
                    <AiOutlineEye className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleRemoveService(service.id)}
                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Service"
                  >
                    <AiOutlineMinusCircle className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Add Button */}
          <button
            onClick={handleAddService}
            className="flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#1F3463' }}
          >
            <MdAdd className="text-xl" />
            <span className="font-medium">Add Service</span>
          </button>
        </div>

        {/* Fourth div: Column 2, spanning rows 2-4 - Windows Management Section */}
        <div className="col-start-2 row-start-2 row-span-3 bg-white rounded-xl border border-gray-300 shadow-md p-6 flex flex-col">
          {/* Row 1: Table Header */}
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4 items-center p-3">
              <div className="font-semibold text-gray-900">Window</div>
              <div className="font-semibold text-gray-900">Service & Admin</div>
              <div className="relative">
                <div className="relative flex items-center">
                  <MdLocationOn className="absolute left-3 text-gray-500 text-lg z-10" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search location..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    style={{ backgroundColor: '#efefef' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rows 2-5: Container for displaying added windows - Fixed height for exactly 4 windows */}
          <div className="flex-1 flex flex-col space-y-3" style={{ height: 'calc(100% - 4rem)' }}>
            {windows.slice(0, 4).map((window) => (
              <div
                key={window.id}
                className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
                style={{ height: 'calc((100% - 0.75rem * 3) / 4)' }}
              >
                {/* Column 1: Window name */}
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{window.name}</span>
                </div>

                {/* Column 2: Split into 2 rows */}
                <div className="flex flex-col justify-center space-y-1">
                  {/* Row 1: Service name */}
                  <div className="font-medium text-gray-900">{window.serviceName}</div>
                  {/* Row 2: Admin user email */}
                  <div className="text-sm text-gray-600">{window.adminEmail}</div>
                </div>

                {/* Column 3: Two React Icons side-by-side */}
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => handleViewWindow(window.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Window"
                  >
                    <AiOutlineEye className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleConfigureWindow(window.id)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Configure Window"
                  >
                    <LuSettings2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}

            {/* Fill remaining slots with clickable add buttons if fewer than 4 windows */}
            {Array.from({ length: Math.max(0, 4 - windows.length) }).map((_, index) => (
              <button
                key={`placeholder-${index}`}
                onClick={openAddWindowModal}
                className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0 hover:border-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                style={{ height: 'calc((100% - 0.75rem * 3) / 4)' }}
              >
                <span className="text-sm">Available Window Slot</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEditWindowModal
        isOpen={showAddEditWindowModal}
        onClose={closeAddEditWindowModal}
        windowFormData={windowFormData}
        onFormChange={handleWindowFormChange}
        onSave={handleSaveWindow}
        services={services}
        adminEmails={adminEmails}
        isEditing={!!editingWindow}
      />
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={closeAddServiceModal}
        serviceFormData={serviceFormData}
        onFormChange={handleServiceFormChange}
        onSave={handleSaveService}
      />
    </div>
  );
};

export default Settings;

