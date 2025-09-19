import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useIdleDetection from '../../hooks/useIdleDetection';

const IdlePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { handleReturnFromIdle } = useIdleDetection();

  // University images for carousel - using actual image files
  const carouselImages = [
    {
      src: '/idle/image1.png',
      alt: 'University Campus View 1'
    },
    {
      src: '/idle/image2.png',
      alt: 'University Campus View 2'
    },
    {
      src: '/idle/image3.png',
      alt: 'University Campus View 3'
    },
    {
      src: '/idle/image4.png',
      alt: 'University Campus View 4'
    },
    {
      src: '/idle/image5.png',
      alt: 'University Campus View 5'
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === carouselImages.length - 1 ? 0 : prev + 1
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Manual carousel navigation
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

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
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
      year: date.getFullYear()
    };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <div
      className="w-screen h-screen overflow-hidden grid grid-cols-4 bg-cover bg-center bg-no-repeat cursor-pointer kiosk-layout font-kiosk-public"
      onClick={handleReturnFromIdle}
      style={{
        backgroundImage: 'url(/main-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Column 1 - Left sidebar with gradient background (25% width) */}
      <div 
        className="col-span-1 flex flex-col justify-center items-center p-8 text-center"
        style={{
          background: 'linear-gradient(to bottom, #1F3463 0%, #f8fafc 100%)'
        }}
      >
        {/* Logo and Branding */}
        <div className="mb-8">
          <div className="text-white text-3xl font-bold mb-2">
            LVCampusConnect
          </div>
          <div className="text-white text-xl">
            Welcome to La Verdad
          </div>
        </div>

        {/* Time Display */}
        <div className="mb-6">
          <div className="text-white text-4xl font-bold mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-white text-xl font-semibold">
            {formatDay(currentTime)}
          </div>
        </div>

        {/* Date Box */}
        <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold mb-2" style={{ color: '#1F3463' }}>
            {dateInfo.day}
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: '#1F3463' }}>
            {dateInfo.month}
          </div>
          <div className="text-lg" style={{ color: '#1F3463' }}>
            {dateInfo.year}
          </div>
        </div>
      </div>

      {/* Columns 2-4 - Right section with carousel (75% width) */}
      <div className="col-span-3 relative flex flex-col">
        {/* Main content area with carousel */}
        <div className="flex-grow relative overflow-hidden px-4 py-8">
          {/* Carousel Container with Flex Layout */}
          <div className="relative w-full h-full flex items-center">
            {/* Left Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="flex-shrink-0 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-4 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 ml-4"
            >
              <FaChevronLeft className="w-8 h-8" style={{ color: '#1F3463' }} />
            </button>

            {/* Image Carousel Container - Centered between arrows with controlled height */}
            <div className="flex-grow relative mx-8 flex flex-col">
              {/* Image Container with explicit height to ensure visibility */}
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  height: 'calc(100vh - 320px)',
                  minHeight: '400px'
                }}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        // Fallback to a solid color if image fails to load
                        console.error('Image failed to load:', image.src);
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = '#1F3463';
                        e.target.parentElement.style.backgroundImage = 'linear-gradient(45deg, #1F3463, #2d4a7a)';
                        e.target.parentElement.style.borderRadius = '0.5rem';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Indicators - Positioned below image container with proper spacing */}
              <div className="flex justify-center mt-6 mb-4">
                <div className="flex space-x-3">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-4 h-4 rounded-full transition-all duration-200 shadow-lg ${
                        index === currentImageIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="flex-shrink-0 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-4 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 mr-4"
            >
              <FaChevronRight className="w-8 h-8" style={{ color: '#1F3463' }} />
            </button>
          </div>
        </div>

        {/* Bottom section with gradient overlay and TAP TO START */}
        <div 
          className="relative h-32 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to top, #1F3463 0%, rgba(255, 255, 255, 0) 100%)'
          }}
        >
          <div className="text-white text-4xl font-bold tracking-wider text-shadow-lg">
            TAP TO START
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdlePage;
