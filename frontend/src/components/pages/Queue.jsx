import { useState, useEffect, useRef } from 'react';
import KioskLayout from '../layouts/KioskLayout';
import QueueLayout from '../layouts/QueueLayout';
import { ResponsiveGrid } from '../ui';
import { HiSparkles } from "react-icons/hi2";
import HolographicKeyboard from '../ui/HolographicKeyboard';



// Data Privacy Modal Component
const DataPrivacyModal = ({ isOpen, onNext, onPrevious, consent, setConsent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Black background with 80% opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-80" />

      {/* Modal Container - Centered with buttons positioned relative to it */}
      <div className="relative flex items-center">
        {/* Modal Content - Perfectly centered */}
        <div className="bg-white rounded-2xl shadow-3xl drop-shadow-2xl p-10 mx-4 max-w-4xl w-full">
          {/* Modal Header */}
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            PRIVACY NOTICE
          </h2>

          {/* Privacy Notice Text */}
          <div className="mb-8 text-gray-700 leading-relaxed">
            <p className="mb-6 text-lg">
              Please be informed that we are collecting your personal information for the purpose of
              recording and monitoring as we follow the Data Privacy Act of 2012. The storage, use,
              and disposal of your personal information will be governed by LVCC's Data Privacy Policies.
            </p>
          </div>

          {/* Consent Checkbox */}
          <div className="mb-10">
            <label className="flex items-start space-x-4 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-2 h-8 w-8 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-700 leading-relaxed text-lg">
                I voluntarily give my consent to LVCC in collecting, processing, recording, using,
                and retaining my personal information for the above-mentioned purpose in accordance
                with this Privacy Notice.
              </span>
            </label>
          </div>
        </div>

        {/* Buttons positioned adjacent to modal's right edge */}
        <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-[10000]">
          {/* Next Button (top) */}
          <button
            onClick={onNext}
            disabled={!consent}
            className={`w-24 h-24 rounded-full border-2 border-white font-bold text-sm transition-all duration-150 shadow-lg ${
              consent
                ? 'bg-[#FFE251] text-[#1A2E56] active:shadow-md active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            NEXT
          </button>

          {/* Previous Button (bottom) */}
          <button
            onClick={onPrevious}
            className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
          >
            PREVIOUS
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onYes, onNo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Black background with 80% opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-80" />

      {/* Modal Container - Centered with buttons positioned below */}
      <div className="relative flex flex-col items-center">
        {/* Modal Content - Perfectly centered */}
        <div className="bg-white rounded-2xl shadow-3xl drop-shadow-2xl p-8 mx-4 max-w-lg w-full">
          {/* Modal Message */}
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Are you ready to submit your information?
          </h2>
        </div>

        {/* Buttons positioned below modal */}
        <div className="flex space-x-8 mt-8">
          {/* Yes Button */}
          <button
            onClick={onYes}
            className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
          >
            YES
          </button>

          {/* No Button */}
          <button
            onClick={onNo}
            className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-gray-600 transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

// Office Mismatch Modal Component
const OfficeMismatchModal = ({ isOpen, onConfirm, onClose, currentOffice, suggestedOffice }) => {
  if (!isOpen || !suggestedOffice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-4 text-center">
        {/* Header */}
        <h2 className="text-3xl font-semibold mb-4" style={{ color: '#1F3463' }}>
          You Selected {currentOffice}'s Office
        </h2>

        {/* Subtext */}
        <p className="text-xl text-gray-600 mb-8">
          Please switch to
        </p>

        {/* Suggested Office Button */}
        <button
          onClick={onConfirm}
          className="w-80 text-white rounded-3xl shadow-lg drop-shadow-md p-6 active:shadow-md active:scale-95 transition-all duration-150 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 mb-6"
          style={{ backgroundColor: '#1F3463' }}
          onTouchStart={(e) => e.target.style.backgroundColor = '#1A2E56'}
          onTouchEnd={(e) => e.target.style.backgroundColor = '#1F3463'}
          onMouseDown={(e) => e.target.style.backgroundColor = '#1A2E56'}
          onMouseUp={(e) => e.target.style.backgroundColor = '#1F3463'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
        >
          <div className="text-center flex flex-col items-center">
            {/* Office Image */}
            <div className="mb-4">
              <img
                src={`/queue/${suggestedOffice.key}.png`}
                alt={`${suggestedOffice.name} Icon`}
                className="w-34 h-34 object-contain rounded-xl mx-auto"
              />
            </div>
            {/* Office Name */}
            <h3 className="text-xl font-semibold text-white">
              {suggestedOffice.name}
            </h3>
          </div>
        </button>

        {/* Close button (optional - user can also click suggested office) */}
        <div>
          <button
            onClick={onClose}
            className="text-gray-500 active:text-gray-700 text-sm underline transition-colors duration-150"
          >
            Continue with current selection
          </button>
        </div>
      </div>
    </div>
  );
};

const Queue = () => {
  // Multi-step queue state management
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [currentStep, setCurrentStep] = useState('department'); // 'department', 'privacy', 'service', 'studentStatus', 'role', 'priority', 'idVerification', 'form', 'formStep1', 'formStep2', 'confirmation', 'result', 'feedback', 'thankYou'
  const [selectedService, setSelectedService] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const [showOfficeMismatchModal, setShowOfficeMismatchModal] = useState(false);
  const [suggestedOffice, setSuggestedOffice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [activeField, setActiveField] = useState('name');
  const [formStep, setFormStep] = useState(1); // 1: Personal Info, 2: Additional Info
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [idNumber, setIdNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: ''
  });

  // Keyboard handling functions
  const handleKeyPress = (key) => {
    if (activeField === 'idNumber') {
      setIdNumber(prev => prev + key);
    } else {
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField] + key
      }));
    }
  };

  const handleBackspace = () => {
    if (activeField === 'idNumber') {
      setIdNumber(prev => prev.slice(0, -1));
    } else {
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField].slice(0, -1)
      }));
    }
  };

  const handleSpace = () => {
    if (activeField === 'idNumber') {
      setIdNumber(prev => prev + ' ');
    } else {
      setFormData(prev => ({
        ...prev,
        [activeField]: prev[activeField] + ' '
      }));
    }
  };

  const handleEnter = () => {
    // Handle ID verification step only
    if (activeField === 'idNumber' && idNumber.trim()) {
      handleIdVerificationNext();
      return;
    }
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
  };

  // Offices following Directory.jsx structure
  const offices = [
    { key: 'registrar', name: "Registrar's Office" },
    { key: 'admissions', name: 'Admissions Office' }
  ];

  // Service options for the queue process
  const serviceOptions = [
    'Request a document',
    'Enroll',
    'Inquiry',
    'Claim'
  ];

  // Role options
  const roleOptions = [
    'Visitor',
    'Student',
    'Teacher',
    'Alumni'
  ];

  // Priority options
  const priorityOptions = [
    { key: 'yes', label: 'Yes' },
    { key: 'no', label: 'No' }
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

  const handleOfficeSelect = (officeKey) => {
    setSelectedDepartment(departmentData[officeKey]);
    setShowPrivacyModal(true);
    setCurrentStep('privacy');
    // Reset all subsequent steps
    setSelectedService(null);
    setStudentStatus(null);
    setSelectedRole(null);
    setPriorityStatus(null);
    setShowForm(false);
  };

  const handleBackToOffices = () => {
    setSelectedDepartment(null);
    setShowPrivacyModal(false);
    setPrivacyConsent(false);
    setCurrentStep('department');
    setSelectedService(null);
    setStudentStatus(null);
    setSelectedRole(null);
    setPriorityStatus(null);
    setShowForm(false);
    setShowKeyboard(true);
    setActiveField('name');
    setFormStep(1);
    setShowConfirmationModal(false);
    setIdNumber('');
    setFormData({ name: '', contactNumber: '', email: '', address: '' });
  };

  // Privacy modal handlers
  const handlePrivacyNext = () => {
    if (privacyConsent) {
      setShowPrivacyModal(false);
      setCurrentStep('service');
    }
  };

  const handlePrivacyPrevious = () => {
    setShowPrivacyModal(false);
    setPrivacyConsent(false);
    setCurrentStep('department');
    setSelectedDepartment(null);
  };

  // Service selection handlers
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // If "Enroll" is selected, go to student status check, otherwise go to role
    if (service === 'Enroll') {
      setCurrentStep('studentStatus');
    } else {
      setCurrentStep('role');
    }
  };

  // Student status selection handlers
  const handleStudentStatusSelect = (status) => {
    setStudentStatus(status);

    // Check for office mismatch scenarios
    const currentOfficeKey = selectedDepartment?.name === "Registrar's Office" ? 'registrar' : 'admissions';

    // Scenario 1: Registrar's Office + Enroll + YES (new student) -> should use Admissions
    if (currentOfficeKey === 'registrar' && selectedService === 'Enroll' && status === 'yes') {
      setSuggestedOffice({ key: 'admissions', name: 'Admissions Office' });
      setShowOfficeMismatchModal(true);
      return;
    }

    // Scenario 2: Admissions Office + Enroll + NO (not new student) -> should use Registrar's
    if (currentOfficeKey === 'admissions' && selectedService === 'Enroll' && status === 'no') {
      setSuggestedOffice({ key: 'registrar', name: "Registrar's Office" });
      setShowOfficeMismatchModal(true);
      return;
    }

    // No mismatch - proceed normally
    // For enrollment, jump directly to QR code result step
    // Skip role selection, priority status, and form steps
    setCurrentStep('result');
  };

  // Role selection handlers
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Only Visitor role goes to priority status check, others skip to form
    if (role === 'Visitor') {
      setCurrentStep('priority');
    } else {
      // Student, Alumni, Teacher bypass priority check and go directly to form
      setCurrentStep('formStep1');
      setFormStep(1);
      setShowForm(true);
      setShowKeyboard(true);
      setActiveField('name');
      // Reset form data when starting new form
      setFormData({ name: '', contactNumber: '', email: '', address: '' });
    }
  };

  // Priority status handlers
  const handlePrioritySelect = (priority) => {
    setPriorityStatus(priority);
    if (priority === 'yes') {
      // If YES, go to ID verification step
      setCurrentStep('idVerification');
      setShowKeyboard(true);
      setActiveField('idNumber');
      setIdNumber(''); // Reset ID number
    } else {
      // If NO, go directly to form
      setCurrentStep('formStep1');
      setFormStep(1);
      setShowForm(true);
      setShowKeyboard(true);
      setActiveField('name');
      // Reset form data when starting new form
      setFormData({ name: '', contactNumber: '', email: '', address: '' });
    }
  };

  // ID verification handlers
  const handleIdVerificationNext = () => {
    if (idNumber.trim()) {
      setCurrentStep('formStep1');
      setFormStep(1);
      setShowForm(true);
      setShowKeyboard(true);
      setActiveField('name');
      // Reset form data when starting new form
      setFormData({ name: '', contactNumber: '', email: '', address: '' });
    }
  };

  const handleIdVerificationPrevious = () => {
    setCurrentStep('priority');
    setIdNumber('');
  };

  // Form step navigation handlers
  const handleFormStep1Next = () => {
    // Validate Step 1 fields
    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      return;
    }
    setFormStep(2);
    setCurrentStep('formStep2');
    setActiveField('email');
  };

  const handleFormStep1Previous = () => {
    // Check if we came from ID verification or directly from priority/role
    if (priorityStatus === 'yes') {
      // If priority status was yes, go back to ID verification
      setCurrentStep('idVerification');
      setActiveField('idNumber');
    } else if (selectedRole === 'Visitor') {
      // If visitor role but priority status was no, go back to priority
      setCurrentStep('priority');
    } else {
      // For other roles (Student, Alumni, Teacher), go back to role selection
      setCurrentStep('role');
    }
    setShowForm(false);
    setFormStep(1);
  };

  const handleFormStep2Next = () => {
    // Validate Step 2 fields - email is required, address is optional
    if (!formData.email.trim()) {
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleFormStep2Previous = () => {
    setFormStep(1);
    setCurrentStep('formStep1');
    setActiveField('name');
  };

  const handleConfirmationYes = () => {
    setShowConfirmationModal(false);
    setCurrentStep('result');
  };

  // Print button handler - moves to feedback step
  const handlePrintClick = () => {
    setCurrentStep('feedback');
  };

  // Star rating handler
  const handleStarClick = (rating) => {
    setStarRating(rating);
    // Auto-advance to thank you step after rating
    setTimeout(() => {
      setCurrentStep('thankYou');
    }, 500);
  };

  const handleConfirmationNo = () => {
    setShowConfirmationModal(false);
    // Stay on Step 2
  };

  const handleFormSubmit = () => {
    // This is now used for the final result submission
    // In a real application, this would submit to the backend
    const submissionData = {
      department: selectedDepartment.name,
      service: selectedService,
      role: selectedRole,
      priorityStatus: priorityStatus,
      name: formData.name,
      contactNumber: formData.contactNumber,
      email: formData.email,
      address: formData.address,
      timestamp: new Date().toISOString()
    };

    console.log('Queue request submitted:', submissionData);

    // Reset all form and state data
    setFormData({ name: '', contactNumber: '', email: '', address: '' });
    setShowForm(false);
    setSelectedService(null);
    setStudentStatus(null);
    setSelectedRole(null);
    setPriorityStatus(null);
    setSelectedDepartment(null);
    setShowPrivacyModal(false);
    setPrivacyConsent(false);
    setCurrentStep('department');
    setShowKeyboard(true);
    setActiveField('name');
    setFormStep(1);
    setShowConfirmationModal(false);
    setStarRating(0);
  };

  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
    // Auto-show keyboard when any input field is focused
    setShowKeyboard(true);
  };

  // Office mismatch modal handlers
  const handleOfficeMismatchConfirm = () => {
    if (suggestedOffice) {
      // Switch to the suggested office and proceed directly to result
      setSelectedDepartment(departmentData[suggestedOffice.key]);
      setShowOfficeMismatchModal(false);
      setSuggestedOffice(null);
      // Skip service selection and student status check - go directly to QR result
      // Keep selectedService as "Enroll" and preserve studentStatus
      setCurrentStep('result');
      // Reset only the steps that come after result
      setSelectedRole(null);
      setPriorityStatus(null);
      setShowForm(false);
    }
  };

  const handleOfficeMismatchClose = () => {
    setShowOfficeMismatchModal(false);
    setSuggestedOffice(null);
  };

  // Check if form steps are valid
  const isFormStep1Valid = formData.name.trim() && formData.contactNumber.trim();
  const isFormStep2Valid = formData.email.trim(); // Email is required, address is optional



  // Back Button Component
  const BackButton = () => (
    <button
      onClick={handleBackToOffices}
      className="fixed bottom-6 left-6 w-20 h-20 bg-[#FFE251] text-black border-2 border-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50 focus:outline-none focus:ring-4 focus:ring-blue-200"
      aria-label="Go back to office selection"
    >
      BACK
    </button>
  );



  // ID Verification Step
  if (currentStep === 'idVerification') {
    return (
      <>
        <QueueLayout>
          {/* Custom header hiding for form state */}
          <style>{`
            .kiosk-container header { display: none !important; }
          `}</style>

          <div className="h-full flex flex-col justify-center">
            {/* Form Container - Centered horizontally with positioned buttons */}
            <div className="flex items-center justify-center w-full px-8 relative overflow-visible">
              {/* Form Section - Perfectly centered */}
              <div className="bg-white rounded-lg shadow-xl drop-shadow-lg p-8 w-[500px]">
                {/* Header */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Enter a valid ID number
                </h2>

                {/* Subheader */}
                <p className="text-lg text-gray-600 mb-8 text-center">
                  Please present your ID at the office for verification
                </p>

                <div className="space-y-4">
                  {/* ID Number Field */}
                  <div>
                    <label htmlFor="idNumber" className="block text-lg font-semibold text-gray-700 mb-2">
                      ID NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="idNumber"
                      type="text"
                      value={idNumber}
                      onFocus={() => handleFieldFocus('idNumber')}
                      readOnly
                      className={`w-full px-3 py-3 border-2 rounded-lg text-lg focus:outline-none ${
                        activeField === 'idNumber'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Enter your ID number"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons positioned to the right of form - Fixed positioning */}
              <div className="absolute left-[calc(50%+250px+1rem)] top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
                {/* Next Button */}
                <button
                  onClick={handleIdVerificationNext}
                  disabled={!idNumber.trim()}
                  className={`w-24 h-24 rounded-full border-2 border-white font-bold text-sm transition-all duration-150 shadow-lg ${
                    idNumber.trim()
                      ? 'bg-[#1F3463] text-white active:bg-[#1A2E56] active:shadow-md active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  NEXT
                </button>

                {/* Previous Button */}
                <button
                  onClick={handleIdVerificationPrevious}
                  className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
                >
                  PREVIOUS
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <BackButton />
        </QueueLayout>

        {/* Holographic Keyboard Overlay */}
        <HolographicKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onEnter={handleEnter}
          onHide={hideKeyboard}
          isVisible={showKeyboard}
          activeInputValue={idNumber}
          activeInputLabel="ID NUMBER *"
          activeInputPlaceholder="Enter your ID number"
        />
      </>
    );
  }

  // Form Step 1: Personal Information
  if (currentStep === 'formStep1' && showForm) {

    return (
      <>
        <QueueLayout>
          {/* Custom header hiding for form state */}
          <style>{`
            .kiosk-container header { display: none !important; }
          `}</style>

          <div className="h-full flex flex-col justify-center">
            {/* Form Container - Centered horizontally with positioned buttons */}
            <div className="flex items-center justify-center w-full px-8 relative overflow-visible">
              {/* Form Section - Perfectly centered */}
              <div className="bg-white rounded-lg shadow-xl drop-shadow-lg p-6 w-[500px]">
                <div className="space-y-4">
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

              {/* Buttons positioned to the right of form - Fixed positioning */}
              <div className="absolute left-[calc(50%+250px+1rem)] top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
                {/* Next Button */}
                <button
                  onClick={handleFormStep1Next}
                  disabled={!isFormStep1Valid}
                  className={`w-24 h-24 rounded-full border-2 border-white font-bold text-sm transition-all duration-150 shadow-lg ${
                    isFormStep1Valid
                      ? 'bg-[#1F3463] text-white active:bg-[#1A2E56] active:shadow-md active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  NEXT
                </button>

                {/* Previous Button */}
                <button
                  onClick={handleFormStep1Previous}
                  className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
                >
                  PREVIOUS
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <BackButton />
        </QueueLayout>

        {/* Holographic Keyboard Overlay */}
        <HolographicKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onHide={hideKeyboard}
          isVisible={showKeyboard}
          // Multi-field display for visitation form step 1
          showAllFields={true}
          allFieldsData={[
            {
              name: 'name',
              label: 'NAME *',
              value: formData.name,
              placeholder: 'Enter your full name'
            },
            {
              name: 'contactNumber',
              label: 'CONTACT NUMBER *',
              value: formData.contactNumber,
              placeholder: 'Enter your contact number'
            }
          ]}
          activeFieldName={activeField}
          onFieldFocus={handleFieldFocus}
        />
      </>
    );
  }

  // Form Step 2: Additional Information
  if (currentStep === 'formStep2' && showForm) {

    return (
      <>
        <QueueLayout>
          {/* Custom header hiding for form state */}
          <style>{`
            .kiosk-container header { display: none !important; }
          `}</style>

          <div className="h-full flex flex-col justify-center">
            {/* Form Container - Centered horizontally with positioned buttons */}
            <div className="flex items-center justify-center w-full px-8 relative overflow-visible">
              {/* Form Section - Perfectly centered */}
              <div className="bg-white rounded-lg shadow-xl drop-shadow-lg p-6 w-[500px]">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                        EMAIL <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onFocus={() => handleFieldFocus('email')}
                      readOnly
                      className={`w-full px-3 py-3 border-2 rounded-lg text-lg focus:outline-none ${
                        activeField === 'email'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Address Field */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="address" className="block text-lg font-semibold text-gray-700">
                        ADDRESS
                      </label>
                      <span className="text-sm text-gray-500 font-medium">Optional</span>
                    </div>
                    <input
                      id="address"
                      type="text"
                      value={formData.address}
                      onFocus={() => handleFieldFocus('address')}
                      readOnly
                      className={`w-full px-3 py-3 border-2 rounded-lg text-lg focus:outline-none ${
                        activeField === 'address'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons positioned to the right of form - Fixed positioning */}
              <div className="absolute left-[calc(50%+250px+1rem)] top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
                {/* Next Button */}
                <button
                  onClick={handleFormStep2Next}
                  disabled={!isFormStep2Valid}
                  className={`w-24 h-24 rounded-full border-2 border-white font-bold text-sm transition-all duration-150 shadow-lg ${
                    isFormStep2Valid
                      ? 'bg-[#1F3463] text-white active:bg-[#1A2E56] active:shadow-md active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  NEXT
                </button>

                {/* Previous Button */}
                <button
                  onClick={handleFormStep2Previous}
                  className="w-24 h-24 rounded-full border-2 border-white bg-[#1F3463] text-white font-bold text-sm active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
                >
                  PREVIOUS
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <BackButton />
        </QueueLayout>

        {/* Holographic Keyboard Overlay */}
        <HolographicKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onHide={hideKeyboard}
          isVisible={showKeyboard}
          // Multi-field display for visitation form step 2
          showAllFields={true}
          allFieldsData={[
            {
              name: 'email',
              label: 'EMAIL *',
              value: formData.email,
              placeholder: 'Enter your email address'
            },
            {
              name: 'address',
              label: 'ADDRESS',
              value: formData.address,
              placeholder: 'Enter your address'
            }
          ]}
          activeFieldName={activeField}
          onFieldFocus={handleFieldFocus}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onYes={handleConfirmationYes}
          onNo={handleConfirmationNo}
        />
      </>
    );
  }

  // Queue Result Layout
  if (currentStep === 'result') {
    // Generate dummy queue data
    const queueNumber = Math.floor(Math.random() * 99) + 1;
    const windowNumber = Math.floor(Math.random() * 3) + 1;
    const queueNumbers = [
      { number: queueNumber - 1 > 0 ? queueNumber - 1 : 99, isActive: false },
      { number: queueNumber, isActive: true },
      { number: queueNumber + 1 <= 99 ? queueNumber + 1 : 1, isActive: false }
    ];

    // Format current date for validity notice
    const formatCurrentDate = () => {
      const today = new Date();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return today.toLocaleDateString('en-US', options);
    };

    return (
      <QueueLayout>
        <div className="h-full flex flex-col">
          {/* Main Content Area - 2 columns layout with equal widths */}
          <div className="flex-grow grid grid-cols-2 gap-8 py-10 px-20">
            {/* First Div - QR Code Section */}
            <div className="bg-white rounded-3xl shadow-xl drop-shadow-lg p-8 flex flex-col items-center justify-center">
              {/* Top Text */}
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Scan the QR Code for your Queue Number
              </h2>

              {/* QR Code Image - Centered */}
              <div className="flex-grow flex items-center justify-center mb-8">
                <div className="w-96 h-96 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  {/* QR Code Image */}
                  <img
                    src="/queue/qr.png"
                    alt="QR Code for Queue Number"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Second Div - Queue Information */}
            <div className="bg-white rounded-3xl shadow-xl drop-shadow-lg p-6 flex flex-col items-center justify-evenly h-full">
              {/* Large Queue Number with Circular Border */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-32 h-32 border-4 border-[#1F3463] rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#1F3463]">
                    {queueNumber.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Queue Number Label */}
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Queue Number
              </h3>

              {/* Instruction Text */}
              <div className="mb-6 text-center">
                <span className="text-lg text-gray-700">Please Proceed to <br /></span>
                <span className="text-3xl text-gray-700">Window {windowNumber}</span>
              </div>

              {/* Validity Notice */}
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold text-[#1F3463]">
                  This ticket is only valid on {formatCurrentDate()}
                </p>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrintClick}
                className="px-20 py-4 bg-[#FFE251] text-black rounded-full font-bold text-xl active:bg-[#1A2E56] transition-all duration-150 shadow-lg active:shadow-md active:scale-95"
              >
                PRINT
              </button>
            </div>
          </div>
        </div>

        {/* Done Button (replaces Back Button) */}
        <button
          onClick={handlePrintClick}
          className="fixed bottom-6 left-6 w-20 h-20 bg-[#FFE251] text-black border-2 border-white rounded-full shadow-lg active:bg-[#1A2E56] transition-all duration-150 flex items-center justify-center z-50 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-95"
          aria-label="Done - Go to feedback"
        >
          <span className="text-sm font-bold">DONE</span>
        </button>
      </QueueLayout>
    );
  }

  // Feedback Step - Star Rating
  if (currentStep === 'feedback') {
    return (
      <QueueLayout>
        <div className="h-full flex flex-col items-center justify-center">
          {/* Star Rating Container - White rounded container */}
          <div className="bg-white rounded-lg shadow-xl drop-shadow-lg p-12 max-w-2xl mx-auto text-center mb-8">
            {/* Main Heading */}
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How was your experience today?
            </h2>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-12">
              Please let us know how we did by leaving a star rating
            </p>

            {/* Star Rating Container */}
            <div className="mb-8">
              {/* Star Rating */}
              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setStarRating(star)}
                    className="text-6xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-200 rounded-lg p-2"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    {star <= starRating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Rating Labels */}
              <div className="flex justify-between text-lg text-gray-500 max-w-md mx-auto">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Submit Button - Positioned outside and below the star rating container */}
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentStep('thankYou')}
              disabled={starRating === 0}
              className={`px-8 py-4 rounded-full font-bold text-xl transition-all duration-150 shadow-lg ${
                starRating > 0
                  ? 'bg-[#FFE251] text-[#1A2E56] active:bg-[#FFE251] active:shadow-md active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </QueueLayout>
    );
  }

  // Thank You Step
  if (currentStep === 'thankYou') {
    return (
      <KioskLayout>
        <div className="h-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl drop-shadow-lg p-12 max-w-2xl mx-auto text-center">
            {/* Sparkle Icon - Center-aligned and reduced size */}
            <div className="flex justify-center mb-6">
              <HiSparkles className="text-6xl text-[#FFE251]" />
            </div>

            {/* Thank You Message */}
            <h2 className="text-3xl font-bold text-[#1F3463] mb-4">
              Thank you!
            </h2>

            {/* Subtext */}
            <p className="text-3xl text-[#1F3463]">
              Your feedback is much appreciated!
            </p>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Office Selection: Use KioskLayout with navigation
  if (currentStep === 'department') {
    return (
      <KioskLayout>
        <div className="h-full flex flex-col">
          {/* Office Selection Grid */}
          <div className="flex-grow flex items-center justify-center h-full">
            {/* Centered Header-Grid Unit with Fixed Positioning */}
            <div className="flex flex-col items-center w-full px-20">
              {/* Fixed Header - Absolute positioning to prevent movement */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32">
                <h2 className="text-4xl font-semibold text-center drop-shadow-lg whitespace-nowrap mb-2" style={{ color: '#1F3463' }}>
                  SELECT OFFICE
                </h2>
                {/* Subheader */}
                <p className="text-2xl font-bold text-center drop-shadow-lg mb-8" style={{ color: '#1F3463' }}>
                  CUT OFF TIME: 5:00 PM
                </p>
              </div>

              {/* Responsive Grid Container - Fixed positioning below header */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                <ResponsiveGrid
                  items={offices}
                  onItemClick={(office) => handleOfficeSelect(office.key)}
                  renderItem={(office) => (
                    <div className="text-center flex flex-col items-center">
                      {/* Office Image */}
                      <div className="mb-4">
                        <img
                          src={`/queue/${office.key}.png`}
                          alt={`${office.name} Icon`}
                          className="w-34 h-34 object-contain rounded-xl"
                        />
                      </div>
                      {/* Office Name */}
                      <h3 className="text-xl font-semibold text-white">
                        {office.name}
                      </h3>
                    </div>
                  )}
                  showPagination={offices.length > 6}
                />
              </div>
            </div>
          </div>
        </div>
      </KioskLayout>
    );
  }

  // Privacy Step: Show Data Privacy Modal
  if (currentStep === 'privacy') {
    return (
      <>
        <KioskLayout>
          <div className="h-full flex flex-col">
            {/* Office Selection Grid - Keep visible but disabled */}
            <div className="flex-grow flex items-center justify-center h-full">
              {/* Centered Header-Grid Unit */}
              <div className="flex flex-col items-center w-full">
                {/* Fixed Header */}
                <div className="flex-shrink-0 pb-2">
                  <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#1F3463' }}>
                    SELECT OFFICE
                  </h2>
                </div>

                {/* Centered Grid Container */}
                <div className="pt-4">
                  {/* 2 Office Grid - Disabled state */}
                  <div className="grid grid-cols-2 gap-x-32 gap-y-8 max-w-4xl mx-auto">
                  {offices.map((office) => (
                    <button
                      key={office.key}
                      disabled
                      className="w-80 text-white rounded-3xl shadow-lg drop-shadow-md p-6 opacity-50 cursor-not-allowed border-2 border-transparent"
                      style={{ backgroundColor: '#1F3463' }}
                    >
                      <div className="text-center flex flex-col items-center">
                        {/* Office Image */}
                        <div className="mb-4 px-4">
                          <img
                            src={`/queue/${office.key}.png`}
                            alt={`${office.name} Icon`}
                            className="w-24 h-24 object-contain rounded-xl"
                          />
                        </div>
                        {/* Office Name */}
                        <h3 className="text-xl font-semibold text-white">
                          {office.name}
                        </h3>
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </KioskLayout>

        {/* Data Privacy Modal - Outside KioskLayout to avoid overflow issues */}
        <DataPrivacyModal
          isOpen={showPrivacyModal}
          onNext={handlePrivacyNext}
          onPrevious={handlePrivacyPrevious}
          consent={privacyConsent}
          setConsent={setPrivacyConsent}
        />
      </>
    );
  }

  // Service Selection Step
  if (currentStep === 'service') {
    return (
      <QueueLayout>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            {/* Centered Header-Grid Unit with Fixed Positioning */}
            <div className="flex flex-col items-center w-full relative">
              {/* Fixed Header - Absolute positioning to prevent movement */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32">
                <h2 className="text-4xl font-semibold text-center drop-shadow-lg whitespace-nowrap mb-6" style={{ color: '#1F3463' }}>
                  WHAT WOULD YOU LIKE TO DO?
                </h2>
              </div>

              {/* Responsive Grid Container - Fixed positioning below header */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                <ResponsiveGrid
                items={serviceOptions}
                onItemClick={(service) => handleServiceSelect(service)}
                renderItem={(service) => (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">
                      {service}
                    </h3>
                  </div>
                )}
                showPagination={serviceOptions.length > 6}
              />
              </div>
            </div>
          </div>
        </div>

        <BackButton />
      </QueueLayout>
    );
  }

  // Student Status Check Step (for Enroll service)
  if (currentStep === 'studentStatus') {
    const studentStatusOptions = [
      { key: 'yes', label: 'YES' },
      { key: 'no', label: 'NO' }
    ];

    return (
      <>
        <QueueLayout>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              {/* Centered Header-Grid Unit with Fixed Positioning */}
              <div className="flex flex-col items-center w-full relative">
                {/* Fixed Header - Absolute positioning to prevent movement */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-40">
                  <h2 className="text-4xl font-semibold text-center drop-shadow-lg whitespace-nowrap mb-4" style={{ color: '#1F3463' }}>
                    ARE YOU AN INCOMING NEW STUDENT?
                  </h2>
                  {/* Subheader */}
                  <p className="text-2xl font-light text-center drop-shadow-lg" style={{ color: '#1F3463' }}>
                    *A MINOR OF AGE ISN'T ALLOWED TO PROCESS ENROLLMENT
                  </p>
                </div>

                {/* Responsive Grid Container - Fixed positioning below header */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                  <ResponsiveGrid
                    items={studentStatusOptions}
                    onItemClick={(option) => handleStudentStatusSelect(option.key)}
                    renderItem={(option) => (
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-white">
                          {option.label}
                        </h3>
                      </div>
                    )}
                    showPagination={studentStatusOptions.length > 6}
                  />
                </div>
              </div>
            </div>
          </div>

          <BackButton />
        </QueueLayout>

        {/* Office Mismatch Modal */}
        <OfficeMismatchModal
          isOpen={showOfficeMismatchModal}
          onConfirm={handleOfficeMismatchConfirm}
          onClose={handleOfficeMismatchClose}
          currentOffice={selectedDepartment?.name === "Registrar's Office" ? "Registrar" : "Admissions"}
          suggestedOffice={suggestedOffice}
        />
      </>
    );
  }

  // Role Selection Step
  if (currentStep === 'role') {
    return (
      <QueueLayout>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            {/* Centered Header-Grid Unit with Fixed Positioning */}
            <div className="flex flex-col items-center w-full relative">
              {/* Fixed Header - Absolute positioning to prevent movement */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32">
                <h2 className="text-4xl font-semibold text-center drop-shadow-lg whitespace-nowrap mb-6" style={{ color: '#1F3463' }}>
                  SELECT ROLE
                </h2>
              </div>

              {/* Responsive Grid Container - Fixed positioning below header */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                <ResponsiveGrid
                items={roleOptions}
                onItemClick={(role) => handleRoleSelect(role)}
                renderItem={(role) => (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">
                      {role}
                    </h3>
                  </div>
                )}
                showPagination={roleOptions.length > 6}
              />
              </div>
            </div>
          </div>
        </div>

        <BackButton />
      </QueueLayout>
    );
  }

  // Priority Status Step
  if (currentStep === 'priority') {
    return (
      <QueueLayout>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            {/* Centered Header-Grid Unit with Fixed Positioning */}
            <div className="flex flex-col items-center w-full relative">
              {/* Fixed Header - Absolute positioning to prevent movement */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-40">
                <h2 className="text-4xl font-semibold text-center drop-shadow-lg whitespace-nowrap mb-4" style={{ color: '#1F3463' }}>
                  DO YOU BELONG TO THE FOLLOWING?
                </h2>
                {/* Subheader with bulleted format */}
                <div className="text-2xl font-medium text-center drop-shadow-lg" style={{ color: '#1F3463' }}>
                  <div className="mb-2">• PERSON WITH DISABILITIES (PWD)</div>
                  <div className="mb-2">• SENIOR CITIZEN</div>
                  <div className="mb-2">• PREGNANT</div>
                </div>
              </div>

              {/* Responsive Grid Container - Fixed positioning below header */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
                <ResponsiveGrid
                items={priorityOptions}
                onItemClick={(option) => handlePrioritySelect(option.key)}
                renderItem={(option) => (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">
                      {option.label}
                    </h3>
                  </div>
                )}
                showPagination={priorityOptions.length > 6}
              />
              </div>
            </div>
          </div>
        </div>

        <BackButton />
      </QueueLayout>
    );
  }

  // If we reach here, we should be in the form step or something went wrong
  // Return to department selection as fallback
  return (
    <KioskLayout>
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Something went wrong. Please start over.
        </h2>
        <button
          onClick={handleBackToOffices}
          className="px-6 py-3 bg-[#1F3463] text-white rounded-lg active:bg-[#1A2E56] active:scale-95 transition-all duration-150"
        >
          Back to Department Selection
        </button>
      </div>
    </KioskLayout>
  );
};

export default Queue;
