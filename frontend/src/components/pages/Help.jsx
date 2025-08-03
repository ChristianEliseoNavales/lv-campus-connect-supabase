import React from 'react';

const Help = () => {
  const helpSections = [
    {
      id: 1,
      title: 'Using the Kiosk',
      icon: '🖥️',
      items: [
        'Touch any navigation button at the bottom to access different sections',
        'Use the search function to quickly find specific information',
        'The home button will always return you to the main page',
        'All content is optimized for touch interaction'
      ]
    },
    {
      id: 2,
      title: 'Queue System',
      icon: '📋',
      items: [
        'Select the department you need to visit',
        'Choose the specific service you require',
        'Fill out the required information form',
        'You will receive a queue number and estimated wait time',
        'Monitor the display screens for your number to be called'
      ]
    },
    {
      id: 3,
      title: 'Finding Information',
      icon: '🔍',
      items: [
        'Use the Search section to find departments, services, or faculty',
        'Check the Directory for contact information',
        'View the Campus Map to locate buildings and offices',
        'Read Announcements for the latest university news'
      ]
    },
    {
      id: 4,
      title: 'Emergency Contacts',
      icon: '🚨',
      items: [
        'Campus Security: (123) 456-7890 (24/7)',
        'Medical Emergency: 911',
        'Information Desk: (123) 456-7800',
        'IT Help Desk: (123) 456-7804'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Join a Queue',
      description: 'Get in line for university services',
      icon: '📝',
      action: 'Go to Queue section'
    },
    {
      title: 'Find a Department',
      description: 'Locate offices and contact information',
      icon: '🏢',
      action: 'Use Search or Directory'
    },
    {
      title: 'Campus Navigation',
      description: 'Find your way around campus',
      icon: '🗺️',
      action: 'View Campus Map'
    },
    {
      title: 'Get Updates',
      description: 'Check latest university news',
      icon: '📢',
      action: 'Read Announcements'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Help & Support
        </h1>
        <p className="text-lg text-gray-600">
          Get assistance with using the campus kiosk system
        </p>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use This System</h2>
          
          {helpSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{section.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Actions and Contact */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{action.icon}</span>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      <span className="text-xs text-blue-600 font-medium">{action.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Need Additional Help?</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Information Desk</p>
                  <p className="text-sm text-blue-700">(123) 456-7800</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Email Support</p>
                  <p className="text-sm text-blue-700">info@university.edu</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Office Hours</p>
                  <p className="text-sm text-blue-700">Monday - Friday: 8:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Location</p>
                  <p className="text-sm text-blue-700">Student Center, Information Desk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Issues</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Kiosk Not Responding</p>
                  <p className="text-sm text-gray-600">Try touching the screen gently. If the issue persists, contact IT support.</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Display Issues</p>
                  <p className="text-sm text-gray-600">If text is unclear or buttons don't work, please report to IT Help Desk.</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">IT Help Desk</p>
                  <p className="text-sm text-gray-600">(123) 456-7804 | helpdesk@university.edu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
