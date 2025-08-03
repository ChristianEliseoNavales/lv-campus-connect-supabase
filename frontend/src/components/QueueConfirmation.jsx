import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QueueConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queueData = location.state;

  useEffect(() => {
    // Redirect to home if no queue data
    if (!queueData) {
      navigate('/');
      return;
    }
  }, [queueData, navigate]);

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

  const handleNewTransaction = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!queueData) {
    return null;
  }

  const deptInfo = departmentInfo[queueData.department];

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl p-12 max-w-4xl w-full text-center shadow-2xl animate-slide-up">
        <div className="text-8xl mb-8 animate-bounce">
          ✅
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-10">Queue Number Generated!</h1>

        <div className={`border-4 rounded-3xl p-10 mb-10 bg-gray-50 shadow-inner ${deptInfo.colorClasses.border}`}>
          <div className="flex flex-col items-center mb-8">
            <div className={`text-5xl mb-4 ${deptInfo.colorClasses.text}`}>
              {deptInfo.icon}
            </div>
            <h2 className={`text-3xl font-bold ${deptInfo.colorClasses.text}`}>
              {deptInfo.name}
            </h2>
          </div>

          <div className={`
            w-40 h-40 rounded-full text-white flex items-center justify-center
            text-6xl font-black mx-auto mb-6 shadow-2xl border-4 border-white/30
            ${deptInfo.colorClasses.bg} animate-pulse
          `}>
            {queueData.queueNumber}
          </div>

          <div className="text-xl text-gray-700 bg-white p-4 rounded-xl shadow-sm">
            <p><strong className="text-gray-900">Service:</strong> {queueData.service}</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-blue-50 p-8 rounded-2xl mb-8 border-2 border-blue-200">
            <div className="flex items-center justify-center gap-6">
              <span className="text-xl font-medium text-blue-800">Estimated Wait Time:</span>
              <span className="text-3xl font-bold text-blue-600">{queueData.estimatedWait} minutes</span>
            </div>
          </div>

          <div className="text-left bg-yellow-50 p-8 rounded-2xl border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Important Instructions:</h3>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start gap-4">
                <span className="text-yellow-500 font-bold text-xl">•</span>
                Please keep this queue number for reference
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-500 font-bold text-xl">•</span>
                Wait for your number to be called
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-500 font-bold text-xl">•</span>
                Check the display screen for current queue status
              </li>
              <li className="flex items-start gap-4">
                <span className="text-yellow-500 font-bold text-xl">•</span>
                If you miss your turn, please approach the counter
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <button
            onClick={handleNewTransaction}
            className="w-full py-6 px-8 text-white text-2xl font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-lg"
            style={{ backgroundColor: deptInfo.color }}
          >
            🔄 New Transaction
          </button>

          <button
            onClick={handleGoBack}
            className="w-full py-6 px-8 bg-gray-600 hover:bg-gray-700 text-white text-xl font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-lg border-2 border-gray-500 hover:border-gray-400"
          >
            ← Go Back to Main Screen
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <p className="text-lg opacity-90 mb-2">Thank you for using the University Kiosk System</p>
        <p className="text-base opacity-75">For assistance, please contact the information desk</p>
      </div>
    </div>
  );
};

export default QueueConfirmation;
