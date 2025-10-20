import React, { useState, useEffect } from 'react';
import { MdAdd, MdLocationOn, MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMinusCircle } from 'react-icons/ai';
import { LuSettings2 } from 'react-icons/lu';
import { io } from 'socket.io-client';
import { useToast, ToastContainer, ConfirmModal } from '../../../ui';

// Location options for the autocomplete dropdown
const LOCATION_OPTIONS = [
  'EFS 101', 'EFS 102', 'EFS 103', 'EFS 104', 'EFS 105', 'EFS 106', 'EFS 107', 'EFS 108', 'EFS 109', 'EFS 110',
  'EFS 201', 'EFS 202', 'EFS 203', 'EFS 204', 'EFS 205', 'EFS 206', 'EFS 207', 'EFS 208', 'EFS 209', 'EFS 210',
  'EFS 301', 'EFS 302', 'EFS 303', 'EFS 304', 'EFS 305', 'EFS 306', 'EFS 307', 'EFS 308', 'EFS 309', 'EFS 310',
  'EFS 401', 'EFS 402', 'EFS 403', 'EFS 404', 'EFS 405', 'EFS 406', 'EFS 407', 'EFS 408', 'EFS 409', 'EFS 410',
  'DSR 101', 'DSR 102', 'DSR 103', 'DSR 104', 'DSR 105', 'DSR 106', 'DSR 107', 'DSR 108', 'DSR 109', 'DSR 110',
  'DSR 201', 'DSR 202', 'DSR 203', 'DSR 204', 'DSR 205', 'DSR 206', 'DSR 207', 'DSR 208', 'DSR 209', 'DSR 210',
  'DSR 301', 'DSR 302', 'DSR 303', 'DSR 304', 'DSR 305', 'DSR 306', 'DSR 307', 'DSR 308', 'DSR 309', 'DSR 310',
  'DSR 401', 'DSR 402', 'DSR 403', 'DSR 404', 'DSR 405', 'DSR 406', 'DSR 407', 'DSR 408', 'DSR 409', 'DSR 410',
  'COMLAB A', 'COMLAB B', 'Physics Room', 'IC Room'
];

// Service Display Component with Tooltip
const ServiceDisplay = ({ services, totalServices, isPriority = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getDisplayText = () => {
    if (!services || services.length === 0) {
      return 'No services assigned';
    }

    // If priority window or all services assigned
    if (isPriority || services.length === totalServices) {
      return 'All';
    }

    // If 1 service only, display normally
    if (services.length === 1) {
      return services[0]?.name || 'Unknown Service';
    }

    // If 2+ services, show first service and count
    const firstName = services[0]?.name || 'Unknown Service';
    const remaining = services.length - 1;
    return `${firstName} and ${remaining} more`;
  };

  const getAllServicesText = () => {
    if (!services || services.length === 0) {
      return 'No services assigned';
    }
    return services.map(service => service?.name || 'Unknown Service').join(', ');
  };

  return (
    <div className="relative">
      <div
        className="font-medium text-gray-900 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {getDisplayText()}
      </div>

      {/* Tooltip */}
      {showTooltip && services && services.length > 0 && (
        <div
          className="fixed z-50 bg-[#1F3463] text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs break-words pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium mb-1">Assigned Services:</div>
          <div>{getAllServicesText()}</div>
          {/* Arrow */}
          <div
            className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1F3463]"
          />
        </div>
      )}
    </div>
  );
};

