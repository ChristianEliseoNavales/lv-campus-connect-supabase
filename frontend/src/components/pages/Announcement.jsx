import React from 'react';

const Announcement = () => {
  // Sample announcements data
  const announcements = [
    {
      id: 1,
      title: "Registration for Spring 2024 Semester",
      date: "2024-01-15",
      priority: "high",
      content: "Registration for the Spring 2024 semester is now open. Students can register through the student portal from January 15-30, 2024."
    },
    {
      id: 2,
      title: "Library Extended Hours During Finals",
      date: "2024-01-10",
      priority: "medium",
      content: "The university library will be open 24/7 during finals week (January 20-26) to support student study needs."
    },
    {
      id: 3,
      title: "Campus Maintenance Notice",
      date: "2024-01-08",
      priority: "low",
      content: "Scheduled maintenance on the main campus water system will occur on January 12, 2024, from 6:00 AM to 2:00 PM."
    },
    {
      id: 4,
      title: "New Student Orientation",
      date: "2024-01-05",
      priority: "medium",
      content: "New student orientation sessions will be held every Tuesday and Thursday at 10:00 AM in the Student Center."
    },
    {
      id: 5,
      title: "Scholarship Application Deadline",
      date: "2024-01-03",
      priority: "high",
      content: "The deadline for scholarship applications for the 2024-2025 academic year is February 15, 2024."
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          University Announcements
        </h1>
        <p className="text-lg text-gray-600">
          Stay updated with the latest news and important information
        </p>
      </div>

      {/* Announcements List */}
      <div className="flex-grow overflow-auto">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`border-l-4 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getPriorityIcon(announcement.priority)}
                  <h2 className="text-xl font-semibold text-gray-800 ml-2">
                    {announcement.title}
                  </h2>
                </div>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                  {formatDate(announcement.date)}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            For more information, visit the university website or contact the information desk
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
