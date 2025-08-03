import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VisitationForm = () => {
  const { department, service } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    purpose: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentInfo = {
    registrar: {
      name: "Registrar's Office",
      icon: '📋',
      colorClasses: {
        border: 'border-blue-600',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        focus: 'focus:border-blue-500 focus:ring-blue-200'
      }
    },
    admissions: {
      name: 'Admissions Office',
      icon: '🎓',
      colorClasses: {
        border: 'border-red-600',
        text: 'text-red-600',
        bg: 'bg-red-600',
        hover: 'hover:bg-red-700',
        focus: 'focus:border-red-500 focus:ring-red-200'
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose of visit is required';
    } else if (formData.purpose.trim().length < 5) {
      newErrors.purpose = 'Please provide more details about your purpose';
    }
    
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.contact = 'Please provide either phone number or email address';
    }
    
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[\d]{7,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }
    
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare contact information as a string
      const contactInfo = [];
      if (formData.phone.trim()) contactInfo.push(`Phone: ${formData.phone.trim()}`);
      if (formData.email.trim()) contactInfo.push(`Email: ${formData.email.trim()}`);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/queue/submit`, {
        department,
        service: decodeURIComponent(service),
        fullName: formData.fullName.trim(),
        purpose: formData.purpose.trim(),
        contact: contactInfo.join(', ')
      });
      
      // Navigate to confirmation page with queue data
      navigate('/confirmation', {
        state: {
          queueNumber: response.data.queueNumber,
          department,
          service: decodeURIComponent(service),
          estimatedWait: response.data.estimatedWait
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/services/${department}`);
  };

  const deptInfo = departmentInfo[department];

  return (
    <div className="min-h-screen bg-indigo-600 p-8 font-sans">
      <div className="relative text-center mb-8 text-white">
        <button
          onClick={handleBack}
          className="absolute left-0 top-0 bg-gray-800 text-white border-none py-4 px-6 rounded-xl text-lg cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-x-2 shadow-lg"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center">
          <div className={`text-4xl mb-2 ${deptInfo.colorClasses.text}`}>
            {deptInfo.icon}
          </div>
          <h1 className={`text-3xl mb-2 font-bold drop-shadow-lg ${deptInfo.colorClasses.text}`}>
            {deptInfo.name}
          </h1>
          <p className="text-xl mb-2 font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            {decodeURIComponent(service)}
          </p>
          <p className="text-lg opacity-90">Please fill out the visitation form</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white/95 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-gray-700 text-lg font-semibold mb-3">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full p-4 text-lg border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="text-red-500 text-sm mt-2 block">{errors.fullName}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="purpose" className="block text-gray-700 text-lg font-semibold mb-3">
              Purpose of Visit *
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className={`w-full p-4 text-lg border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 resize-none ${
                errors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Please describe the purpose of your visit"
              rows="4"
            />
            {errors.purpose && <span className="text-red-500 text-sm mt-2 block">{errors.purpose}</span>}
          </div>

          <div className="mb-8">
            <h3 className="text-gray-700 text-xl font-bold mb-3">Contact Information *</h3>
            <p className="text-gray-600 mb-6">Please provide at least one contact method</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-lg font-semibold mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-4 text-lg border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="e.g., +63 912 345 6789"
                />
                {errors.phone && <span className="text-red-500 text-sm mt-2 block">{errors.phone}</span>}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-4 text-lg border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="e.g., student@university.edu"
                />
                {errors.email && <span className="text-red-500 text-sm mt-2 block">{errors.email}</span>}
              </div>
            </div>

            {errors.contact && <span className="text-red-500 text-sm mt-4 block">{errors.contact}</span>}
          </div>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6">
              {errors.submit}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-4 text-white text-xl font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:transform-none hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: deptInfo.color }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Get Queue Number'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitationForm;
