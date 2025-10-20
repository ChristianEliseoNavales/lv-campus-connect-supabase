import React from 'react';
import useIdleDetection from '../../hooks/useIdleDetection';
import IdleModal from '../ui/IdleModal';

const DirectoryLayout = ({ children, customFooter = null }) => {
  // Idle detection hook
  const { showIdleModal, countdown, handleStayActive } = useIdleDetection();

  return (
    <div
      className="flex flex-col w-screen h-screen overflow-hidden kiosk-container kiosk-layout font-kiosk-public bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/main-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header Image - Positioned at absolute top spanning full width */}
      <header className="w-full flex-shrink-0">
        <img
          src="/header.png"
          alt="University Header"
          className="w-full h-auto object-cover object-center"
          style={{
            display: 'block',
            maxHeight: '20vh' // Limit height to preserve space for content
          }}
        />
      </header>

      {/* Main Content - Full width utilization for 16:9 landscape */}
      <main className="flex-grow px-6 py-6 overflow-auto w-full">
        {children}
      </main>

      {/* Navy Blue Gradient Background at Bottom */}
      <div
        className="relative w-full h-16"
        style={{
          background: 'linear-gradient(to top, #1F3463 0%, rgba(255, 255, 255, 0.0) 90%)'
        }}
      />

      {/* Custom Footer - Only if provided */}
      {customFooter && (
        <footer className="relative w-full">
          {customFooter}
        </footer>
      )}

      {/* Idle Modal */}
      <IdleModal
        isOpen={showIdleModal}
        countdown={countdown}
        onStayActive={handleStayActive}
      />
    </div>
  );
};

export default DirectoryLayout;
