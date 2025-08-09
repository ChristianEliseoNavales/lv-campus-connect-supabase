import React, { useState } from 'react';

const Directory = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Organizational chart data for each department
  const organizationalData = {
    admissions: {
      name: "Admissions Office",
      description: "Responsible for student recruitment, application processing, and enrollment management",
      email: "admissions@lv.edu.ph",
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
      email: "registrar@lv.edu.ph",
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
      email: "academic.affairs@lv.edu.ph",
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
      email: "student.services@lv.edu.ph",
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
      name: "MIS Office",
      description: "Manages university technology infrastructure, systems, and digital services",
      email: "it.support@lv.edu.ph",
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
      name: "Human Resource Office",
      description: "Manages employee relations, benefits, recruitment, and organizational development",
      email: "hr@lv.edu.ph",
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
      email: "finance@lv.edu.ph",
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
    },
    communications: {
      name: "Communications Office",
      description: "Manages university communications, public relations, and marketing initiatives",
      email: "communications@lv.edu.ph",
      head: {
        id: 1,
        name: "Ms. Jennifer Adams",
        title: "Director of Communications"
      },
      staff: [
        {
          id: 2,
          name: "Mark Thompson",
          title: "Public Relations Manager",
          reports_to: 1
        },
        {
          id: 3,
          name: "Sarah Wilson",
          title: "Marketing Specialist",
          reports_to: 1
        },
        {
          id: 4,
          name: "David Martinez",
          title: "Social Media Coordinator",
          reports_to: 2
        }
      ]
    }
  };

  const departments = [
    { key: 'registrar', name: "Registrar's Office" },
    { key: 'admissions', name: 'Admissions Office' },
    { key: 'hr', name: 'Human Resource Office' },
    { key: 'communications', name: 'Communications Office' },
    { key: 'it_mis', name: 'MIS Office' }
  ];

  const currentDepartment = organizationalData[selectedDepartment];

  // Component to render individual staff member in triangular org chart
  const StaffMember = ({ person, isHead = false }) => (
    <div className="flex flex-col items-center justify-center space-y-3 w-40">
      {/* Avatar Icon - Perfectly Centered with Enhanced Styling */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
        isHead ? 'text-white' : 'text-white'
      }`} style={{ backgroundColor: 'transparent', border: '2px solid #2F0FE4' }}>
        <svg className="w-8 h-8" viewBox="0 0 24 24" style={{ color: '#2F0FE4' }}>
          {/* Person figure - solid fill with same color as text */}
          <g fill="currentColor">
            {/* Head */}
            <circle cx="12" cy="8.5" r="2.5" />
            {/* Body */}
            <path d="M12 13c-3.5 0-6 2.5-6 5.5v1h12v-1c0-3-2.5-5.5-6-5.5z" />
          </g>
        </svg>
      </div>

      {/* Name and Title - Center Aligned with Consistent Purple-Blue Color */}
      <div className="text-center w-full">
        <h3 className="text-lg font-semibold text-center leading-tight whitespace-nowrap" style={{ color: '#2F0FE4' }}>
          {person.name}
        </h3>
        <p className="text-sm text-center mt-1 whitespace-nowrap" style={{ color: '#2F0FE4' }}>
          {person.title}
        </p>
      </div>
    </div>
  );

  // Function to organize staff into triangular pyramid structure
  const organizeStaffInPyramid = (department) => {
    const allStaff = [department.head, ...department.staff];
    const rows = [];
    let currentIndex = 0;
    let rowSize = 1;

    // Create proper triangular distribution: 1, 2, 3, 4, etc.
    while (currentIndex < allStaff.length) {
      const remainingStaff = allStaff.length - currentIndex;
      const currentRowSize = Math.min(rowSize, remainingStaff);
      const row = allStaff.slice(currentIndex, currentIndex + currentRowSize);
      rows.push(row);
      currentIndex += currentRowSize;
      rowSize++;
    }

    return rows;
  };

  return (
    <div className="h-full flex flex-col">

      {!selectedDepartment ? (
        /* Department Selection Grid */
        <div className="flex-grow flex flex-col">
          {/* Fixed Header */}
          <div className="pt-8 pb-6">
            <h2 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#2F0FE4' }}>
              Select a department
            </h2>
          </div>

          {/* Centered Grid Container */}
          <div className="flex-grow flex items-center justify-center">
            {/* 5 Department Grid: 3 in first row, 2 in second row */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* First Row - 3 departments */}
              {departments.slice(0, 3).map((department) => (
                <button
                  key={department.key}
                  onClick={() => setSelectedDepartment(department.key)}
                  className="bg-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold" style={{ color: '#2F0FE4' }}>
                      {department.name}
                    </h3>
                  </div>
                </button>
              ))}

              {/* Second Row - 2 departments, centered */}
              <div className="col-span-3 grid grid-cols-2 gap-8 max-w-xl mx-auto">
                {departments.slice(3, 5).map((department) => (
                  <button
                    key={department.key}
                    onClick={() => setSelectedDepartment(department.key)}
                    className="bg-white rounded-3xl shadow-lg drop-shadow-md p-6 hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold" style={{ color: '#2F0FE4' }}>
                        {department.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Department Details View - Fixed Header/Footer with Scrollable Content */
        <div className="flex-grow flex flex-col bg-white bg-opacity-80 rounded-2xl shadow-sm overflow-hidden">
          {currentDepartment && (
            <>
              {/* Fixed Header with Department Navigation - Light Background */}
              <div className="bg-gray-200 px-8 py-6 flex-shrink-0 relative border-b border-gray-200">
                {/* Left: Back Button - Positioned Absolutely */}
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 flex items-center transition-colors duration-200 font-semibold z-10 hover:opacity-80"
                  style={{ color: '#2F0FE4' }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>

                {/* Center: Department Name - Perfectly Centered Across Full Width */}
                <div className="flex justify-center items-center w-full">
                  <h1 className="text-3xl font-bold text-center" style={{ color: '#2F0FE4' }}>
                    {currentDepartment.name}
                  </h1>
                </div>

                {/* Right: Find Location - Positioned Absolutely */}
                <button className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center transition-colors duration-200 font-semibold z-10 hover:opacity-80" style={{ color: '#2F0FE4' }}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Find Location
                </button>
              </div>

              {/* Scrollable Staff Content Area */}
              <div className="flex-grow overflow-y-auto px-8 py-8">
                <div className="flex flex-col items-center justify-center space-y-8 min-h-full w-full">
                  {organizeStaffInPyramid(currentDepartment).map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center items-center gap-16 w-full">
                      <div className="flex justify-center items-center gap-16 flex-wrap">
                        {row.map((person, personIndex) => (
                          <StaffMember
                            key={person.id}
                            person={person}
                            isHead={rowIndex === 0 && personIndex === 0}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Footer with Department Email - Seamlessly Integrated */}
              <div className="px-8 py-4 flex-shrink-0">
                <div className="text-center">
                  <p className="text-lg font-medium" style={{ color: '#2F0FE4' }}>
                    <span>Email:</span> <span>{currentDepartment.email}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
