import React from 'react';

const IdleModal = ({ isOpen, countdown, onStayActive }) => {
  console.log('🎭 IdleModal render - isOpen:', isOpen, 'countdown:', countdown);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-3xl p-8 mx-4 max-w-md w-full text-center">
        {/* Warning Icon */}
        <div className="text-6xl mb-6 text-yellow-500 font-bold">
          !
        </div>

        {/* Main Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          You have been inactive for too long.
        </h2>

        {/* Question */}
        <p className="text-lg text-gray-800 mb-6">
          Are you still there?
        </p>

        {/* Countdown Message */}
        <p className="text-lg text-gray-500 mb-8">
          Returning to main screen in {countdown}
        </p>

        {/* YES Button */}
        <button
          onClick={() => {
            console.log('✅ YES button clicked in IdleModal');
            onStayActive();
          }}
          className="w-24 h-24 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 touch-target-lg"
          style={{ backgroundColor: '#1F3463' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2E56'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
        >
          YES
        </button>
      </div>
    </div>
  );
};

export default IdleModal;
