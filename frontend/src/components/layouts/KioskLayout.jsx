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

const KioskLayout = ({ children, customFooter = null }) => {
  // Idle detection hook
  const { showIdleModal, countdown, handleStayActive } = useIdleDetection();

  console.log('🏗️ KioskLayout render - showIdleModal:', showIdleModal, 'countdown:', countdown);



  return (
    <div
      className="flex flex-col w-screen h-screen overflow-hidden kiosk-container bg-cover bg-center bg-no-repeat"
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
            className="relative w-full flex justify-center"
            style={{
              background: 'linear-gradient(to top, #1F3463 0%, rgba(255, 255, 255, 0.0) 70%)'
            }}
          >
            <nav className="bg-white flex justify-center items-center space-x-6 py-6 px-12 w-full max-w-6xl rounded-t-3xl">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
            })}
          >
            <HiHome className="w-10 h-10" />
            <span className="mt-1 font-bold text-base">HOME</span>
          </NavLink>

          <NavLink
            to="/highlights"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
            })}
          >
            <BiSolidNotepad className="w-10 h-10" />
            <span className="mt-1 font-bold text-sm text-center leading-tight">HIGHLIGHTS</span>
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `w-36 h-24 flex flex-col items-center justify-center px-6 py-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
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
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
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
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
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
                  ? 'text-white font-bold shadow-md'
                  : 'hover:bg-blue-100 hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1F3463' : 'transparent',
              color: isActive ? 'white' : '#1F3463'
            })}
          >
            <TbMessage2Question className="w-10 h-10" />
            <span className="mt-1 font-bold text-base">FAQ</span>
          </NavLink>
            </nav>
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