// Location Autocomplete Component
const LocationAutocomplete = ({
  value,
  onChange,
  onSave,
  disabled,
  isUpdating,
  placeholder = "Enter department location..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Filter options based on input
  useEffect(() => {
    if (value.trim()) {
      const filtered = LOCATION_OPTIONS.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.trim().length > 0);
  };

  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (value.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow option selection
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSave();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <MdLocationOn className="absolute left-3 text-gray-500 text-lg z-10" />
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={`w-full pl-10 pr-8 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: disabled ? '#f3f4f6' : '#efefef' }}
          disabled={disabled || isUpdating}
        />
        {!disabled && filteredOptions.length > 0 && (
          <MdKeyboardArrowDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}

        {/* Dropdown */}
        {isOpen && filteredOptions.length > 0 && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save Button - Positioned outside on the right */}
      <button
        onClick={onSave}
        disabled={isUpdating || !value.trim() || disabled}
        className={`ml-3 px-4 py-2 text-sm rounded-full transition-colors ${
          isUpdating || !value.trim() || disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#1F3463] text-white hover:opacity-90'
        }`}
      >
        {isUpdating ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

// Add/Edit Window Modal Component - Moved outside to prevent re-creation on every render
const AddEditWindowModal = ({
  isOpen,
  onClose,
  windowFormData,
  onFormChange,
  onSave,
  services,
  windows,
  adminUsers,
  adminUsersLoading,
  isEditing,
  onRemove,
  errors = {}
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
                disabled={windowFormData.isPriority}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  windowFormData.isPriority
                    ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                    : errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter window name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Priority Checkbox */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={windowFormData.isPriority}
                  onChange={(e) => onFormChange('isPriority', e.target.checked)}
                  className="w-4 h-4 text-[#1F3463] border-gray-300 rounded focus:ring-[#1F3463] focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  Set as Priority
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Priority windows automatically serve all services and handle PWD/Senior Citizen queues
              </p>
            </div>

            {/* Row 3: Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Services <span className="text-red-500">*</span>
                {windowFormData.isPriority && (
                  <span className="ml-2 text-xs text-gray-500">(All services auto-assigned for Priority window)</span>
                )}
              </label>
              <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto ${
                windowFormData.isPriority
                  ? 'bg-gray-50 border-gray-300'
                  : errors.serviceIds
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}>
                {windowFormData.isPriority ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 font-medium">All Services Assigned</p>
                    <p className="text-xs text-gray-500 mt-1">Priority windows automatically handle all available services</p>
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-gray-500 text-sm">No services available</p>
                ) : (
                  <div className="space-y-2">
                    {(services || []).map((service) => {
                      // Check if service is assigned to another window (excluding current window being edited)
                      const assignedToOtherWindow = (windows || []).find(window => {
                        // Skip the current window being edited
                        if (isEditing && window.id === windowFormData.id) return false;

                        return window.serviceIds && window.serviceIds.some(s =>
                          (s._id === service.id || s === service.id)
                        );
                      });

                      const isCurrentlyAssigned = windowFormData.serviceIds.includes(service.id);
                      const isDisabled = assignedToOtherWindow && !isCurrentlyAssigned;

                      return (
                        <label key={service.id} className={`flex items-center space-x-2 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={isCurrentlyAssigned}
                            disabled={isDisabled}
                            onChange={(e) => {
                              const currentServices = windowFormData.serviceIds;
                              if (e.target.checked) {
                                onFormChange('serviceIds', [...currentServices, service.id]);
                              } else {
                                onFormChange('serviceIds', currentServices.filter(id => id !== service.id));
                              }
                            }}
                            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <div className="flex items-center space-x-2 flex-1">
                            <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                              {service.name}
                            </span>
                            {assignedToOtherWindow && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Assigned to {assignedToOtherWindow.name}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.serviceIds && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceIds}</p>
              )}
            </div>

            {/* Row 4: Assigned Admin */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Assigned Admin <span className="text-red-500">*</span>
              </label>
              <select
                value={windowFormData.assignedAdmin}
                onChange={(e) => onFormChange('assignedAdmin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.assignedAdmin
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={adminUsersLoading}
              >
                <option value="">
                  {adminUsersLoading ? 'Loading admins...' : 'Select an admin'}
                </option>
                {(adminUsers || []).map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
              {errors.assignedAdmin && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedAdmin}</p>
              )}
            </div>

            {/* Row 5: Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onSave}
                className="flex-1 flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1F3463' }}
              >
                <span className="font-medium">Save</span>
              </button>
              {isEditing && onRemove && (
                <button
                  onClick={onRemove}
                  className="flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-700"
                >
                  <span className="font-medium">Remove</span>
                </button>
              )}
            </div>
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
  onSave,
  errors = {}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter service name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
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
  // State management
  const [isQueueingEnabled, setIsQueueingEnabled] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [windowLocationSearch, setWindowLocationSearch] = useState(''); // For window-specific location search
  const [services, setServices] = useState([]);
  const [windows, setWindows] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Toggle queueing state management
  const [isToggling, setIsToggling] = useState(false);
  const [toggleCooldown, setToggleCooldown] = useState(0);

  // Location update state management
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join admin room for real-time updates
    newSocket.emit('join-room', 'admin-registrar');

    // Listen for real-time updates
    newSocket.on('settings-updated', (data) => {
      if (data.department === 'registrar' && data.type === 'queue-toggle') {
        setIsQueueingEnabled(data.data.isEnabled);
        showSuccess(
          'Queue System Updated',
          `Queue system has been ${data.data.isEnabled ? 'enabled' : 'disabled'}`
        );
      }
    });

    newSocket.on('services-updated', (data) => {
      if (data.department === 'registrar') {
        fetchServices();
        if (data.type === 'service-added') {
          showSuccess('Service Added', `${data.data.name} has been added`);
        } else if (data.type === 'service-deleted') {
          showSuccess('Service Removed', 'Service has been removed');
        }
      }
    });

    newSocket.on('windows-updated', (data) => {
      if (data.department === 'registrar') {
        fetchWindows();
        if (data.type === 'window-added') {
          showSuccess('Window Added', `${data.data.name} has been added`);
        } else if (data.type === 'window-deleted') {
          showSuccess('Window Removed', 'Window has been removed');
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  // API functions
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchQueueSettings(),
        fetchServices(),
        fetchWindows(),
        fetchAdminUsers(),
        fetchLocationSettings()
      ]);
    } catch (error) {
      showError('Error', 'Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/queue/registrar');
      if (response.ok) {
        const data = await response.json();
        setIsQueueingEnabled(data.isEnabled);
      }
    } catch (error) {
      console.error('Error fetching queue settings:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services/registrar');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchWindows = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/windows/registrar');
      if (response.ok) {
        const data = await response.json();
        setWindows(data);
      }
    } catch (error) {
      console.error('Error fetching windows:', error);
    }
  };

  // Modal states
  const [showAddEditWindowModal, setShowAddEditWindowModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState(null);

  // Form states for Add/Edit Window Modal
  const [windowFormData, setWindowFormData] = useState({
    name: '',
    serviceIds: [],
    assignedAdmin: '',
    isPriority: false
  });

  // Form state for Add Service Modal
  const [serviceFormData, setServiceFormData] = useState({
    name: ''
  });

  // Error states for form validation
  const [windowErrors, setWindowErrors] = useState({});
  const [serviceErrors, setServiceErrors] = useState({});

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  // Fetch admin users for dropdown
  const fetchAdminUsers = async () => {
    try {
      setAdminUsersLoading(true);
      const response = await fetch('http://localhost:5000/api/users/by-role/registrar_admin');
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      } else {
        console.error('Failed to fetch admin users');
        showError('Error', 'Failed to load admin users');
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      showError('Error', 'Failed to load admin users');
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const fetchLocationSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/location/registrar');
      if (response.ok) {
        const data = await response.json();
        setLocationText(data.location || '');
      }
    } catch (error) {
      console.error('Error fetching location settings:', error);
    }
  };

  const handleToggleQueueing = async () => {
    // Prevent multiple rapid toggles
    if (isToggling || toggleCooldown > 0) {
      showWarning('Please Wait', 'Toggle operation in progress. Please wait before trying again.');
      return;
    }

    try {
      setIsToggling(true);
      const newState = !isQueueingEnabled;

      const response = await fetch('http://localhost:5000/api/settings/queue/registrar/toggle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isEnabled: newState }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsQueueingEnabled(data.isEnabled);
        showSuccess(
          'Queue System Updated',
          `Queue system has been ${data.isEnabled ? 'enabled' : 'disabled'}`
        );

        // Set cooldown period to prevent rapid toggles
        setToggleCooldown(3); // 3 second cooldown
        const cooldownInterval = setInterval(() => {
          setToggleCooldown(prev => {
            if (prev <= 1) {
              clearInterval(cooldownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        throw new Error('Failed to update queue system');
      }
    } catch (error) {
      showError('Error', 'Failed to update queue system');
      console.error('Error toggling queue system:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (isUpdatingLocation || !locationText.trim()) {
      return;
    }

    try {
      setIsUpdatingLocation(true);
      const response = await fetch('http://localhost:5000/api/settings/location/registrar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: locationText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocationText(data.location);
        showSuccess('Location Updated', 'Department location has been updated successfully');
      } else {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      showError('Error', 'Failed to update location');
      console.error('Error updating location:', error);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Modal handlers
  const openAddWindowModal = () => {
    if (isQueueingEnabled) {
      showError('Settings Locked', 'Cannot modify windows while queueing is active. Please disable queueing first.');
      return;
    }
    setEditingWindow(null);
    setWindowLocationSearch('');
    setWindowFormData({ name: '', serviceIds: [], assignedAdmin: '', isPriority: false });
    setWindowErrors({});
    setShowAddEditWindowModal(true);
  };

  const openEditWindowModal = (window) => {
    if (isQueueingEnabled) {
      showError('Settings Locked', 'Cannot modify windows while queueing is active. Please disable queueing first.');
      return;
    }
    setEditingWindow(window);
    setWindowLocationSearch(window.location || '');
    setWindowFormData({
      id: window.id,
      name: window.name,
      serviceIds: (window.serviceIds || []).map(s => s._id || s),
      assignedAdmin: window.assignedAdmin?._id || window.assignedAdmin || '',
      isPriority: window.name === 'Priority' || false
    });
    setWindowErrors({});
    setShowAddEditWindowModal(true);
  };

  const closeAddEditWindowModal = () => {
    setShowAddEditWindowModal(false);
    setEditingWindow(null);
    setWindowLocationSearch('');
    setWindowFormData({ name: '', serviceIds: [], assignedAdmin: '', isPriority: false });
    setWindowErrors({});
  };

  const openAddServiceModal = () => {
    setServiceFormData({ name: '' });
    setServiceErrors({});
    setShowAddServiceModal(true);
  };

  const closeAddServiceModal = () => {
    setShowAddServiceModal(false);
    setServiceFormData({ name: '' });
    setServiceErrors({});
  };

  // Form handlers
  const handleWindowFormChange = (field, value) => {
    if (field === 'isPriority') {
      if (value) {
        // When priority is checked, set name to "Priority" and assign all services
        const allServiceIds = services.map(service => service.id);
        setWindowFormData(prev => ({
          ...prev,
          [field]: value,
          name: 'Priority',
          serviceIds: allServiceIds
        }));
      } else {
        // When priority is unchecked, clear name and services
        setWindowFormData(prev => ({
          ...prev,
          [field]: value,
          name: '',
          serviceIds: []
        }));
      }
    } else {
      setWindowFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error for this field when user starts typing
    if (windowErrors[field]) {
      setWindowErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceFormChange = (field, value) => {
    setServiceFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (serviceErrors[field]) {
      setServiceErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveWindow = async () => {
    // Validate form and set inline errors
    const errors = {};

    if (!windowFormData.name?.trim()) {
      errors.name = 'Window name is required';
    }

    if (!windowFormData.serviceIds || windowFormData.serviceIds.length === 0) {
      errors.serviceIds = 'Please select at least one service';
    }

    if (!windowFormData.assignedAdmin) {
      errors.assignedAdmin = 'Please select an admin';
    }

    // Check for duplicate window names (case-insensitive)
    const windowName = windowFormData.name?.trim();
    if (windowName) {
      const isDuplicateName = windows.some(window =>
        window.name.toLowerCase() === windowName.toLowerCase() &&
        (!editingWindow || window.id !== editingWindow.id)
      );

      if (isDuplicateName) {
        errors.name = `Window '${windowName}' already exists. Please use a different name.`;
      }
    }

    // If there are errors, set them and show toast
    if (Object.keys(errors).length > 0) {
      setWindowErrors(errors);
      showError('Validation Error', 'Please fix the errors below and try again');
      return;
    }

    // Clear any existing errors
    setWindowErrors({});

    // No need to check for duplicate service assignments since each window has only one service

    try {
      if (editingWindow) {
        // Edit existing window
        const response = await fetch(`http://localhost:5000/api/windows/${editingWindow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: windowFormData.name.trim(),
            serviceIds: windowFormData.serviceIds,
            assignedAdmin: windowFormData.assignedAdmin
          }),
        });

        if (response.ok) {
          const updatedWindow = await response.json();
          setWindows(prev => prev.map(window =>
            window.id === editingWindow.id ? updatedWindow : window
          ));
          showSuccess('Window Updated', `${updatedWindow.name} has been updated successfully`);
        } else {
          throw new Error('Failed to update window');
        }
      } else {
        // Add new window
        const response = await fetch('http://localhost:5000/api/windows', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: windowFormData.name.trim(),
            department: 'registrar',
            serviceIds: windowFormData.serviceIds,
            assignedAdmin: windowFormData.assignedAdmin
          }),
        });

        if (response.ok) {
          const newWindow = await response.json();
          setWindows(prev => [...prev, newWindow]);
          showSuccess('Window Added', `${newWindow.name} has been added successfully`);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add window');
        }
      }

      closeAddEditWindowModal();
    } catch (error) {
      showError('Error', error.message);
      console.error('Error saving window:', error);
    }
  };

  const handleSaveService = async () => {
    // Validate form and set inline errors
    const errors = {};

    if (!serviceFormData.name?.trim()) {
      errors.name = 'Service name is required';
    }

    // Check for duplicate service names (case-insensitive)
    const serviceName = serviceFormData.name?.trim();
    if (serviceName) {
      const isDuplicate = services.some(service =>
        service.name.toLowerCase() === serviceName.toLowerCase()
      );

      if (isDuplicate) {
        errors.name = `Service '${serviceName}' already exists. Please use a different name.`;
      }
    }

    // If there are errors, set them and show toast
    if (Object.keys(errors).length > 0) {
      setServiceErrors(errors);
      showError('Validation Error', 'Please fix the errors below and try again');
      return;
    }

    // Clear any existing errors
    setServiceErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: serviceName,
          department: 'registrar'
        }),
      });

      if (response.ok) {
        const newService = await response.json();
        setServices(prev => [...prev, newService]);
        closeAddServiceModal();
        showSuccess('Service Added', `${newService.name} has been added successfully`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add service');
      }
    } catch (error) {
      showError('Error', error.message);
      console.error('Error adding service:', error);
    }
  };

  const handleAddService = () => {
    if (isQueueingEnabled) {
      showError('Settings Locked', 'Cannot modify services while queueing is active. Please disable queueing first.');
      return;
    }
    openAddServiceModal();
  };

  const handleToggleServiceVisibility = async (serviceId, currentActive) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices(prev => prev.map(service =>
          service.id === serviceId ? updatedService : service
        ));
        showSuccess(
          'Service Updated',
          `${updatedService.name} is now ${updatedService.isActive ? 'active' : 'inactive'}`
        );
      } else {
        throw new Error('Failed to update service status');
      }
    } catch (error) {
      showError('Error', 'Failed to update service status');
      console.error('Error toggling service status:', error);
    }
  };

  const handleRemoveService = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    // Check if service is assigned to any windows
    const assignedWindows = (windows || []).filter(window =>
      window && window.serviceIds && window.serviceIds.some(s => s._id === serviceId || s === serviceId)
    );

    if (assignedWindows.length > 0) {
      // Show warning toast with assigned windows
      const windowNames = assignedWindows.map(w => w.name || 'Unnamed Window').join(', ');
      showWarning(
        'Service In Use',
        `Cannot remove "${service.name}" because it is currently assigned to: ${windowNames}. Please remove it from these windows first.`
      );
      return;
    }

    // Show confirmation modal instead of window.confirm
    setConfirmModalConfig({
      title: 'Remove Service',
      message: `Are you sure you want to remove "${service.name}"? This action cannot be undone.`,
      onConfirm: () => performRemoveService(serviceId),
      type: 'danger'
    });
    setShowConfirmModal(true);
  };

  const performRemoveService = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== serviceId));
        showSuccess('Service Removed', `${service.name} has been removed successfully`);
      } else {
        throw new Error('Failed to remove service');
      }
    } catch (error) {
      showError('Error', 'Failed to remove service');
      console.error('Error removing service:', error);
    }
  };

  const handleToggleWindow = async (windowId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/windows/${windowId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedWindow = await response.json();
        setWindows(prev => prev.map(window =>
          window.id === windowId ? { ...window, isOpen: updatedWindow.isOpen } : window
        ));
        showSuccess('Window Updated', `${updatedWindow.name} is now ${updatedWindow.isOpen ? 'open' : 'closed'}`);
      } else {
        throw new Error('Failed to toggle window');
      }
    } catch (error) {
      showError('Error', 'Failed to toggle window status');
      console.error('Error toggling window:', error);
    }
  };

  const handleConfigureWindow = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      openEditWindowModal(window);
    }
  };

  const handleRemoveWindow = async (windowId) => {
    const windowToRemove = windows.find(w => w.id === windowId);
    if (!windowToRemove) return;

    // Show confirmation modal instead of window.confirm
    setConfirmModalConfig({
      title: 'Remove Window',
      message: `Are you sure you want to remove "${windowToRemove.name}"? This action cannot be undone.`,
      onConfirm: () => performRemoveWindow(windowId),
      type: 'danger'
    });
    setShowConfirmModal(true);
  };

  const performRemoveWindow = async (windowId) => {
    const windowToRemove = windows.find(w => w.id === windowId);
    if (!windowToRemove) return;

    try {
      const response = await fetch(`http://localhost:5000/api/windows/${windowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWindows(prev => prev.filter(w => w.id !== windowId));
        showSuccess('Window Removed', `${windowToRemove.name} has been removed successfully`);
        // Close the modal after successful deletion
        closeAddEditWindowModal();
      } else {
        throw new Error('Failed to remove window');
      }
    } catch (error) {
      showError('Error', 'Failed to remove window');
      console.error('Error removing window:', error);
    }
  };

  return (
    <div className="space-y-6">


      {/* Settings Management Grid Container - with visible background, rounded corners, and padding */}
      <div className="grid gap-4 h-[calc(100vh-12rem)] bg-white p-6 border border-gray-200" style={{ gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto 1fr 1fr' }}>
        {/* First div: Row 1, spanning both columns */}
        <div className="col-span-2 row-span-1 bg-white rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Column 1: Settings Management heading */}
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">Settings Management</h1>
            </div>

            {/* Column 2: Warning banner when queueing is enabled */}
            <div className="flex justify-end">
              {isQueueingEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2 max-w-md">
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-medium text-yellow-800">Settings Locked</h3>
                    <p className="text-xs text-yellow-700">
                      Management disabled while queueing is active.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second div: Row 2, Column 1 only - Toggle Section */}
        <div className="col-span-1 row-span-1 bg-white rounded-xl border border-gray-300 shadow-md p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-900">Tap to Enable Queueing</span>
            {(isToggling || toggleCooldown > 0) && (
              <span className="text-sm text-gray-500 mt-1">
                {isToggling ? 'Processing...' : `Wait ${toggleCooldown}s before next toggle`}
              </span>
            )}
          </div>
          <button
            onClick={handleToggleQueueing}
            disabled={isToggling || toggleCooldown > 0}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
              isToggling || toggleCooldown > 0
                ? 'opacity-50 cursor-not-allowed bg-gray-300'
                : isQueueingEnabled
                ? 'bg-[#1F3463]'
                : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isQueueingEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
            {isToggling && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3463]"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No services available. Add a service to get started.
              </div>
            ) : (
              (services || []).map((service) => (
                <div
                  key={service.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900 font-medium">{service.name}</span>
                    {!service.isActive && (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveService(service.id)}
                      disabled={isQueueingEnabled}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isQueueingEnabled
                          ? 'opacity-50 cursor-not-allowed text-gray-400'
                          : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={
                        isQueueingEnabled
                          ? 'Cannot remove services while queueing is active'
                          : 'Remove Service'
                      }
                    >
                      <AiOutlineMinusCircle className="text-lg" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Row 3: Add Button */}
          <button
            onClick={handleAddService}
            disabled={isQueueingEnabled}
            className={`flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors ${
              isQueueingEnabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: '#1F3463' }}
            title={isQueueingEnabled ? 'Cannot add services while queueing is active' : 'Add Service'}
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
                <LocationAutocomplete
                  value={locationText}
                  onChange={setLocationText}
                  onSave={handleLocationUpdate}
                  disabled={isQueueingEnabled}
                  isUpdating={isUpdatingLocation}
                  placeholder="Enter department location..."
                />
              </div>
            </div>
          </div>

          {/* Rows 2-5: Container for displaying added windows - Fixed height for exactly 4 windows */}
          <div className="flex-1 flex flex-col space-y-3" style={{ height: 'calc(100% - 4rem)' }}>
            {(windows || []).slice(0, 4).map((window) => (
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
                  {/* Row 1: Services */}
                  <ServiceDisplay
                    services={window.serviceIds || []}
                    totalServices={services.length}
                    isPriority={window.name === 'Priority'}
                  />
                  {/* Row 2: Admin user email */}
                  <div className="text-sm text-gray-600">
                    {window.assignedAdmin?.email || 'No admin assigned'}
                  </div>
                </div>

                {/* Column 3: Two React Icons side-by-side */}
                <div className="flex items-center justify-center space-x-1">
                  <button
                    onClick={() => !isQueueingEnabled && handleToggleWindow(window.id)}
                    disabled={isQueueingEnabled}
                    className={`p-2 rounded-lg transition-colors ${
                      isQueueingEnabled
                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                        : window.isOpen
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                    title={
                      isQueueingEnabled
                        ? 'Cannot change window visibility while queueing is active'
                        : window.isOpen ? 'Close Window' : 'Open Window'
                    }
                  >
                    {window.isOpen ? (
                      <AiOutlineEye className="text-xl" />
                    ) : (
                      <AiOutlineEyeInvisible className="text-xl" />
                    )}
                  </button>
                  <button
                    onClick={() => handleConfigureWindow(window.id)}
                    disabled={isQueueingEnabled}
                    className={`p-2 rounded-lg transition-colors ${
                      isQueueingEnabled
                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    title={
                      isQueueingEnabled
                        ? 'Cannot configure windows while queueing is active'
                        : 'Configure Window'
                    }
                  >
                    <LuSettings2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}

            {/* Fill remaining slots with clickable add buttons if fewer than 4 windows */}
            {Array.from({ length: Math.max(0, 4 - (windows || []).length) }).map((_, index) => (
              <button
                key={`placeholder-${index}`}
                onClick={openAddWindowModal}
                disabled={isQueueingEnabled}
                className={`border-2 border-dashed rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isQueueingEnabled
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 hover:bg-gray-50'
                }`}
                style={{ height: 'calc((100% - 0.75rem * 3) / 4)' }}
                title={
                  isQueueingEnabled
                    ? 'Cannot add windows while queueing is active'
                    : 'Add new window'
                }
              >
                <span className="text-sm">
                  {isQueueingEnabled ? 'Locked' : 'Available Window Slot'}
                </span>
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
        windows={windows}
        adminUsers={adminUsers}
        adminUsersLoading={adminUsersLoading}
        isEditing={!!editingWindow}
        onRemove={editingWindow ? () => handleRemoveWindow(editingWindow.id) : null}
        errors={windowErrors}
      />
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={closeAddServiceModal}
        serviceFormData={serviceFormData}
        onFormChange={handleServiceFormChange}
        onSave={handleSaveService}
        errors={serviceErrors}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        type={confirmModalConfig.type}
        confirmText="Remove"
        cancelText="Cancel"
      />

      {/* Toast Container for Settings page notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default Settings;

