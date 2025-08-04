import React, { useState } from 'react';

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('1F');

  // Floor options for the dropdown
  const floorOptions = [
    { value: '1F', label: '1st Floor' },
    { value: '2F', label: '2nd Floor' },
    { value: '3F', label: '3rd Floor' },
    { value: '4F', label: '4th Floor' }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Campus Map
        </h1>
        <p className="text-lg text-gray-600">
          Navigate the university campus and find building locations
        </p>
      </div>

      {/* Map Display */}
      <div className="flex-grow bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="/1F.jpg"
            alt="1st Floor Map"
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Search and Floor Selection Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 items-center">
          {/* Search Input */}
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Location
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for rooms, departments, or facilities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Floor Selection */}
          <div className="w-48">
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
              Floor Selection
            </label>
            <select
              id="floor"
              value={selectedFloor}
              onChange={handleFloorChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {floorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
