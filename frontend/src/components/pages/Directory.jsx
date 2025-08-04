import React, { useState } from 'react';

const Directory = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('admissions');
  const [searchTerm, setSearchTerm] = useState('');

  // Organizational chart data for each department
  const organizationalData = {
    admissions: {
      name: "Admissions Office",
      description: "Responsible for student recruitment, application processing, and enrollment management",
      email: "admissions@university.edu",
      head: {
        id: 1,
        name: "Dr. Patricia Williams",
        title: "Director of Admissions"
      },
      staff: [
        {
          id: 2,
          name: "Robert Wilson",
          title: "Senior Admissions Counselor",
          reports_to: 1
        },
        {
          id: 3,
          name: "Jennifer Martinez",
          title: "Admissions Counselor",
          reports_to: 1
        },
        {
          id: 4,
          name: "David Chen",
          title: "International Admissions Specialist",
          reports_to: 1
        },
        {
          id: 5,
          name: "Lisa Thompson",
          title: "Admissions Assistant",
          reports_to: 2
        }
      ]
    },
    registrar: {
      name: "Registrar Office",
      description: "Manages student records, transcripts, enrollment verification, and academic scheduling",
      email: "registrar@university.edu",
      head: {
        id: 1,
        name: "Sarah Johnson",
        title: "University Registrar"
      },
      staff: [
        {
          id: 2,
          name: "Mark Rodriguez",
          title: "Assistant Registrar",
          reports_to: 1
        },
        {
          id: 3,
          name: "Amanda Foster",
          title: "Records Specialist",
          reports_to: 2
        },
        {
          id: 4,
          name: "Kevin Park",
          title: "Scheduling Coordinator",
          reports_to: 2
        },
        {
          id: 5,
          name: "Rachel Green",
          title: "Transcript Specialist",
          reports_to: 3
        }
      ]
    },
    academic: {
      name: "Academic Affairs",
      description: "Oversees curriculum development, faculty affairs, and academic policy implementation",
      email: "academic.affairs@university.edu",
      head: {
        id: 1,
        name: "Dr. Michael Harrison",
        title: "Vice President of Academic Affairs"
      },
      staff: [
        {
          id: 2,
          name: "Dr. Susan Lee",
          title: "Associate VP of Academic Affairs",
          reports_to: 1
        },
        {
          id: 3,
          name: "Dr. James Wright",
          title: "Dean of Liberal Arts",
          reports_to: 2
        },
        {
          id: 4,
          name: "Dr. Maria Santos",
          title: "Dean of Sciences",
          reports_to: 2
        },
        {
          id: 5,
          name: "Dr. Robert Kim",
          title: "Dean of Engineering",
          reports_to: 2
        }
      ]
    },
    student_services: {
      name: "Student Services",
      description: "Provides comprehensive support services for student success and campus life",
      email: "student.services@university.edu",
      head: {
        id: 1,
        name: "Dr. Maria Garcia",
        title: "Dean of Students"
      },
      staff: [
        {
          id: 2,
          name: "Carlos Mendez",
          title: "Director of Student Life",
          reports_to: 1
        },
        {
          id: 3,
          name: "Dr. Angela Davis",
          title: "Director of Counseling Services",
          reports_to: 1
        },
        {
          id: 4,
          name: "Thomas Brown",
          title: "Financial Aid Director",
          reports_to: 1
        },
        {
          id: 5,
          name: "Nicole White",
          title: "Student Activities Coordinator",
          reports_to: 2
        }
      ]
    },
    it_mis: {
      name: "Information Technology / MIS",
      description: "Manages university technology infrastructure, systems, and digital services",
      email: "it.support@university.edu",
      head: {
        id: 1,
        name: "Dr. Steven Taylor",
        title: "Chief Information Officer"
      },
      staff: [
        {
          id: 2,
          name: "Michael Brown",
          title: "IT Director",
          reports_to: 1
        },
        {
          id: 3,
          name: "Jessica Liu",
          title: "Network Administrator",
          reports_to: 2
        },
        {
          id: 4,
          name: "Daniel Cooper",
          title: "Systems Analyst",
          reports_to: 2
        },
        {
          id: 5,
          name: "Emily Zhang",
          title: "Help Desk Supervisor",
          reports_to: 2
        }
      ]
    },
    hr: {
      name: "Human Resources",
      description: "Manages employee relations, benefits, recruitment, and organizational development",
      email: "hr@university.edu",
      head: {
        id: 1,
        name: "Linda Johnson",
        title: "Director of Human Resources"
      },
      staff: [
        {
          id: 2,
          name: "Patricia Adams",
          title: "HR Business Partner",
          reports_to: 1
        },
        {
          id: 3,
          name: "Christopher Lee",
          title: "Benefits Administrator",
          reports_to: 1
        },
        {
          id: 4,
          name: "Michelle Torres",
          title: "Recruitment Specialist",
          reports_to: 2
        }
      ]
    },
    finance: {
      name: "Finance & Administration",
      description: "Oversees financial operations, budgeting, accounting, and administrative services",
      email: "finance@university.edu",
      head: {
        id: 1,
        name: "Dr. Richard Thompson",
        title: "Vice President of Finance"
      },
      staff: [
        {
          id: 2,
          name: "Catherine Miller",
          title: "Controller",
          reports_to: 1
        },
        {
          id: 3,
          name: "Andrew Wilson",
          title: "Budget Director",
          reports_to: 1
        },
        {
          id: 4,
          name: "Sandra Martinez",
          title: "Accounts Payable Manager",
          reports_to: 2
        },
        {
          id: 5,
          name: "Brian Davis",
          title: "Purchasing Manager",
          reports_to: 1
        }
      ]
    }
  };

  const departments = [
    { key: 'admissions', name: 'Admissions Office', icon: '🎓' },
    { key: 'registrar', name: 'Registrar Office', icon: '📋' },
    { key: 'academic', name: 'Academic Affairs', icon: '📚' },
    { key: 'student_services', name: 'Student Services', icon: '🏫' },
    { key: 'it_mis', name: 'IT / MIS', icon: '💻' },
    { key: 'hr', name: 'Human Resources', icon: '👥' },
    { key: 'finance', name: 'Finance & Administration', icon: '💰' }
  ];

  // Filter departments based on search term for dropdown
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentDepartment = organizationalData[selectedDepartment];

  // Component to render individual staff member cards
  const StaffCard = ({ person, isHead = false }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 ${
      isHead ? 'border-2 border-blue-500 bg-blue-50' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            isHead ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isHead ? 'text-blue-900' : 'text-gray-800'}`}>
              {person.name}
            </h3>
            <p className={`text-sm ${isHead ? 'text-blue-700' : 'text-gray-600'}`}>
              {person.title}
            </p>
          </div>
        </div>
        {isHead && (
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            Department Head
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          University Organizational Directory
        </h1>
        <p className="text-lg text-gray-600">
          Explore departmental organizational charts and staff hierarchies
        </p>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Department</h2>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-grow">
            <label htmlFor="department-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Departments
            </label>
            <input
              type="text"
              id="department-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter department name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Department Dropdown */}
          <div className="md:w-64">
            <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <select
              id="department-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <option key={dept.key} value={dept.key}>
                    {dept.icon} {dept.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No departments match your search
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Organizational Chart */}
      <div className="flex-grow overflow-auto">
        {currentDepartment && (
          <div className="space-y-6">
            {/* Department Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {currentDepartment.name}
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {currentDepartment.description}
              </p>
              <div className="flex items-center text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="font-medium">Department Email: {currentDepartment.email}</span>
              </div>
            </div>

            {/* Department Head */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                Department Leadership
              </h3>
              <div className="mb-8">
                <StaffCard person={currentDepartment.head} isHead={true} />
              </div>
            </div>

            {/* Staff Members */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                Department Staff ({currentDepartment.staff.length})
              </h3>

              {/* Direct Reports */}
              <div className="space-y-6">
                {/* Level 1 - Direct reports to head */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Direct Reports</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {currentDepartment.staff
                      .filter(person => person.reports_to === currentDepartment.head.id)
                      .map((person) => (
                        <StaffCard key={person.id} person={person} />
                      ))}
                  </div>
                </div>

                {/* Level 2 - Reports to direct reports */}
                {currentDepartment.staff.some(person =>
                  person.reports_to !== currentDepartment.head.id
                ) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Team Members</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {currentDepartment.staff
                        .filter(person => person.reports_to !== currentDepartment.head.id)
                        .map((person) => {
                          const supervisor = currentDepartment.staff.find(s => s.id === person.reports_to);
                          return (
                            <div key={person.id} className="relative">
                              <StaffCard person={person} />
                              {supervisor && (
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                  Reports to: {supervisor.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
