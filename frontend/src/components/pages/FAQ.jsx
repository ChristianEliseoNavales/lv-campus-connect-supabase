import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-8">
        {/* White Background Container with Fixed Height and Scrollable Content */}
        <div className="bg-white rounded-xl shadow-xl drop-shadow-lg w-full max-w-3xl h-[60vh] flex flex-col overflow-hidden">
          {/* Header inside white container */}
          <div className="pt-8 pb-6 px-8 flex-shrink-0">
            <h1 className="text-4xl font-semibold text-center drop-shadow-lg" style={{ color: '#161F55' }}>
              FREQUENTLY ASKED QUESTIONS
            </h1>
          </div>

          {/* Scrollable FAQ Content */}
          <div className="flex-grow overflow-y-auto px-8 pb-8">
            <div className="space-y-3 max-w-4xl mx-auto">
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-gray-50 rounded-lg shadow-lg drop-shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.id ? (
                          <svg
                            className="w-6 h-6 transition-transform duration-200"
                            style={{ color: '#1F3463' }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 transition-transform duration-200"
                            style={{ color: '#1F3463' }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {openFAQ === faq.id && (
                    <div className="px-6 pb-4 border-t border-gray-100 animate-fadeIn bg-white">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
