import React, { useState } from 'react';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample directory data
  const directoryData = [
    {
      id: 1,
      name: "Dr. John Smith",
      title: "Professor of Computer Science",
      department: "Engineering",
      category: "faculty",
      email: "john.smith@university.edu",
      phone: "(123) 456-7801",
      office: "Engineering Building, Room 305",
      hours: "Mon-Fri 9:00 AM - 5:00 PM"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Registrar",
      department: "Administration",
      category: "staff",
      email: "sarah.johnson@university.edu",
      phone: "(123) 456-7802",
      office: "Administration Building, Room 101",
      hours: "Mon-Fri 8:00 AM - 4:30 PM"
    },
    {
      id: 3,
      name: "Dr. Maria Garcia",
      title: "Dean of Students",
      department: "Student Affairs",
      category: "administration",
      email: "maria.garcia@university.edu",
      phone: "(123) 456-7803",
      office: "Student Center, Room 200",
      hours: "Mon-Fri 8:30 AM - 5:00 PM"
    },
    {
      id: 4,
      name: "Michael Brown",
      title: "IT Support Specialist",
      department: "Information Technology",
      category: "staff",
      email: "michael.brown@university.edu",
      phone: "(123) 456-7804",
      office: "Technology Center, Room 100",
      hours: "Mon-Fri 7:00 AM - 6:00 PM"
    },
    {
      id: 5,
      name: "Dr. Emily Davis",
      title: "Professor of Biology",
      department: "Sciences",
      category: "faculty",
      email: "emily.davis@university.edu",
      phone: "(123) 456-7805",
      office: "Science Building, Room 210",
      hours: "Tue-Thu 10:00 AM - 4:00 PM"
    },
    {
      id: 6,
      name: "Robert Wilson",
      title: "Admissions Counselor",
      department: "Admissions",
      category: "staff",
      email: "robert.wilson@university.edu",
      phone: "(123) 456-7806",
      office: "Administration Building, Room 201",
      hours: "Mon-Fri 8:00 AM - 5:00 PM"
    },
    {
      id: 7,
      name: "Dr. Lisa Anderson",
      title: "Department Chair - Mathematics",
      department: "Sciences",
      category: "administration",
      email: "lisa.anderson@university.edu",
      phone: "(123) 456-7807",
      office: "Science Building, Room 150",
      hours: "Mon-Wed-Fri 9:00 AM - 3:00 PM"
    },
    {
      id: 8,
      name: "Campus Security",
      title: "Security Services",
      department: "Safety",
      category: "service",
      email: "security@university.edu",
      phone: "(123) 456-7890",
      office: "Security Office, Main Gate",
      hours: "24/7"
    }
  ];

  const filteredData = directoryData.filter(person => {
    const matchesCategory = selectedCategory === 'all' || person.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'faculty':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        );
      case 'staff':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'administration':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        );
      case 'service':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'administration':
        return 'bg-purple-100 text-purple-800';
      case 'service':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          University Directory
        </h1>
        <p className="text-lg text-gray-600">
          Find contact information for faculty, staff, and services
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Directory
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, title, or department..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="all">All Categories</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
              <option value="administration">Administration</option>
              <option value="service">Services</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Results */}
      <div className="flex-grow overflow-auto">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getCategoryIcon(person.category)}
                    <div className="ml-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {person.name}
                      </h3>
                      <p className="text-gray-600">{person.title}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(person.category)}`}>
                    {person.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{person.department}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-sm">{person.email}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-sm">{person.phone}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{person.office}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{person.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
