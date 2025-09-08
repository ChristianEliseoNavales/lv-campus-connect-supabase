import { useState, useEffect, useRef } from 'react';
import KioskLayout from '../layouts/KioskLayout';
import QueueLayout from '../layouts/QueueLayout';

// On-screen QWERTY Keyboard Component - Optimized for Kiosk Touchscreen
const OnScreenKeyboard = ({ onKeyPress, onBackspace, onSpace, onEnter, isVisible }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const keyboardRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (keyboardRef.current) {
        keyboardRef.current.classList.remove('kiosk-keyboard-exit');
        keyboardRef.current.classList.add('kiosk-keyboard-enter');
      }
    } else {
      if (keyboardRef.current) {
        keyboardRef.current.classList.remove('kiosk-keyboard-enter');
        keyboardRef.current.classList.add('kiosk-keyboard-exit');
        setTimeout(() => setIsAnimating(false), 300);
      }
    }
  }, [isVisible]);

  if (!isVisible && !isAnimating) return null;

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div
      ref={keyboardRef}
      className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-xl max-w-5xl mx-auto"
    >
      {/* Number Row */}
      <div className="flex justify-center gap-3 mb-4">
        {numberRow.map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="w-20 h-16 bg-white border-2 border-gray-400 rounded-lg text-2xl font-bold kiosk-touch-feedback select-none"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Letter Rows */}
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-3 mb-4">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="w-20 h-16 bg-white border-2 border-gray-400 rounded-lg text-2xl font-bold kiosk-touch-feedback select-none"
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom Row with Special Keys */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onBackspace}
          className="w-32 h-16 bg-white border-2 border-gray-400 rounded-lg text-lg font-bold kiosk-touch-feedback select-none"
        >
          ⌫ DELETE
        </button>
        <button
          onClick={onSpace}
          className="w-48 h-16 bg-white border-2 border-gray-400 rounded-lg text-lg font-bold kiosk-touch-feedback select-none"
        >
          SPACE
        </button>
        <button
          onClick={onEnter}
          className="w-32 h-16 bg-white border-2 border-gray-400 rounded-lg text-lg font-bold kiosk-touch-feedback select-none"
        >
          ↵ ENTER
        </button>
      </div>
    </div>
  );
};

