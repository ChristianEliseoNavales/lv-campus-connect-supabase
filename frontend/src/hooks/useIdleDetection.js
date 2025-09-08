import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useIdleDetection = (idleTimeout = 30000) => { // 30 seconds for production
  const [isIdle, setIsIdle] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  const idleTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const modalTimerRef = useRef(null);

  // Reset idle timer - Fixed to remove circular dependency
  const resetIdleTimer = useCallback(() => {
    console.log('🔄 Resetting idle timer, current path:', location.pathname);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      console.log('⏹️ Cleared existing idle timer');
    }

    // Don't start idle timer if we're on idle page
    if (location.pathname === '/idle') {
      console.log('🚫 Not starting timer - on idle page');
      return;
    }

    console.log(`⏰ Starting new idle timer for ${idleTimeout}ms`);
    idleTimerRef.current = setTimeout(() => {
      console.log('⚠️ Idle timeout reached, showing modal');
      setShowIdleModal(true);
      setCountdown(5);
    }, idleTimeout);
  }, [idleTimeout, location.pathname]); // Removed showIdleModal dependency

  // Handle user activity - Fixed to remove circular dependency
  const handleActivity = useCallback(() => {
    console.log('👆 User activity detected, path:', location.pathname);
    if (location.pathname !== '/idle') {
      resetIdleTimer();
    }
  }, [resetIdleTimer, location.pathname]);

  // Handle modal countdown
  useEffect(() => {
    if (showIdleModal && countdown > 0) {
      console.log(`⏳ Modal countdown: ${countdown} seconds remaining`);
      countdownTimerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showIdleModal && countdown === 0) {
      // Redirect to idle page
      console.log('🔚 Countdown finished, redirecting to idle page');
      setShowIdleModal(false);
      setIsIdle(true);
      navigate('/idle');
    }

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [showIdleModal, countdown, navigate]);

  // Handle user staying active (clicking YES) - Fixed to restart timer properly
  const handleStayActive = useCallback(() => {
    console.log('✅ User chose to stay active');
    setShowIdleModal(false);
    setCountdown(5);
    // Restart the idle timer immediately
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Handle returning from idle page
  const handleReturnFromIdle = useCallback(() => {
    setIsIdle(false);
    navigate('/');
    // Start idle detection again after a short delay
    setTimeout(() => {
      resetIdleTimer();
    }, 100);
  }, [navigate, resetIdleTimer]);

  // Set up event listeners for user activity - Fixed to prevent frequent re-attachment
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    console.log('🎯 Setting up event listeners for idle detection');

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      console.log('🧹 Cleaning up event listeners');
      // Cleanup event listeners
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [handleActivity]); // Removed resetIdleTimer and location.pathname to prevent frequent re-attachment

  // Separate effect for timer management
  useEffect(() => {
    console.log('🚀 Timer management effect triggered, path:', location.pathname);

    // Start initial timer if not on idle page
    if (location.pathname !== '/idle') {
      resetIdleTimer();
    }

    return () => {
      console.log('🧹 Cleaning up timers');
      // Cleanup timers
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
      }
    };
  }, [resetIdleTimer, location.pathname]);

  // Reset when location changes (except to idle page)
  useEffect(() => {
    console.log('📍 Location changed to:', location.pathname);
    if (location.pathname !== '/idle') {
      console.log('🔄 Resetting idle state for new page');
      setIsIdle(false);
      setShowIdleModal(false);
      setCountdown(5);
      resetIdleTimer();
    }
  }, [location.pathname, resetIdleTimer]);

  return {
    isIdle,
    showIdleModal,
    countdown,
    handleStayActive,
    handleReturnFromIdle
  };
};

export default useIdleDetection;
