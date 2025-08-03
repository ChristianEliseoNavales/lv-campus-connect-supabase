import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      id: 1,
      category: 'General',
      question: 'What are the university office hours?',
      answer: 'Most university offices are open Monday through Friday from 8:00 AM to 5:00 PM. Some offices may have extended hours or Saturday availability. Check with specific departments for their individual schedules.'
    },
    {
      id: 2,
      category: 'Registration',
      question: 'How do I register for classes?',
      answer: 'You can register for classes through the student portal during your designated registration period. Make sure to meet with your academic advisor first to plan your course schedule and ensure you meet all prerequisites.'
    },
    {
      id: 3,
      category: 'Financial',
      question: 'When is tuition due?',
      answer: 'Tuition payments are typically due before the start of each semester. Fall semester payments are due in August, and Spring semester payments are due in January. Payment plans are available through Financial Services.'
    },
    {
      id: 4,
      category: 'Academic',
      question: 'How do I request a transcript?',
      answer: 'Official transcripts can be requested through the Registrar Office. You can submit requests in person, by mail, or through the online student portal. There is a processing fee for each transcript.'
    },
    {
      id: 5,
      category: 'Campus Life',
      question: 'Where can I get a student ID card?',
      answer: 'Student ID cards are issued at the Student Services office in the Student Center. Bring a valid photo ID and proof of enrollment. Replacement cards have a small fee.'
    },
    {
      id: 6,
      category: 'Technology',
      question: 'How do I access the campus WiFi?',
      answer: 'Connect to the "University-WiFi" network using your student credentials. If you have trouble connecting, contact the IT Help Desk for assistance.'
    },
    {
      id: 7,
      category: 'Financial',
      question: 'How do I apply for financial aid?',
      answer: 'Complete the FAFSA (Free Application for Federal Student Aid) online. The university school code is required for the application. Contact Financial Services for assistance with the application process.'
    },
    {
      id: 8,
      category: 'Academic',
      question: 'What is the grade appeal process?',
      answer: 'If you believe a grade was assigned in error, first discuss the matter with your instructor. If unresolved, you can file a formal grade appeal through the Academic Affairs office within 30 days of receiving the grade.'
    },
    {
      id: 9,
      category: 'Campus Life',
      question: 'Where can I park on campus?',
      answer: 'Student parking is available in designated lots with a valid parking permit. Permits can be purchased from Student Services. Visitor parking is available in marked areas for short-term visits.'
    },
    {
      id: 10,
      category: 'General',
      question: 'How do I contact campus security?',
      answer: 'Campus Security can be reached 24/7 at (123) 456-7890. For emergencies, dial 911. Security offices are located at the main gate and in the Student Center.'
    }
  ];

  const categories = ['All', ...new Set(faqData.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Registration': 'bg-green-100 text-green-800',
      'Financial': 'bg-yellow-100 text-yellow-800',
      'Academic': 'bg-purple-100 text-purple-800',
      'Campus Life': 'bg-pink-100 text-pink-800',
      'Technology': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about university services
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search FAQs
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions and answers..."
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="flex-grow overflow-auto">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${getCategoryColor(faq.category)}`}>
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        openFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
          <p className="text-sm text-blue-800 mb-3">
            If you can't find the answer you're looking for, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900">Information Desk:</span>
              <p className="text-blue-700">(123) 456-7800</p>
            </div>
            <div>
              <span className="font-medium text-blue-900">Email:</span>
              <p className="text-blue-700">info@university.edu</p>
            </div>
            <div>
              <span className="font-medium text-blue-900">Hours:</span>
              <p className="text-blue-700">Mon-Fri 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
