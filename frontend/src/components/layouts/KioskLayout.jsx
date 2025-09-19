import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome } from "react-icons/hi2";
import { BiSolidNotepad } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { MdQueue } from "react-icons/md";
import { TbMessage2Question } from "react-icons/tb";
import useIdleDetection from '../../hooks/useIdleDetection';
import IdleModal from '../ui/IdleModal';
import { DigitalClock } from '../ui';

const KioskLayout = ({ children, customFooter = null }) => {
  // Idle detection hook
  const { showIdleModal, countdown, handleStayActive } = useIdleDetection();

  console.log('🏗️ KioskLayout render - showIdleModal:', showIdleModal, 'countdown:', countdown);



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
            maxHeight: '20vh' // Limit height to preserve space for content and navigation
          }}
        />
      </header>

      {/* Main Content - Full width utilization for 16:9 landscape */}
      <main className="flex-grow px-6 py-6 overflow-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation - Fixed positioning with rectangular container */}
      <footer className="relative w-full">
        {customFooter ? (
          customFooter
        ) : (
          <div
            className="relative w-full px-8"
            style={{
              background: 'linear-gradient(to top, #1F3463 0%, rgba(255, 255, 255, 0.0) 70%)'
            }}
          >
            {/* Digital Clock - Positioned to the left of navigation */}
            <div className="absolute left-8 bottom-4 z-10">
              <DigitalClock />
            </div>

            {/* Navigation Container - Centered and anchored to bottom */}
            <div className="flex justify-center">
              <nav className="flex justify-center items-center space-x-6 pt-6 pb-4 px-12 w-full max-w-5xl rounded-t-full border-r-8 border-l-8" style={{ backgroundColor: '#1F3463', borderRightColor: '#FFE251', borderLeftColor: '#FFE251' }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <HiHome className="w-10 h-10" />
                  <span className="mt-1 font-bold text-base">HOME</span>
                </NavLink>

                <NavLink
                  to="/bulletin"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <BiSolidNotepad className="w-10 h-10" />
                  <span className="mt-1 font-bold text-sm text-center leading-tight">BULLETIN</span>
                </NavLink>

                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <FaLocationDot className="w-10 h-10" />
                  <span className="mt-1 font-bold text-base">MAP</span>
                </NavLink>

                <NavLink
                  to="/directory"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <FaUserFriends className="w-10 h-10" />
                  <span className="mt-1 font-bold text-base">DIRECTORY</span>
                </NavLink>

                <NavLink
                  to="/queue"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <MdQueue className="w-10 h-10" />
                  <span className="mt-1 font-bold text-base">QUEUE</span>
                </NavLink>

                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-md'
                        : 'hover:bg-white hover:bg-opacity-20'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? '#1F3463' : 'white'
                  })}
                >
                  <TbMessage2Question className="w-10 h-10" />
                  <span className="mt-1 font-bold text-base">FAQ</span>
                </NavLink>
              </nav>
            </div>
          </div>
        )}
      </footer>

      {/* Idle Modal */}
      <IdleModal
        isOpen={showIdleModal}
        countdown={countdown}
        onStayActive={handleStayActive}
      />
    </div>
  );
};

export default KioskLayout;