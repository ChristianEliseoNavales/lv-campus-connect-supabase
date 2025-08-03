import React from 'react';
import { useNavigate } from 'react-router-dom';

const DepartmentSelection = () => {
  const navigate = useNavigate();

  const departments = [
    {
      id: 'registrar',
      name: "Registrar's Office",
      description: 'Student records, transcripts, certificates, and academic documentation',
      icon: '📋',
      color: '#2563eb'
    },
    {
      id: 'admissions',
      name: 'Admissions Office',
      description: 'Application processing, entrance exams, and admission inquiries',
      icon: '🎓',
      color: '#dc2626'
    }
  ];

  const handleDepartmentSelect = (departmentId) => {
    navigate(`/services/${departmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">University Kiosk System</h1>
          <p className="text-xl text-gray-600">Please select the department you wish to visit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer p-8 text-center touch-target-lg"
              onClick={() => handleDepartmentSelect(dept.id)}
              style={{ borderColor: dept.color }}
            >
              <div className="text-6xl mb-4" style={{ color: dept.color }}>
                {dept.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: dept.color }}>
                {dept.name}
              </h2>
              <p className="text-gray-600 mb-6">{dept.description}</p>
              <div
                className="inline-block px-6 py-3 text-white font-semibold rounded-lg"
                style={{ backgroundColor: dept.color }}
              >
                Select Department
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">Touch a department above to continue</p>
          <div className="text-sm text-gray-500">
            Need assistance? Please contact the information desk.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelection;
