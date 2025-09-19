import React, { useState } from 'react';
import { KioskLayout } from '../layouts';
import { FaSearch, FaWheelchair, FaPlus, FaMinus, FaExpand, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import HolographicKeyboard from '../ui/HolographicKeyboard';



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
    { value: '', label: 'Select Department' },
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

  const hideKeyboard = () => {
    setShowKeyboard(false);
    setIsSearchFocused(false);
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

  return (
    <KioskLayout>
      <div className="h-full flex flex-col">
        {/* Search Bar at Top */}
        <div className="rounded-3xl mb-4 flex justify-center">
          <div className="w-3/5 flex gap-4 items-center">
            <div className="flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search for rooms, departments, or facilities..."
                className={`w-full px-4 py-3 border-2 rounded-3xl text-lg focus:outline-none transition-colors shadow-lg focus:shadow-xl ${
                  isSearchFocused
                    ? 'border-[#1F3463] bg-blue-50'
                    : 'border-gray-300 active:border-gray-400'
                }`}
                readOnly
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#FFE251] text-[#1A2E56] px-6 py-3 rounded-3xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center gap-2 shadow-lg active:shadow-md active:scale-95 drop-shadow-md"
            >
              <FaSearch className="w-5 h-5" />
              <span className="font-semibold">Search</span>
            </button>


          </div>
        </div>

        {/* Map Display */}
        <div className="flex-grow bg-white rounded-lg shadow-xl drop-shadow-lg p-6 mb-2">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/map/1F.jpg"
              alt="1st Floor Map"
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            {/* Column 1 - Department Selector */}
            <div>
              <div className="relative">
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463] outline-none bg-white text-lg h-14 appearance-none cursor-pointer shadow-lg focus:shadow-xl"
                >
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Column 2 - Floor Level Selector */}
            <div>
              <div className="relative">
                <select
                  id="floor"
                  value={selectedFloor}
                  onChange={handleFloorChange}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463] outline-none bg-white text-lg h-14 appearance-none cursor-pointer shadow-lg focus:shadow-xl"
                >
                  {floorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Column 3 - Map Controls */}
            <div>
              <div className="flex h-14 shadow-lg drop-shadow-md rounded-2xl overflow-hidden">
                <button
                  onClick={handleAccessibility}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-4 active:bg-[#1A2E56] active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2 border-r border-[#1A2E56]"
                  title="Accessibility Features"
                  aria-label="Toggle accessibility features"
                >
                  <FaWheelchair className="w-6 h-6" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-4 active:bg-[#1A2E56] active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2 border-r border-[#1A2E56]"
                  title="Zoom In"
                >
                  <FaSearchPlus className="w-6 h-6" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-4 active:bg-[#1A2E56] active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center gap-2 border-r border-[#1A2E56]"
                  title="Zoom Out"
                >
                  <FaSearchMinus className="w-6 h-6" />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="flex-1 bg-[#1F3463] text-white px-3 py-4 active:bg-[#1A2E56] active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center"
                  title="Fullscreen"
                >
                  <FaExpand className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Holographic Keyboard Overlay */}
      <HolographicKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
        onHide={hideKeyboard}
        isVisible={showKeyboard}
        activeInputValue={searchTerm}
        activeInputLabel="SEARCH"
        activeInputPlaceholder="Search for rooms, departments, or facilities..."
      />
    </KioskLayout>
  );
};

export default Map;
