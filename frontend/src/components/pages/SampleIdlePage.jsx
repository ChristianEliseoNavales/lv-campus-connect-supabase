import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SampleIdlePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoAdvanceActive, setIsAutoAdvanceActive] = useState(true);
  const [lastUserInteraction, setLastUserInteraction] = useState(Date.now());

  // Carousel images data for the 4th circle
  const carouselImages = [
    { id: 1, src: '/bulletin/1.png', alt: 'Bulletin 1' },
    { id: 2, src: '/bulletin/2.png', alt: 'Bulletin 2' },
    { id: 3, src: '/bulletin/3.png', alt: 'Bulletin 3' }
  ];

  const totalPages = carouselImages.length;

  // Auto-advance function
  const autoAdvanceToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle user interaction - pause auto-advance and record interaction time
  const handleUserInteraction = () => {
    setLastUserInteraction(Date.now());
    setIsAutoAdvanceActive(false);
  };

  // Navigation handlers with smooth transitions and manual override
  const goToNextPage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    handleUserInteraction(); // Pause auto-advance
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const goToPrevPage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    handleUserInteraction(); // Pause auto-advance
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const goToPage = (pageIndex) => {
    if (isTransitioning || pageIndex === currentPage) return;
    handleUserInteraction(); // Pause auto-advance
    setIsTransitioning(true);
    setCurrentPage(pageIndex);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  // Button styling helper - same as bulletin page
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

  const isPrevDisabled = currentPage === 0 || isTransitioning;
  const isNextDisabled = currentPage === totalPages - 1 || isTransitioning;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Preload carousel images for better performance
  useEffect(() => {
    carouselImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, [carouselImages]);

  // Auto-advance timer system
  useEffect(() => {
    let autoAdvanceTimer;
    let inactivityTimer;

    const startAutoAdvance = () => {
      if (document.visibilityState === 'visible' && isAutoAdvanceActive) {
        // Auto-advance timer - advances every 6 seconds
        autoAdvanceTimer = setInterval(() => {
          autoAdvanceToNext();
        }, 6000);
      }
    };

    const stopAutoAdvance = () => {
      if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
      }
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastUserInteraction;

      // Resume auto-advance after 12 seconds of inactivity
      if (timeSinceLastInteraction >= 12000 && !isAutoAdvanceActive) {
        setIsAutoAdvanceActive(true);
      }
    };

    // Start inactivity checker
    inactivityTimer = setInterval(checkInactivity, 1000);

    // Handle visibility change (pause when tab not visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopAutoAdvance();
      } else if (document.visibilityState === 'visible' && isAutoAdvanceActive) {
        startAutoAdvance();
      }
    };

    // Start auto-advance if active
    if (isAutoAdvanceActive) {
      startAutoAdvance();
    }

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      stopAutoAdvance();
      if (inactivityTimer) {
        clearInterval(inactivityTimer);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAutoAdvanceActive, lastUserInteraction, isTransitioning]);

  // Format time and date
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  const formatDate = (date) => {
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
      year: date.getFullYear()
    };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative font-kiosk-public"
      style={{
        backgroundImage: 'url(/main-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Navy blue overlay with 70% opacity */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: '#1F3463',
          opacity: 0.7
        }}
      />

      {/* Top-left branding */}
      <div className="absolute top-8 left-10 z-30 flex items-center space-x-4">
        <img
          src="/mobile/logo.png"
          alt="Logo"
          className="w-[80px] h-[80px] object-contain drop-shadow-lg"
        />
        <div className="text-white text-3xl font-bold font-days-one text-shadow-lg">
          LVCampusConnect
        </div>
      </div>

      {/* Welcome text positioned below branding */}
      <div className="absolute top-[130px] left-[150px] z-30">
        <div className="text-white text-3xl font-semibold text-shadow-lg">WELCOME TO LA VERDAD</div>
      </div>

      {/* Main content container using flexbox */}
      <div className="relative z-20 w-full h-full flex">

        {/* Left Half (50% of screen) */}
        <div className="w-1/2 h-full flex items-center justify-center relative">

          {/* Circle 1 - Date display circle at exact center of left half */}
          <div
            className="rounded-full border-[16px] flex flex-col items-center justify-center shadow-3xl"
            style={{
              width: '580px',
              height: '580px',
              backgroundColor: '#B8CFF4',
              borderColor: '#1F3463',
              backdropFilter: 'blur(15px)',
              zIndex: 3
            }}
          >
            <div className="text-9xl font-bold mb-2" style={{ color: '#1F3463' }}>
              {dateInfo.day}
            </div>
            <div className="text-4xl font-bold mb-1" style={{ color: '#1F3463' }}>
              {dateInfo.month}
            </div>
            <div className="text-3xl font-bold" style={{ color: '#1F3463' }}>
              {dateInfo.year}
            </div>
          </div>

          {/* Circle 2 - Time display circle at 7:30 position relative to Circle 1 */}
          <div
            className="absolute rounded-full border-[16px] flex flex-col items-center justify-center shadow-3xl"
            style={{
              width: '330px',
              height: '330px',
              backgroundColor: '#B8CFF4',
              borderColor: '#1F3463',
              backdropFilter: 'blur(12px)',
              zIndex: 3,
              // 7:30 position: bottom-left diagonal from center (225 degrees)
              // Circle 1 radius: 240px (480px/2), Circle 2 radius: 140px (280px/2)
              // For more overlap: reduce distance by ~55px (40% of Circle 2's radius)
              // New distance from Circle 1 center to Circle 2 center: 325px (380px - 55px)
              // At 225°: x = 325 * cos(225°) ≈ 325 * (-0.707) ≈ -230px
              // At 225°: y = 325 * sin(225°) ≈ 325 * (-0.707) ≈ -230px (but CSS y is inverted)
              top: 'calc(50% + 230px)', // Move down from center (reduced from 244px)
              left: 'calc(50% - 230px)', // Move left from center (reduced from 244px)
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-4xl font-bold mb-1" style={{ color: '#1F3463' }}>
              {formatTime(currentTime)}
            </div>
            <div className="text-xl font-bold" style={{ color: '#1F3463' }}>
              {formatDay(currentTime)}
            </div>
          </div>
        </div>

        {/* Right Half (50% of screen) */}
        <div className="w-1/2 h-full relative flex items-center justify-center">

          {/* Circle 3 - Large background circle centered in right half (lower z-index) */}
          <div
            className="absolute rounded-full border-[16px] shadow-3xl"
            style={{
              width: '1500px',
              height: '1500px',
              backgroundColor: '#B8CFF4',
              borderColor: '#1F3463',
              backdropFilter: 'blur(8px)',
              // Centered within the right half container
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          />

          {/* Circle 4 - Carousel container circle on top of Circle 3 (higher z-index) */}
          <div
            className="absolute rounded-full border-4 border-cyan-200 border-opacity-60 shadow-2xl overflow-hidden"
            style={{
              width: '820px',
              height: '820px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.8) 0%, rgba(147,197,253,0.6) 100%)',
              backdropFilter: 'blur(15px)',
              // Position leftward from center of right half
              // Move Circle 4 closer to the center dividing line with 75px gap from Circle 1
              top: '45%',
              left: 'calc(50% - 100px)', // Move 150px left from center of right half
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
          >
            {/* Carousel Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Render all images with opacity transitions for smoother animation */}
              {carouselImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                    index === currentPage
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                  style={{
                    zIndex: index === currentPage ? 10 : 1
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="rounded-lg shadow-lg"
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.src}`);
                      // Show fallback content if image fails to load
                      e.target.parentElement.style.display = 'none';
                      document.getElementById(`fallback-${image.id}`).style.display = 'flex';
                    }}
                  />
                </div>
              ))}

              {/* Fallback content for each image if it fails to load */}
              {carouselImages.map((image) => (
                <div
                  key={`fallback-${image.id}`}
                  className="absolute inset-0 flex items-center justify-center text-center p-8"
                  style={{ display: 'none' }}
                  id={`fallback-${image.id}`}
                >
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold text-xl" style={{ color: '#1F3463' }}>LV</span>
                    </div>
                    <div className="text-white text-sm font-semibold mb-2">La Verdad Christian College Inc.</div>
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg mb-4 font-bold text-2xl">
                      2025
                    </div>
                    <div className="bg-blue-900 text-white px-6 py-3 rounded-lg mb-4">
                      <div className="text-2xl font-bold">CAROUSEL</div>
                      <div className="text-sm font-semibold">IMAGE {image.id}</div>
                    </div>
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-semibold">
                      Failed to Load
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls - positioned below the 4th circle element */}
      {totalPages > 1 && (
        <div
          className="absolute z-30"
          style={{
            // Position relative to the 4th circle's center point
            // Circle 4 is at top: 47%, left: calc(50% - 100px) within right half
            // Right half starts at 50% of screen width
            // So Circle 4's absolute position is: left: calc(75% - 100px) = calc(75% - 100px)
            // Circle 4 height is 820px, so bottom edge is at top + 410px
            // Add 15px spacing below the circle (reduced from 30px)
            top: 'calc(47% + 410px)',
            left: 'calc(75% - 100px)', // Same horizontal center as Circle 4 but relative to full screen
            transform: 'translate(-50%, 0)' // Center horizontally on the calculated left position
          }}
        >
          <div className="flex justify-center items-center">
            {/* Previous Button - Always visible with disabled state */}
            <button
              onClick={isPrevDisabled ? undefined : goToPrevPage}
              disabled={isPrevDisabled}
              className={`mr-12 ${getButtonStyles(isPrevDisabled).className}`}
              style={getButtonStyles(isPrevDisabled).style}
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-8 h-8" />
            </button>

            {/* Page Indicator Dots */}
            <div className="flex items-center space-x-4 mx-[150px]">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  disabled={isTransitioning}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    index === currentPage
                      ? 'bg-blue-600'
                      : isTransitioning
                        ? 'bg-gray-200 cursor-not-allowed'
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
              className={`ml-12 ${getButtonStyles(isNextDisabled).className}`}
              style={getButtonStyles(isNextDisabled).style}
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Tap to start indicator - positioned in left half of screen */}
      <div className="absolute bottom-4 left-[250px] z-30">
        <div className="text-white text-4xl font-bold text-center tracking-wider opacity-90 animate-pulse text-shadow-lg">
          TAP TO START
        </div>
      </div>
    </div>
  );
};

export default SampleIdlePage;
