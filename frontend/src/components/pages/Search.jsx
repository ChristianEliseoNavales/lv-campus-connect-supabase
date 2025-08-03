import React, { useState } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);

  // Sample data for search
  const searchData = [
    {
      id: 1,
      title: "Registrar Office",
      category: "department",
      description: "Student records, transcripts, enrollment verification",
      location: "Administration Building, Room 101",
      contact: "(123) 456-7890"
    },
    {
      id: 2,
      title: "Admissions Office",
      category: "department",
      description: "New student applications, admission requirements",
      location: "Administration Building, Room 201",
      contact: "(123) 456-7891"
    },
    {
      id: 3,
      title: "Library Services",
      category: "service",
      description: "Book borrowing, research assistance, study spaces",
      location: "Main Library Building",
      contact: "(123) 456-7892"
    },
    {
      id: 4,
      title: "Student Financial Services",
      category: "service",
      description: "Tuition payments, financial aid, scholarships",
      location: "Student Center, Room 150",
      contact: "(123) 456-7893"
    },
    {
      id: 5,
      title: "Dr. John Smith",
      category: "faculty",
      description: "Professor of Computer Science",
      location: "Engineering Building, Room 305",
      contact: "john.smith@university.edu"
    },
    {
      id: 6,
      title: "Campus Security",
      category: "service",
      description: "24/7 campus safety and security services",
      location: "Security Office, Main Gate",
      contact: "(123) 456-7890"
    },
    {
      id: 7,
      title: "IT Help Desk",
      category: "service",
      description: "Computer support, network issues, software assistance",
      location: "Technology Center, Room 100",
      contact: "helpdesk@university.edu"
    },
    {
      id: 8,
      title: "Student Health Center",
      category: "service",
      description: "Medical services, health consultations, wellness programs",
      location: "Health Center Building",
      contact: "(123) 456-7894"
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = searchData.filter(item => {
      const matchesCategory = searchCategory === 'all' || item.category === searchCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    setSearchResults(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'department':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
          </svg>
        );
      case 'service':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'faculty':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Campus Search
        </h1>
        <p className="text-lg text-gray-600">
          Find departments, services, faculty, and more
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter keywords..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="all">All Categories</option>
              <option value="department">Departments</option>
              <option value="service">Services</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="md:w-32 flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-grow overflow-auto">
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Search Results ({searchResults.length})
            </h2>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 mr-3">
                        {result.title}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{result.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {result.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {result.contact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Start your search</h3>
            <p className="text-gray-600">Enter keywords to find departments, services, or faculty members</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
