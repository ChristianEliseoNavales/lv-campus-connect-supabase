import React, { useState, useEffect } from 'react';

const PortalQueue = () => {
  // State for dynamic data (prepare for future integration)
  const [queueNumber] = useState(42); // Example queue number
  const [selectedOffice] = useState('Registrar'); // Example office
  const [assignedWindow] = useState(3); // Example window
  const [currentDate, setCurrentDate] = useState('');
  const [nowServing] = useState(38); // Example current serving number
  const [waitingNumbers] = useState([39, 40]); // Example waiting numbers

  // Set current date on component mount
  useEffect(() => {
    const today = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-kiosk-public">
      {/* Header Section */}
      <header
        className="w-full flex-shrink-0 relative bg-cover bg-center bg-no-repeat h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40"
        style={{
          backgroundImage: 'url(/mobile/headerBg.png)'
        }}
      >
        {/* White Overlay for Text Readability */}
        <div className="absolute inset-0 bg-white opacity-20"></div>

        {/* Header Content Container - Simplified flex structure for perfect centering */}
        <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Centered Content Group - Single flex container with proper alignment */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-[98%] xs:max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-none overflow-hidden">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/mobile/logo.png"
                alt="University Logo"
                className="h-10 w-auto xs:h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 object-contain"
              />
            </div>

            {/* Header Text */}
            <div className="flex-shrink min-w-0 flex items-center justify-center">
              <h1
                className="font-days-one text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-center leading-tight whitespace-nowrap"
                style={{
                  color: '#1F3463',
                  lineHeight: '0.9' // Tighter line height for better vertical centering
                }}
              >
                LVCampusConnect
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-4 sm:px-6 sm:py-6 md:py-8">
        {/* Date Validity Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium px-2">
            This queue is only valid on{' '}
            <span className="font-semibold" style={{ color: '#1F3463' }}>
              {currentDate}
            </span>
          </p>
        </div>

        {/* Queue Number Display - Large Circular Border */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 border-4 rounded-full flex items-center justify-center bg-white shadow-lg"
            style={{ borderColor: '#1F3463' }}
          >
            <span
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
              style={{ color: '#1F3463' }}
            >
              {queueNumber.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Queue Information Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 space-y-2 sm:space-y-3 md:space-y-4 px-2">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ color: '#1F3463' }}
          >
            Queue Number
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            <span className="font-semibold">Location: <br />{selectedOffice} Office</span> 
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            Please Proceed to
          </p>
          <p
            className="text-lg sm:text-xl md:text-2xl font-bold"
            style={{ color: '#1F3463' }}
          >
            Window {assignedWindow}
          </p>
        </div>

        {/* Queue Status Container */}
        <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 mx-auto max-w-sm sm:max-w-md md:max-w-lg">
          {/* Labels */}
          <div className="flex justify-between mb-4 text-sm sm:text-base font-medium text-gray-600">
            <span>Serving</span>
            <span className="text-right">Waiting in line</span>
          </div>

          {/* Status Boxes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Now Serving Box */}
            <div
              className="text-white rounded-xl p-3 p-6 text-center"
              style={{ backgroundColor: '#1F3463' }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {nowServing.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Waiting Boxes */}
            {waitingNumbers.map((number, index) => (
              <div
                key={index}
                className="bg-gray-200 text-gray-700 rounded-xl p-6 text-center"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {number.toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full flex-shrink-0 mt-auto py-4 px-4">
        <div className="text-center">
          <p className="font-tolkien text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            © 2025. LA VERDAD CHRISTIAN COLLEGE, INC.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortalQueue;
