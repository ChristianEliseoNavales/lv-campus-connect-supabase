import React, { useState, useRef, useEffect } from 'react';
import { KioskLayout } from '../layouts';
import { FaSearch, FaWheelchair, FaPlus, FaMinus, FaExpand, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

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

  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  if (!isVisible && !isAnimating) return null;

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

      {/* Action Buttons Row */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onSpace}
          className="w-40 h-16 bg-white border-2 border-gray-400 rounded-lg text-xl font-bold kiosk-touch-feedback select-none"
        >
          SPACE
        </button>
        <button
          onClick={onBackspace}
          className="w-32 h-16 bg-white border-2 border-gray-400 rounded-lg text-xl font-bold kiosk-touch-feedback select-none"
        >
          ⌫
        </button>
        <button
          onClick={onEnter}
          className="w-32 h-16 bg-white border-2 border-gray-400 rounded-lg text-xl font-bold kiosk-touch-feedback select-none"
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('1F');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Floor options for the dropdown
  const floorOptions = [
    { value: '1F', label: '1st Floor' },
    { value: '2F', label: '2nd Floor' },
    { value: '3F', label: '3rd Floor' },
    { value: '4F', label: '4th Floor' }
  ];

  // Department options for the dropdown
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'registrar', label: 'Registrar Office' },
    { value: 'admissions', label: 'Admissions Office' },
    { value: 'cashier', label: 'Cashier Office' },
    { value: 'library', label: 'Library' },
    { value: 'guidance', label: 'Guidance Office' },
    { value: 'clinic', label: 'Medical Clinic' },
    { value: 'canteen', label: 'Canteen' }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSearch = () => {
    // Search functionality implementation
    console.log('Searching for:', searchTerm);
  };

  const handleZoomIn = () => {
    // Zoom in functionality implementation
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Zoom out functionality implementation
    console.log('Zoom out');
  };

  const handleFullscreen = () => {
    // Fullscreen toggle functionality implementation
    console.log('Toggle fullscreen');
  };

  const handleAccessibility = () => {
    // Accessibility features toggle functionality implementation
    console.log('Toggle accessibility features');
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowKeyboard(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  // Keyboard handling functions
  const handleKeyPress = (key) => {
    setSearchTerm(prev => prev + key);
  };

  const handleBackspace = () => {
    setSearchTerm(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setSearchTerm(prev => prev + ' ');
  };

  const handleEnter = () => {
    // Could trigger search functionality here
    setShowKeyboard(false);
    setIsSearchFocused(false);
  };

  return (
    <KioskLayout>
      <div className="h-full flex flex-col">
        {/* Search Bar at Top */}
        <div className="rounded-3xl p-4 mb-4">
          <div className="flex gap-4 items-center">
            <div className="flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search for rooms, departments, or facilities..."
                className={`w-full px-4 py-3 border-2 rounded-3xl text-lg focus:outline-none transition-colors ${
                  isSearchFocused
                    ? 'border-[#1F3463] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                readOnly={showKeyboard}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#1F3463] text-white px-6 py-3 rounded-3xl hover:bg-[#1A2E56] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center gap-2"
            >
              <FaSearch className="w-5 h-5" />
              <span className="font-semibold">Search</span>
            </button>

            {/* Keyboard Toggle Button - Only show when search is focused or keyboard is visible */}
            {(isSearchFocused || showKeyboard) && (
              <button
                onClick={toggleKeyboard}
                className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  showKeyboard
                    ? 'bg-yellow-300 text-blue-900 font-bold shadow-md'
                    : 'bg-[#1F3463] text-white hover:bg-[#1A2E56]'
                }`}
                aria-label="Toggle virtual keyboard"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L10.586 10 8.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Map Display */}
        <div className={`flex-grow bg-white rounded-lg shadow-md p-6 mb-4 ${showKeyboard ? 'mb-2' : ''}`}>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/1F.jpg"
              alt="1st Floor Map"
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* 3-Column Control Panel */}
        <div className={`rounded-lg shadow-md p-6 ${showKeyboard ? 'mb-4' : ''}`}>
          <div className="grid grid-cols-3 gap-6">
            {/* Column 1 - Department Selector */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-3">
                Department
              </label>
              <div className="flex gap-3">
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463] outline-none bg-white text-lg"
                >
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAccessibility}
                  className="bg-[#1F3463] text-white px-4 py-3 rounded-lg hover:bg-[#1A2E56] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center"
                  title="Accessibility Features"
                  aria-label="Toggle accessibility features"
                >
                  <FaWheelchair className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Column 2 - Floor Level Selector */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label htmlFor="floor" className="block text-sm font-semibold text-gray-700 mb-3">
                Floor Level
              </label>
              <select
                id="floor"
                value={selectedFloor}
                onChange={handleFloorChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463] outline-none bg-white text-lg"
              >
                {floorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Column 3 - Map Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Map Controls
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomIn}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-3 rounded-lg hover:bg-[#1A2E56] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2"
                  title="Zoom In"
                >
                  <FaPlus className="w-4 h-4" />
                  <FaSearchPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-3 rounded-lg hover:bg-[#1A2E56] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2"
                  title="Zoom Out"
                >
                  <FaMinus className="w-4 h-4" />
                  <FaSearchMinus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-3 rounded-lg hover:bg-[#1A2E56] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center"
                  title="Fullscreen"
                >
                  <FaExpand className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* On-Screen Keyboard */}
        {(showKeyboard || isSearchFocused) && (
          <div className="flex justify-center w-full mb-4">
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
    </KioskLayout>
  );
};

export default Map;
