import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceSelection = () => {
  const { department } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentInfo = {
    registrar: {
      name: "Registrar's Office",
      icon: '📋',
      colorClasses: {
        border: 'border-blue-600',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-700'
      }
    },
    admissions: {
      name: 'Admissions Office',
      icon: '🎓',
      colorClasses: {
        border: 'border-red-600',
        text: 'text-red-600',
        bg: 'bg-red-600',
        hover: 'hover:bg-red-700'
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, [department]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${API_URL}/api/services/${department}`);
      setServices(response.data.services);
      setError(null);
    } catch (err) {
      setError('Failed to load services. Please try again.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    navigate(`/form/${department}/${encodeURIComponent(service)}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-red-600 text-white border-none py-4 px-8 rounded-xl text-lg cursor-pointer mx-2 transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Try Again
          </button>
          <button
            onClick={handleBack}
            className="bg-red-600 text-white border-none py-4 px-8 rounded-xl text-lg cursor-pointer mx-2 transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const deptInfo = departmentInfo[department];

  return (
    <div className="min-h-screen bg-indigo-600 p-8 font-sans">
      <div className="relative text-center mb-12 text-white">
        <button
          onClick={handleBack}
          className="absolute left-0 top-0 bg-gray-800 text-white border-none py-4 px-6 rounded-xl text-lg cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-x-2 shadow-lg"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center">
          <div className={`text-5xl mb-4 ${deptInfo.colorClasses.text}`}>
            {deptInfo.icon}
          </div>
          <h1 className={`text-4xl mb-2 font-bold drop-shadow-lg ${deptInfo.colorClasses.text}`}>
            {deptInfo.name}
          </h1>
          <p className="text-xl opacity-90">Please select the service you need</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className={`
              bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300
              border-4 ${deptInfo.colorClasses.border} shadow-xl min-h-[120px]
              flex items-center gap-6 hover:-translate-y-2 hover:shadow-2xl
              group
            `}
            onClick={() => handleServiceSelect(service)}
          >
            <div className={`
              w-12 h-12 rounded-full text-white flex items-center justify-center
              font-bold text-lg flex-shrink-0 ${deptInfo.colorClasses.bg}
              group-hover:scale-110 transition-transform duration-300
            `}>
              {index + 1}
            </div>
            <h3 className="flex-grow text-lg font-semibold text-gray-800">
              {service}
            </h3>
            <div className={`
              text-2xl font-bold transition-transform duration-300
              group-hover:translate-x-2 ${deptInfo.colorClasses.text}
            `}>
              →
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-white">
        <p className="text-xl mb-4 opacity-90">Touch a service above to continue</p>
        <div className="text-base opacity-70 italic">
          Need assistance? Please contact the information desk.
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
