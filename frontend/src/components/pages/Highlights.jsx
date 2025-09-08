import React, { useState } from 'react';

const Highlights = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Education categories following the pattern from Queue and Directory pages
  const categories = [
    { key: 'basic', name: 'Basic Education' },
    { key: 'higher', name: 'Higher Education' }
  ];

  // Sample highlights data organized by category
  const highlightsData = {
    basic: {
      name: 'Basic Education',
      description: 'Elementary and Secondary Education Highlights',
      highlights: [
        {
          id: 1,
          title: "Elementary School Science Fair 2024",
          date: "2024-01-15",
          priority: "high",
          content: "Annual science fair showcasing innovative projects from grades 1-6. Winners will represent the school in regional competitions."
        },
        {
          id: 2,
          title: "High School Academic Excellence Awards",
          date: "2024-01-10",
          priority: "medium",
          content: "Recognition ceremony for outstanding academic performance in secondary education programs."
        },
        {
          id: 3,
          title: "New Learning Management System",
          date: "2024-01-08",
          priority: "medium",
          content: "Implementation of advanced digital learning platform for enhanced student-teacher interaction."
        }
      ]
    },
    higher: {
      name: 'Higher Education',
      description: 'College and University Education Highlights',
      highlights: [
        {
          id: 4,
          title: "Research Excellence Program Launch",
          date: "2024-01-12",
          priority: "high",
          content: "New research initiative supporting undergraduate and graduate student research projects across all disciplines."
        },
        {
          id: 5,
          title: "International Exchange Program",
          date: "2024-01-09",
          priority: "high",
          content: "Partnership agreements with universities worldwide offering semester abroad opportunities for students."
        },
        {
          id: 6,
          title: "Career Development Workshop Series",
          date: "2024-01-05",
          priority: "medium",
          content: "Monthly workshops focusing on professional skills, resume building, and interview preparation."
        }
      ]
    }
  };

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(highlightsData[categoryKey]);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

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
      {!selectedCategory ? (
        /* Category Selection Grid - Following Queue and Directory pattern */
        <div className="flex-grow flex flex-col">

          {/* Centered Grid Container */}
          <div className="flex-grow flex items-center justify-center">
            {/* 2 Category Grid */}
            <div className="grid grid-cols-2 gap-x-32 gap-y-8 max-w-5xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategorySelect(category.key)}
                  className="text-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                  style={{ backgroundColor: '#1F3463' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2E56'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1F3463'}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Selected Category Highlights Display */
        <div className="h-full flex flex-col">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Categories
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold" style={{ color: '#1F3463' }}>
                {selectedCategory.name} HIGHLIGHTS
              </h1>
              <p className="text-lg text-gray-600">
                {selectedCategory.description}
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          {/* Highlights List */}
          <div className="flex-grow overflow-auto">
            <div className="space-y-4">
              {selectedCategory.highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`border-l-4 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ${getPriorityColor(highlight.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getPriorityIcon(highlight.priority)}
                      <h2 className="text-xl font-semibold text-gray-800 ml-2">
                        {highlight.title}
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                      {formatDate(highlight.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {highlight.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highlights;
