import React from 'react';

const Home = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Welcome Section - Full width utilization */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Welcome to LVCampusConnect
        </h1>
        <p className="text-xl text-gray-700 mx-auto px-4">
          Your gateway to university services and information. Navigate through our campus resources using the menu below.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Quick Access Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-900">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Queue System</h3>
            <p className="text-sm text-gray-600">Join queues for various university services</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-600">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Campus Map</h3>
            <p className="text-sm text-gray-600">Find your way around campus</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-purple-600">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Directory</h3>
            <p className="text-sm text-gray-600">Find staff and department contacts</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-orange-600">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Announcements</h3>
            <p className="text-sm text-gray-600">Latest university news and updates</p>
          </div>
        </div>
      </div>

      {/* University Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">University Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Office Hours</h3>
              <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p className="text-gray-600">Saturday: 8:00 AM - 12:00 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Emergency Contact</h3>
              <p className="text-gray-600">Campus Security: (123) 456-7890</p>
              <p className="text-gray-600">Medical Emergency: 911</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
              <p className="text-gray-600">Use the navigation menu below to access services</p>
              <p className="text-gray-600">Touch any button to get started</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
