import React, { useState } from 'react';

// On-screen QWERTY Keyboard Component
const OnScreenKeyboard = ({ onKeyPress, onBackspace, onSpace, onEnter, isVisible }) => {
  if (!isVisible) return null;

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg">
      {/* Number Row */}
      <div className="flex justify-center gap-1 mb-2">
        {numberRow.map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="w-12 h-12 bg-white border border-gray-400 rounded text-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Letter Rows */}
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="w-12 h-12 bg-white border border-gray-400 rounded text-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom Row with Special Keys */}
      <div className="flex justify-center gap-1">
        <button
          onClick={onBackspace}
          className="w-20 h-12 bg-white border border-gray-400 rounded text-sm font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          ⌫ DEL
        </button>
        <button
          onClick={onSpace}
          className="w-32 h-12 bg-white border border-gray-400 rounded text-sm font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          SPACE
        </button>
        <button
          onClick={onEnter}
          className="w-20 h-12 bg-white border border-gray-400 rounded text-sm font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
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
  const [showMenu, setShowMenu] = useState(true);
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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
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

  // Custom Footer Navigation for Form State
  const FormFooterNavigation = () => {
    const MenuIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );

    const KeyboardIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L10.586 10 8.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );

    const HomeIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    );

    const AnnouncementIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );

    const SearchIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    );

    const MapIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    );

    const DirectoryIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
      </svg>
    );

    const FaqIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );

    const HelpIcon = () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );

    return (
      <nav className="bg-transparent flex justify-center items-center space-x-6 w-full">
        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
        >
          <MenuIcon />
          <span className="mt-2 font-semibold text-sm">MENU</span>
        </button>

        {/* Conditional Navigation Items - Show ALL navigation items when menu is expanded */}
        {showMenu && (
          <>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedService(null);
                setSelectedDepartment(null);
              }}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <HomeIcon />
              <span className="mt-2 font-semibold text-sm">HOME</span>
            </button>

            <button
              onClick={() => window.location.href = '/announcement'}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <AnnouncementIcon />
              <span className="mt-1 font-semibold text-xs text-center leading-tight">ANNOUNCEMENT</span>
            </button>

            <button
              onClick={() => window.location.href = '/search'}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <SearchIcon />
              <span className="mt-2 font-semibold text-sm">SEARCH</span>
            </button>

            <button
              onClick={() => window.location.href = '/map'}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <MapIcon />
              <span className="mt-2 font-semibold text-sm">MAP</span>
            </button>

            <button
              onClick={() => window.location.href = '/directory'}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <DirectoryIcon />
              <span className="mt-2 font-semibold text-sm">DIRECTORY</span>
            </button>

            <button
              onClick={() => window.location.href = '/faq'}
              className="w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
            >
              <FaqIcon />
              <span className="mt-2 font-semibold text-sm">FAQs</span>
            </button>

            <button
              onClick={() => window.location.href = '/help'}
              className="w-16 h-16 flex items-center justify-center border-2 border-white rounded-full transition-all duration-200 bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100"
              title="Help & Support"
            >
              <HelpIcon />
            </button>
          </>
        )}

        {/* Keyboard Toggle Button */}
        <button
          onClick={toggleKeyboard}
          className={`w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
            showKeyboard
              ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
              : 'bg-blue-900 text-white hover:bg-blue-800 hover:text-yellow-100'
          }`}
        >
          <KeyboardIcon />
          <span className="mt-2 font-semibold text-sm">KEYBOARD</span>
        </button>
      </nav>
    );
  };

  if (showForm) {
    // Form state: return form content with custom layout requirements
    return (
      <>
        {/* Custom header hiding and footer for form state */}
        <style>{`
          .kiosk-container header { display: none !important; }
          .kiosk-container footer nav { display: none !important; }
        `}</style>

        <div className={`h-full flex flex-col ${showKeyboard ? 'justify-start' : 'justify-center'}`}>
          {/* Form Container with NEXT Button - Perfectly centered horizontally */}
          <div className={`flex justify-center items-center w-full px-8 ${showKeyboard ? 'mb-4' : ''}`}>
            <div className="flex items-center justify-center gap-8 w-full max-w-4xl mx-auto">
              {/* Form Section - Reduced dimensions */}
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

              {/* NEXT Button - Vertically centered relative to form container */}
              <div className="flex items-center">
                <button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid}
                  className={`px-6 py-4 rounded-full font-bold text-xl transition-all duration-200 shadow-lg min-w-28 ${
                    isFormValid
                      ? 'bg-blue-900 text-white hover:bg-blue-800 hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>

          {/* On-Screen Keyboard - Moved closer to form */}
          {showKeyboard && (
            <div className="flex justify-center w-full mt-2">
              <OnScreenKeyboard
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                onEnter={handleEnter}
                isVisible={showKeyboard}
              />
            </div>
          )}
        </div>

        {/* Custom Footer Navigation for Form State */}
        <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-0 px-6 pb-3 w-full">
          <FormFooterNavigation />
        </div>
      </>
    );
  }

  // Normal state: return regular content
  return (
    <div className="h-full flex flex-col">
      {!selectedDepartment ? (
        /* Department Selection Grid */
        <div className="flex-grow flex flex-col">
          {/* Fixed Header */}
          <div className="pt-8 pb-6">
            <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#2F0FE4' }}>
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
                  className="bg-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold" style={{ color: '#2F0FE4' }}>
                      {department.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : !selectedService ? (
        /* Service Selection */
        <div className="flex-grow flex flex-col">
          {/* Fixed Header */}
          <div className="pt-8 pb-6">
            <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#2F0FE4' }}>
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
                  className="bg-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold" style={{ color: '#2F0FE4' }}>
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
  );
};

export default Queue;
