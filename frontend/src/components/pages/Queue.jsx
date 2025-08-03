import React, { useState } from 'react';

const Queue = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    purpose: '',
    phone: '',
    email: ''
  });

  // Sample departments and services
  const departments = [
    {
      id: 'registrar',
      name: 'Registrar Office',
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
    {
      id: 'admissions',
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
    },
    {
      id: 'financial',
      name: 'Financial Services',
      description: 'Tuition payments, financial aid, scholarships',
      icon: '💰',
      services: [
        'Tuition Payment',
        'Financial Aid Application',
        'Scholarship Information',
        'Payment Plan Setup',
        'Refund Request'
      ],
      currentQueue: 7,
      estimatedWait: '20-25 minutes'
    },
    {
      id: 'student-services',
      name: 'Student Services',
      description: 'General student support and assistance',
      icon: '🎯',
      services: [
        'Student ID Card',
        'Parking Permit',
        'Locker Assignment',
        'General Information',
        'Student Complaint'
      ],
      currentQueue: 2,
      estimatedWait: '5-10 minutes'
    }
  ];

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedService(null);
    setShowForm(false);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would submit to the backend
    alert(`Queue request submitted!\nDepartment: ${selectedDepartment.name}\nService: ${selectedService}\nName: ${formData.fullName}`);
    
    // Reset form
    setFormData({ fullName: '', purpose: '', phone: '', email: '' });
    setShowForm(false);
    setSelectedService(null);
    setSelectedDepartment(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Queue System
        </h1>
        <p className="text-lg text-gray-600">
          Join a queue for university services
        </p>
      </div>

      {!selectedDepartment ? (
        /* Department Selection */
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Select a Department
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((department) => (
              <div
                key={department.id}
                onClick={() => handleDepartmentSelect(department)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-300"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{department.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {department.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {department.description}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Current Queue:</span>
                    <span className="font-semibold text-blue-900">{department.currentQueue} people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estimated Wait:</span>
                    <span className="font-semibold text-green-600">{department.estimatedWait}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedService ? (
        /* Service Selection */
        <div className="flex-grow">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedDepartment(null)}
              className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedDepartment.name} - Select Service
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDepartment.services.map((service, index) => (
              <div
                key={index}
                onClick={() => handleServiceSelect(service)}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-300"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Click to join queue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Form */
        <div className="flex-grow">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedService(null)}
              className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              Join Queue - {selectedService}
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Queue Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Department:</span>
                  <span className="ml-2 font-medium">{selectedDepartment.name}</span>
                </div>
                <div>
                  <span className="text-blue-700">Service:</span>
                  <span className="ml-2 font-medium">{selectedService}</span>
                </div>
                <div>
                  <span className="text-blue-700">Current Queue:</span>
                  <span className="ml-2 font-medium">{selectedDepartment.currentQueue} people</span>
                </div>
                <div>
                  <span className="text-blue-700">Estimated Wait:</span>
                  <span className="ml-2 font-medium">{selectedDepartment.estimatedWait}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose/Details
                  </label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your request..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-semibold text-lg"
                >
                  Join Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queue;
