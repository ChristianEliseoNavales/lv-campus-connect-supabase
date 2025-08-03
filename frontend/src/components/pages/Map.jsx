import React, { useState } from 'react';

const Map = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Sample campus buildings data
  const buildings = [
    {
      id: 1,
      name: "Administration Building",
      code: "ADMIN",
      description: "Main administrative offices, Registrar, Admissions",
      departments: ["Registrar Office", "Admissions Office", "Financial Aid", "Student Services"],
      coordinates: { x: 30, y: 25 }
    },
    {
      id: 2,
      name: "Main Library",
      code: "LIB",
      description: "Central library with study areas and research facilities",
      departments: ["Library Services", "Research Center", "Computer Lab"],
      coordinates: { x: 50, y: 35 }
    },
    {
      id: 3,
      name: "Engineering Building",
      code: "ENG",
      description: "Engineering departments and laboratories",
      departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
      coordinates: { x: 70, y: 20 }
    },
    {
      id: 4,
      name: "Student Center",
      code: "SC",
      description: "Student activities, dining, and recreational facilities",
      departments: ["Student Activities", "Dining Services", "Bookstore", "Health Center"],
      coordinates: { x: 40, y: 60 }
    },
    {
      id: 5,
      name: "Science Building",
      code: "SCI",
      description: "Natural sciences departments and laboratories",
      departments: ["Biology", "Chemistry", "Physics", "Mathematics"],
      coordinates: { x: 65, y: 50 }
    },
    {
      id: 6,
      name: "Arts & Humanities",
      code: "AH",
      description: "Liberal arts and humanities departments",
      departments: ["English", "History", "Philosophy", "Art"],
      coordinates: { x: 25, y: 50 }
    }
  ];

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
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

      <div className="flex-grow flex gap-6">
        {/* Map Area */}
        <div className="flex-grow bg-white rounded-lg shadow-md p-6">
          <div className="relative w-full h-full bg-green-50 rounded-lg border-2 border-green-200 overflow-hidden">
            {/* Campus Map Background */}
            <div className="absolute inset-0">
              {/* Pathways */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 0,50 Q 25,45 50,50 T 100,50"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
                <path
                  d="M 50,0 Q 45,25 50,50 T 50,100"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Buildings */}
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    selectedBuilding?.id === building.id
                      ? 'scale-110 z-10'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    left: `${building.coordinates.x}%`,
                    top: `${building.coordinates.y}%`
                  }}
                  onClick={() => handleBuildingClick(building)}
                >
                  <div
                    className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xs border-2 ${
                      selectedBuilding?.id === building.id
                        ? 'bg-blue-600 border-blue-800'
                        : 'bg-blue-900 border-blue-700 hover:bg-blue-800'
                    }`}
                  >
                    {building.code}
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                      {building.name}
                    </span>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-900 rounded mr-2"></div>
                    <span>Buildings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-1 bg-purple-500 mr-2" style={{ borderStyle: 'dashed' }}></div>
                    <span>Pathways</span>
                  </div>
                </div>
              </div>

              {/* Compass */}
              <div className="absolute top-4 right-4 bg-white rounded-full shadow-md p-2 w-12 h-12 flex items-center justify-center">
                <div className="text-xs font-bold text-gray-700">
                  <div className="text-center">N</div>
                  <div className="text-center text-gray-400">↑</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Building Information Panel */}
        <div className="w-80 bg-white rounded-lg shadow-md p-6">
          {selectedBuilding ? (
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                {selectedBuilding.name}
              </h3>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedBuilding.code}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {selectedBuilding.description}
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Departments & Services:</h4>
              <ul className="space-y-2">
                {selectedBuilding.departments.map((dept, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {dept}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Quick Info</h5>
                <div className="text-sm text-blue-800">
                  <p>• Click on other buildings to explore</p>
                  <p>• Follow purple pathways for navigation</p>
                  <p>• All buildings are wheelchair accessible</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Building</h3>
              <p className="text-gray-600 text-sm mb-4">
                Click on any building on the map to view detailed information about departments and services.
              </p>
              
              <div className="text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Available Buildings:</h4>
                <ul className="space-y-2">
                  {buildings.map((building) => (
                    <li
                      key={building.id}
                      className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                      onClick={() => handleBuildingClick(building)}
                    >
                      <span className="w-8 h-6 bg-blue-900 text-white text-xs rounded flex items-center justify-center mr-3">
                        {building.code}
                      </span>
                      {building.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