const Queue = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [activeField, setActiveField] = useState('name');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: ''
  });

  // Keyboard handling functions
  const handleKeyPress = (key) => {
    setFormData(prev => ({
      ...prev,
      [activeField]: prev[activeField] + key
    }));
  };

  const handleBackspace = () => {
    setFormData(prev => ({
      ...prev,
      [activeField]: prev[activeField].slice(0, -1)
    }));
  };

  const handleSpace = () => {
    setFormData(prev => ({
      ...prev,
      [activeField]: prev[activeField] + ' '
    }));
  };

  const handleEnter = () => {
    // Move to next field or submit if both fields are filled
    if (activeField === 'name' && formData.name.trim()) {
      setActiveField('contactNumber');
    } else if (activeField === 'contactNumber' && formData.contactNumber.trim() && formData.name.trim()) {
      handleFormSubmit();
    }
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  // Departments following Directory.jsx structure
  const departments = [
    { key: 'registrar', name: "Registrar's Office" },
    { key: 'admissions', name: 'Admissions Office' }
  ];

  // Department data for queue functionality
  const departmentData = {
    registrar: {
      name: "Registrar's Office",
      description: 'Student records, transcripts, enrollment verification',
      icon: '📋',
      services: [
        'Transcript Request',
        'Enrollment Verification',
        'Grade Change Request',
        'Student Records Update',
        'Transfer Credit Evaluation'
      ],
      currentQueue: 5,
      estimatedWait: '15-20 minutes'
    },
    admissions: {
      name: 'Admissions Office',
      description: 'New student applications, admission requirements',
      icon: '🎓',
      services: [
        'Application Assistance',
        'Admission Requirements',
        'Transfer Student Services',
        'International Student Services',
        'Campus Tour Request'
      ],
      currentQueue: 3,
      estimatedWait: '10-15 minutes'
    }
  };

  const handleDepartmentSelect = (departmentKey) => {
    setSelectedDepartment(departmentData[departmentKey]);
    setSelectedService(null);
    setShowForm(false);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedService(null);
    setShowForm(false);
    setShowKeyboard(true);
    setActiveField('name');
    setFormData({ name: '', contactNumber: '' });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowForm(true);
    setShowKeyboard(true);
    setActiveField('name');
    // Reset form data when starting new form
    setFormData({ name: '', contactNumber: '' });
  };

  const handleFormSubmit = () => {
    // Validate both fields are filled
    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      return;
    }

    // In a real application, this would submit to the backend
    alert(`Queue request submitted!\nDepartment: ${selectedDepartment.name}\nService: ${selectedService}\nName: ${formData.name}\nContact: ${formData.contactNumber}`);

    // Reset form
    setFormData({ name: '', contactNumber: '' });
    setShowForm(false);
    setSelectedService(null);
    setSelectedDepartment(null);
    setShowKeyboard(true);
    setActiveField('name');
  };

  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
    // Auto-show keyboard when any input field is focused
    setShowKeyboard(true);
  };

  // Check if form is valid (both fields have content)
  const isFormValid = formData.name.trim() && formData.contactNumber.trim();

  // Back Button Component
  const BackButton = () => (
    <button
      onClick={handleBackToDepartments}
      className="fixed bottom-6 left-6 w-20 h-20 bg-[#1F3463] text-white rounded-full shadow-lg hover:bg-[#1A2E56] transition-all duration-200 flex items-center justify-center z-50 focus:outline-none focus:ring-4 focus:ring-blue-200"
      aria-label="Go back to department selection"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );



  if (showForm) {
    // Form state: return form content with QueueLayout and back button
    return (
      <QueueLayout
        showKeyboard={showKeyboard}
        onToggleKeyboard={toggleKeyboard}
      >
        {/* Custom header hiding for form state */}
        <style>{`
          .kiosk-container header { display: none !important; }
        `}</style>

        <div className={`h-full flex flex-col ${showKeyboard ? 'justify-start' : 'justify-center'}`}>
          {/* Form Container - Centered horizontally with positioned NEXT button */}
          <div className={`flex items-center justify-center w-full px-8 ${showKeyboard ? 'mb-4' : ''} relative`}>
            {/* Form Section - Perfectly centered regardless of button */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                    NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onFocus={() => handleFieldFocus('name')}
                    readOnly
                    className={`w-full px-3 py-3 border-2 rounded-lg text-lg focus:outline-none ${
                      activeField === 'name'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Contact Number Field */}
                <div>
                  <label htmlFor="contactNumber" className="block text-lg font-semibold text-gray-700 mb-2">
                    CONTACT NUMBER <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactNumber"
                    type="text"
                    value={formData.contactNumber}
                    onFocus={() => handleFieldFocus('contactNumber')}
                    readOnly
                    className={`w-full px-3 py-3 border-2 rounded-lg text-lg focus:outline-none ${
                      activeField === 'contactNumber'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Enter your contact number"
                  />
                </div>
              </div>
            </div>

            {/* NEXT Button - Positioned to the right of form, vertically centered */}
            <button
              onClick={handleFormSubmit}
              disabled={!isFormValid}
              className={`absolute left-1/2 ml-60 px-6 py-4 rounded-full font-bold text-xl transition-all duration-200 shadow-lg min-w-28 ${
                isFormValid
                  ? 'bg-blue-900 text-white hover:bg-blue-800 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              NEXT
            </button>
          </div>

          {/* On-Screen Keyboard - Moved closer to form */}
          <div className="flex justify-center w-full mt-2">
            <OnScreenKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onSpace={handleSpace}
              onEnter={handleEnter}
              isVisible={showKeyboard}
            />
          </div>
        </div>

        {/* Back Button */}
        <BackButton />
      </QueueLayout>
    );
  }

  // Department Selection: Use KioskLayout with navigation
  if (!selectedDepartment) {
    return (
      <KioskLayout>
        <div className="h-full flex flex-col">
          {/* Department Selection Grid */}
          <div className="flex-grow flex flex-col">
            {/* Fixed Header */}
            <div className="pt-8 pb-6">
              <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#161F55' }}>
                Select a department
              </h2>
            </div>

            {/* Centered Grid Container */}
            <div className="flex-grow flex items-center justify-center">
              {/* 2 Department Grid */}
              <div className="grid grid-cols-2 gap-x-32 gap-y-8 max-w-5xl mx-auto">
                {departments.map((department) => (
                  <button
                    key={department.key}
                    onClick={() => handleDepartmentSelect(department.key)}
                    className="text-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                    style={{ backgroundColor: '#1F3463' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2E56'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white">
                        {department.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Service Selection: Use QueueLayout without navigation and without keyboard (not a form input phase)
  return (
    <QueueLayout>
      <div className="h-full flex flex-col">
        {!selectedService ? (
          /* Service Selection */
          <div className="flex-grow flex flex-col">
            {/* Fixed Header */}
            <div className="pt-8 pb-6">
              <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#161F55' }}>
                What would you like to do?
              </h2>
            </div>

            {/* Centered Grid Container */}
            <div className="flex-grow flex items-center justify-center">
              {/* Services Grid */}
              <div className="grid grid-cols-3 gap-x-32 gap-y-8 max-w-5xl mx-auto">
                {selectedDepartment.services.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleServiceSelect(service)}
                    className="text-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                    style={{ backgroundColor: '#1F3463' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2E56'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white">
                        {service}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Show Back Button when in service selection or later stages */}
      <BackButton />
    </QueueLayout>
  );
};

export default Queue;
