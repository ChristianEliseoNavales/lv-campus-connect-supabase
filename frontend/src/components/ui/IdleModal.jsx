import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineExclamationCircle } from "react-icons/ai";

const IdleModal = ({ isOpen, countdown, onStayActive }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center font-kiosk-public">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-3xl drop-shadow-2xl px-4 py-8 mx-4 max-w-md w-full text-center">
        {/* Main Message with Warning Icon */}
        <h2 className="text-2xl font-bold text-[#1F3463] mb-6 flex items-center justify-center">
          <AiOutlineExclamationCircle className="text-[#1F3463] mr-2" />
          You have been inactive for too long.
        </h2>

        {/* Question */}
        <p className="text-xl text-[#1F3463] mb-6">
          Are you still there?
        </p>

        {/* Countdown Message */}
        <p className="text-xl text-gray-500 mb-2">
          Returning to main screen in {countdown}
        </p>
      </div>

      {/* Buttons positioned just below the modal */}
      <div className="relative flex justify-center gap-4 mt-6">
        {/* YES Button */}
        <button
          onClick={onStayActive}
          className="w-24 h-24 text-[#1F3463] font-bold text-xl border-2 border-white rounded-full shadow-lg active:shadow-md drop-shadow-lg active:drop-shadow-sm active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 touch-target-lg"
          style={{ backgroundColor: '#FFE251' }}
          onTouchStart={(e) => e.target.style.backgroundColor = '#E6CB49'}
          onTouchEnd={(e) => e.target.style.backgroundColor = '#FFE251'}
          onMouseDown={(e) => e.target.style.backgroundColor = '#E6CB49'}
          onMouseUp={(e) => e.target.style.backgroundColor = '#FFE251'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FFE251'}
        >
          YES
        </button>

        {/* HOME Button */}
        <button
          onClick={() => navigate('/')}
          className="w-24 h-24 text-white font-bold text-xl border-2 border-white rounded-full shadow-lg active:shadow-md drop-shadow-lg active:drop-shadow-sm active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 touch-target-lg"
          style={{ backgroundColor: '#1F3463' }}
          onTouchStart={(e) => e.target.style.backgroundColor = '#1A2E56'}
          onTouchEnd={(e) => e.target.style.backgroundColor = '#1F3463'}
          onMouseDown={(e) => e.target.style.backgroundColor = '#1A2E56'}
          onMouseUp={(e) => e.target.style.backgroundColor = '#1F3463'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
        >
          HOME
        </button>
      </div>
    </div>
  );
};

export default IdleModal;
