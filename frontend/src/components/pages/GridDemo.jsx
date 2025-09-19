import React, { useState } from 'react';
import { ResponsiveGrid } from '../ui';
import KioskLayout from '../layouts/KioskLayout';

const GridDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState(null);

  // Sample data for different grid configurations
  const demoConfigurations = [
    { key: '1-item', name: '1 Item Grid', count: 1 },
    { key: '2-items', name: '2 Items Grid', count: 2 },
    { key: '3-items', name: '3 Items Grid', count: 3 },
    { key: '4-items', name: '4 Items Grid', count: 4 },
    { key: '5-items', name: '5 Items Grid', count: 5 },
    { key: '6-items', name: '6 Items Grid', count: 6 },
    { key: '7-items', name: '7+ Items Grid (Pagination)', count: 7 },
    { key: '10-items', name: '10 Items Grid (Pagination)', count: 10 }
  ];

  // Generate sample items based on count
  const generateItems = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
      description: `Sample description for item ${index + 1}`
    }));
  };

  const handleDemoSelect = (demoKey) => {
    setSelectedDemo(demoKey);
  };

  const handleItemClick = (item, index) => {
    alert(`Clicked on ${item.name} (Index: ${index})`);
  };

  const handleBackToDemo = () => {
    setSelectedDemo(null);
  };

  const currentDemo = demoConfigurations.find(demo => demo.key === selectedDemo);
  const currentItems = currentDemo ? generateItems(currentDemo.count) : [];

  return (
    <KioskLayout>
      <div className="h-full flex flex-col">
        {!selectedDemo ? (
          /* Demo Selection Grid */
          <div className="flex-grow flex flex-col">
            {/* Fixed Header */}
            <div className="pt-8 pb-6">
              <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#161F55' }}>
                Responsive Grid Demo
              </h2>
              <p className="text-center text-lg mt-4 text-gray-700">
                Select a grid configuration to see the responsive layout in action
              </p>
            </div>

            {/* Demo Selection Grid with Side Navigation Space */}
            <div className="px-20">
              <ResponsiveGrid
                items={demoConfigurations}
                onItemClick={(demo) => handleDemoSelect(demo.key)}
                renderItem={(demo) => (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {demo.name}
                    </h3>
                    <p className="text-sm text-white opacity-90">
                      {demo.count} item{demo.count > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
                showPagination={demoConfigurations.length > 6}
              />
            </div>
          </div>
        ) : (
          /* Selected Demo Display */
          <div className="flex-grow flex flex-col h-full">
            {/* Header with Back Button */}
            <div className="flex-shrink-0 pt-8 pb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleBackToDemo}
                  className="flex items-center px-6 py-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  style={{ backgroundColor: '#1F3463' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2E56'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Demo Selection
                </button>
              </div>

              <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#161F55' }}>
                {currentDemo?.name}
              </h2>
              <p className="text-center text-lg mt-2 text-gray-700">
                Displaying {currentDemo?.count} items with responsive grid layout
              </p>
            </div>

            {/* Demo Grid Display with Side Navigation Space - Properly Centered */}
            <div className="flex-grow flex items-center justify-center px-20">
              <div className="w-full">
                <ResponsiveGrid
                  items={currentItems}
                  onItemClick={handleItemClick}
                  renderItem={(item) => (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-white opacity-90">
                        {item.description}
                      </p>
                    </div>
                  )}
                  showPagination={currentItems.length > 6}
                  maxItemsPerPage={6}
                />
              </div>
            </div>

            {/* Grid Layout Information */}
            <div className="mt-8 bg-white bg-opacity-90 rounded-lg p-6 mx-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F3463' }}>
                Grid Layout Rules Applied:
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                {currentDemo?.count === 1 && (
                  <p>• <strong>1 item:</strong> Single column, centered</p>
                )}
                {currentDemo?.count === 2 && (
                  <p>• <strong>2 items:</strong> 2 columns × 1 row, centered</p>
                )}
                {currentDemo?.count === 3 && (
                  <p>• <strong>3 items:</strong> 3 columns × 1 row, centered</p>
                )}
                {currentDemo?.count === 4 && (
                  <p>• <strong>4 items:</strong> 2 columns × 2 rows, centered</p>
                )}
                {currentDemo?.count === 5 && (
                  <div>
                    <p>• <strong>5 items:</strong> Special layout</p>
                    <p className="ml-4">- Row 1: 3 columns (items 1, 2, 3)</p>
                    <p className="ml-4">- Row 2: 2 columns centered (items 4, 5)</p>
                  </div>
                )}
                {currentDemo?.count === 6 && (
                  <p>• <strong>6 items:</strong> 3 columns × 2 rows, all cells filled</p>
                )}
                {currentDemo?.count >= 7 && (
                  <div>
                    <p>• <strong>7+ items:</strong> Pagination enabled</p>
                    <p className="ml-4">- Maximum 6 items per page</p>
                    <p className="ml-4">- Navigation controls for cycling through pages</p>
                    <p className="ml-4">- Page indicators showing current position</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </KioskLayout>
  );
};

export default GridDemo;
