import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Bulletin = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Bulletin images data for pagination
  const bulletinPages = [
    {
      page: 1,
      images: [
        { id: 1, src: '/bulletin/1.png', alt: 'Bulletin 1' },
        { id: 2, src: '/bulletin/2.png', alt: 'Bulletin 2' },
        { id: 3, src: '/bulletin/3.png', alt: 'Bulletin 3' }
      ]
    },
    {
      page: 2,
      images: [
        { id: 3, src: '/bulletin/3.png', alt: 'Bulletin 3' },
        { id: 2, src: '/bulletin/2.png', alt: 'Bulletin 2' },
        { id: 1, src: '/bulletin/1.png', alt: 'Bulletin 1' }
      ]
    }
  ];

  const totalPages = bulletinPages.length;
  const currentPageData = bulletinPages[currentPage];

  // Navigation handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // Button styling helper
  const getButtonStyles = (isDisabled) => {
    return {
      className: `w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 ${
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-md'
          : 'bg-white text-[#1F3463] active:bg-[#1F3463] active:text-white active:scale-95 shadow-lg active:shadow-md drop-shadow-md'
      }`,
      style: isDisabled ? {} : {}
    };
  };

  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = currentPage === totalPages - 1;

  return (
    <div className="h-full flex flex-col">
      {/* Main Content Area - 3-Column Grid Layout */}
      <div className="flex-grow flex items-center justify-center px-20">
        <div className="w-full max-w-7xl mx-auto">
          {/* 3-Column Grid Container */}
          <div className="grid grid-cols-3 gap-8 h-full">
            {currentPageData.images.map((image, index) => (
              <div key={image.id} className="flex items-center justify-center">
                {/* Image Container with transparent background */}
                <div className="w-full h-auto bg-transparent rounded-lg overflow-hidden shadow-xl drop-shadow-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.src}`);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Controls - Same pattern as Directory page */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 mb-4">
          {/* Previous Button - Always visible with disabled state */}
          <button
            onClick={isPrevDisabled ? undefined : goToPrevPage}
            disabled={isPrevDisabled}
            className={`mr-8 ${getButtonStyles(isPrevDisabled).className}`}
            style={getButtonStyles(isPrevDisabled).style}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>

          {/* Page Indicator Dots */}
          <div className="flex items-center space-x-3 mx-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  index === currentPage
                    ? 'bg-blue-600'
                    : 'bg-gray-300 active:bg-gray-400 active:scale-95'
                }`}
                style={index === currentPage ? { backgroundColor: '#1F3463' } : {}}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button - Always visible with disabled state */}
          <button
            onClick={isNextDisabled ? undefined : goToNextPage}
            disabled={isNextDisabled}
            className={`ml-8 ${getButtonStyles(isNextDisabled).className}`}
            style={getButtonStyles(isNextDisabled).style}
            aria-label="Next page"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Bulletin;
