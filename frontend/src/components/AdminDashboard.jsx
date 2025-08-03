import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from './layouts';

const AdminDashboard = () => {
  const { department: urlDepartment } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, canAccessDepartment } = useAuth();

  const [queueData, setQueueData] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Determine department and window from URL or user context
  const getDepartmentFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/registrar')) return 'registrar';
    if (path.includes('/admin/admissions')) return 'admissions';
    if (urlDepartment) return urlDepartment;
    // Fallback to user's department if available
    if (user?.department) return user.department;
    return null;
  };

  const getWindowFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/registrar/window1')) return 'window1';
    if (path.includes('/admin/registrar/window2')) return 'window2';
    if (path.includes('/admin/registrar/window3')) return 'window3';
    return null;
  };

  const department = getDepartmentFromPath();
  const currentWindow = getWindowFromPath();

  const departmentInfo = {
    registrar: {
      name: "Registrar's Office",
      icon: '📋',
      color: '#1d4ed8', // Darker blue for better contrast
      colorClasses: {
        bg: 'bg-blue-700', // Darker for better contrast
        text: 'text-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-800'
      }
    },
    admissions: {
      name: 'Admissions Office',
      icon: '🎓',
      color: '#b91c1c', // Darker red for better contrast
      colorClasses: {
        bg: 'bg-red-700', // Darker for better contrast
        text: 'text-red-600',
        border: 'border-red-600',
        hover: 'hover:bg-red-800'
      }
    }
  };

  // Check department access
  useEffect(() => {
    if (user && department && !canAccessDepartment(department)) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, department, canAccessDepartment, navigate]);

  useEffect(() => {
    if (user && department) {
      initializeSocket();
      fetchQueueData();
      initializeSpeechSynthesis();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, department]);

  // Initialize speech synthesis voices
  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      // Load voices and log available options
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(`Available voices: ${voices.length}`);

        // Log available voices with accent analysis for debugging
        const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
        const usVoices = englishVoices.filter(voice =>
          voice.lang.toLowerCase().includes('us') ||
          voice.lang.toLowerCase().includes('american')
        );
        const femaleVoices = englishVoices.filter(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('aria') ||
          voice.name.toLowerCase().includes('jenny') ||
          voice.name.toLowerCase().includes('samantha')
        );

        console.log(`Voice Analysis:
          Total English voices: ${englishVoices.length}
          US English voices: ${usVoices.length}
          Female voices: ${femaleVoices.length}`);

        if (femaleVoices.length > 0) {
          console.log('Available female voices:', femaleVoices.map(v =>
            `${v.name} (${v.lang})${v.lang.includes('us') ? ' [US]' : ''}${v.default ? ' [DEFAULT]' : ''}`
          ));
        }

        // Test voice selection and log accent-neutral preference
        const selectedVoice = selectProfessionalFemaleVoice();
        if (selectedVoice) {
          const isAccentNeutral = selectedVoice.lang.toLowerCase().includes('us') ||
                                 selectedVoice.lang.toLowerCase().includes('american');
          console.log(`Selected professional voice: ${selectedVoice.name} (${selectedVoice.lang})${isAccentNeutral ? ' [ACCENT-NEUTRAL]' : ' [REGIONAL]'}`);
        }
      };

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }
  };

  const initializeSocket = () => {
    if (!department) {
      console.error('Cannot initialize socket: department not specified');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinDepartment', department);
    });

    newSocket.on('queueUpdate', (data) => {
      if (data.department === department) {
        if (currentWindow && data.window === currentWindow) {
          // Handle window-specific updates
          setQueueData(data.windowQueue);
          setCurrentServing(data.serving);
        } else if (!currentWindow) {
          // Handle general department updates
          setQueueData(data.queue);
          setCurrentNumber(data.currentNumbers[department]);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);
  };

  const fetchQueueData = async () => {
    if (!department) {
      setError('Department not specified');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let response;

      if (department === 'registrar' && currentWindow) {
        // Fetch window-specific queue data
        response = await axios.get(`http://localhost:3001/api/queue/registrar/${currentWindow}`);
      } else {
        // Fetch department queue data
        response = await axios.get(`http://localhost:3001/api/queue/${department}`);
      }

      setQueueData(response.data.queue);
      setCurrentNumber(response.data.currentNumber);
      setCurrentServing(response.data.serving);
      setError(null);
    } catch (err) {
      setError('Failed to load queue data. Please try again.');
      console.error('Error fetching queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const callNextPerson = async () => {
    const waitingQueue = queueData.filter(item => item.status === 'waiting');
    if (waitingQueue.length === 0) {
      alert('No one is waiting in the queue.');
      return;
    }

    const nextPerson = waitingQueue[0];
    
    try {
      let endpoint;
      let payload;

      if (department === 'registrar' && currentWindow) {
        // Use window-specific endpoint
        endpoint = `http://localhost:3001/api/queue/registrar/${currentWindow}/call-next`;
        payload = { queueId: nextPerson.id };
      } else {
        // Use general department endpoint
        endpoint = `http://localhost:3001/api/queue/call-next`;
        payload = { department, queueId: nextPerson.id };
      }

      await axios.post(endpoint, payload);
      
      // Update local state immediately
      setCurrentServing(nextPerson);
      setQueueData(prev => prev.map(item => 
        item.id === nextPerson.id 
          ? { ...item, status: 'serving' }
          : item.status === 'serving' 
            ? { ...item, status: 'completed' }
            : item
      ));

      // Announce the queue number (placeholder for TTS)
      announceQueueNumber(nextPerson.queueNumber);
      
    } catch (error) {
      console.error('Error calling next person:', error);
      alert('Failed to call next person. Please try again.');
    }
  };

  const markAsCompleted = async () => {
    if (!currentServing) {
      alert('No one is currently being served.');
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/queue/complete`, {
        department,
        queueId: currentServing.id
      });

      // Update local state
      setCurrentServing(null);
      setQueueData(prev => prev.map(item => 
        item.id === currentServing.id 
          ? { ...item, status: 'completed' }
          : item
      ));

    } catch (error) {
      console.error('Error marking as completed:', error);
      alert('Failed to mark as completed. Please try again.');
    }
  };

  const recallCurrentNumber = () => {
    if (currentServing) {
      announceQueueNumber(currentServing.queueNumber);
    } else {
      alert('No one is currently being served.');
    }
  };

  const announceQueueNumber = (queueNumber) => {
    // Format message with professional public address system style
    // Using punctuation and spacing for natural inflection and pacing
    const message = `Attention please. Queue number ${queueNumber}, please proceed to the service counter. Thank you.`;
    console.log(`Announcing: ${message}`);

    // Text-to-Speech functionality
    if ('speechSynthesis' in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Wait a moment for cancellation to complete
        setTimeout(() => {
          // Create speech utterance
          const utterance = new SpeechSynthesisUtterance(message);

          // Configure professional public address system settings
          utterance.rate = 0.75; // Slightly faster than airline for engagement
          utterance.pitch = 0.85; // Balanced pitch for authority with warmth
          utterance.volume = 0.95; // Slightly reduced to avoid distortion

          // Select professional female voice and optimize parameters
          const voice = selectProfessionalFemaleVoice();
          if (voice) {
            utterance.voice = voice;

            // Optimize speech parameters based on voice characteristics
            const optimizedParams = optimizeSpeechParameters(voice);
            utterance.rate = optimizedParams.rate;
            utterance.pitch = optimizedParams.pitch;
            utterance.volume = optimizedParams.volume;

            console.log(`Using voice: ${voice.name} (${voice.lang}) - Rate: ${optimizedParams.rate}, Pitch: ${optimizedParams.pitch}`);
          }

          // Handle speech events
          utterance.onstart = () => {
            console.log('Professional announcement started');
          };

          utterance.onend = () => {
            console.log('Professional announcement completed');
          };

          utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
          };

          // Speak the message
          window.speechSynthesis.speak(utterance);
        }, 100);

      } catch (error) {
        console.error('Text-to-speech error:', error);
      }
    } else {
      console.warn('Text-to-speech not supported in this browser');
    }

    // Show visual notification
    showVisualAnnouncement(queueNumber);
  };

  // Select the best professional female voice available with accent-neutral priority
  const selectProfessionalFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    // Priority order for professional, accent-neutral female voices
    const voicePriorities = [
      // Premium US English neural/WaveNet voices (highest priority)
      { keywords: ['neural', 'wavenet', 'us', 'female'], priority: 15, accentNeutral: true },
      { keywords: ['neural', 'wavenet', 'american', 'female'], priority: 15, accentNeutral: true },
      { keywords: ['neural', 'standard', 'us', 'female'], priority: 14, accentNeutral: true },

      // High-quality US English Google voices
      { keywords: ['google', 'us', 'female'], priority: 13, accentNeutral: true },
      { keywords: ['google', 'us', 'standard', 'female'], priority: 13, accentNeutral: true },
      { keywords: ['google', 'american', 'female'], priority: 12, accentNeutral: true },

      // Professional Microsoft US voices
      { keywords: ['microsoft', 'zira'], priority: 11, accentNeutral: true }, // US English
      { keywords: ['microsoft', 'aria'], priority: 11, accentNeutral: true }, // US English
      { keywords: ['microsoft', 'jenny'], priority: 11, accentNeutral: true }, // US English
      { keywords: ['microsoft', 'us', 'female'], priority: 10, accentNeutral: true },

      // Standard US English voices
      { keywords: ['us', 'female'], priority: 9, accentNeutral: true },
      { keywords: ['american', 'female'], priority: 9, accentNeutral: true },
      { keywords: ['en-us', 'female'], priority: 8, accentNeutral: true },

      // Specific professional voice names (US)
      { keywords: ['samantha'], priority: 7, accentNeutral: true }, // macOS US
      { keywords: ['susan'], priority: 7, accentNeutral: true }, // Windows US
      { keywords: ['karen'], priority: 6, accentNeutral: true }, // Windows US

      // Generic premium voices (lower priority)
      { keywords: ['neural', 'female'], priority: 5, accentNeutral: false },
      { keywords: ['google', 'female'], priority: 4, accentNeutral: false },
      { keywords: ['microsoft', 'female'], priority: 3, accentNeutral: false },

      // Regional accents (lowest priority - avoid if possible)
      { keywords: ['gb', 'female'], priority: 2, accentNeutral: false }, // British
      { keywords: ['au', 'female'], priority: 1, accentNeutral: false }, // Australian
      { keywords: ['ca', 'female'], priority: 1, accentNeutral: false }, // Canadian

      // Final fallback
      { keywords: ['female'], priority: 1, accentNeutral: false },
      { keywords: ['woman'], priority: 1, accentNeutral: false }
    ];

    let bestVoice = null;
    let highestPriority = 0;
    let isAccentNeutral = false;

    voices.forEach(voice => {
      // Only consider English voices
      if (!voice.lang.toLowerCase().startsWith('en')) return;

      const voiceName = voice.name.toLowerCase();
      const voiceLang = voice.lang.toLowerCase();

      // Check for regional accents to deprioritize
      const hasRegionalAccent =
        voiceLang.includes('gb') || voiceLang.includes('au') ||
        voiceLang.includes('ca') || voiceLang.includes('in') ||
        voiceName.includes('british') || voiceName.includes('australian') ||
        voiceName.includes('scottish') || voiceName.includes('irish') ||
        voiceName.includes('welsh') || voiceName.includes('south');

      voicePriorities.forEach(({ keywords, priority, accentNeutral }) => {
        const matches = keywords.every(keyword =>
          voiceName.includes(keyword.toLowerCase()) ||
          voiceLang.includes(keyword.toLowerCase())
        );

        if (matches) {
          // Boost priority for accent-neutral voices
          let adjustedPriority = priority;
          if (accentNeutral && !hasRegionalAccent) {
            adjustedPriority += 5; // Significant boost for accent-neutral
          } else if (hasRegionalAccent) {
            adjustedPriority -= 3; // Penalty for regional accents
          }

          if (adjustedPriority > highestPriority ||
              (adjustedPriority === highestPriority && accentNeutral && !isAccentNeutral)) {
            highestPriority = adjustedPriority;
            bestVoice = voice;
            isAccentNeutral = accentNeutral;
          }
        }
      });
    });

    // If no specific match found, try to find any US female voice
    if (!bestVoice) {
      bestVoice = voices.find(voice =>
        voice.lang.toLowerCase().includes('us') &&
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('woman'))
      );
    }

    // Fallback to any female voice, preferring US English
    if (!bestVoice) {
      bestVoice = voices.find(voice =>
        voice.lang.toLowerCase().startsWith('en') &&
        !voice.lang.toLowerCase().includes('gb') &&
        !voice.lang.toLowerCase().includes('au') &&
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('aria') ||
         voice.name.toLowerCase().includes('samantha'))
      );
    }

    // Final fallback to any English voice
    if (!bestVoice) {
      bestVoice = voices.find(voice =>
        voice.lang.toLowerCase().startsWith('en') && voice.default
      ) || voices.find(voice => voice.lang.toLowerCase().startsWith('en'));
    }

    return bestVoice;
  };

  // Optimize speech parameters based on voice characteristics
  const optimizeSpeechParameters = (voice) => {
    const voiceName = voice.name.toLowerCase();
    const voiceLang = voice.lang.toLowerCase();

    // Default professional public address system settings
    let params = {
      rate: 0.75,   // Balanced pace for engagement
      pitch: 0.85,  // Authoritative but warm
      volume: 0.95  // Clear without distortion
    };

    // Optimize for specific voice types
    if (voiceName.includes('neural') || voiceName.includes('wavenet')) {
      // Premium neural voices - can handle more natural inflection
      params.rate = 0.8;   // Slightly faster for natural flow
      params.pitch = 0.9;  // Higher pitch for warmth
      params.volume = 0.9; // Slightly lower for neural voice clarity
    } else if (voiceName.includes('zira') || voiceName.includes('aria')) {
      // Microsoft professional voices - optimized for clarity
      params.rate = 0.75;  // Standard professional pace
      params.pitch = 0.85; // Balanced authority
      params.volume = 0.95; // Full clarity
    } else if (voiceName.includes('samantha')) {
      // macOS Samantha - naturally warm voice
      params.rate = 0.78;  // Slightly faster for engagement
      params.pitch = 0.88; // Higher pitch to maintain warmth
      params.volume = 0.92; // Slightly reduced for natural tone
    } else if (voiceName.includes('google')) {
      // Google voices - generally clear and crisp
      params.rate = 0.77;  // Good pace for Google voices
      params.pitch = 0.87; // Balanced for Google's clarity
      params.volume = 0.93; // Optimal for Google voice output
    } else if (voiceLang.includes('gb') || voiceLang.includes('au')) {
      // Regional accents - adjust for clarity in international context
      params.rate = 0.72;  // Slower for accent clarity
      params.pitch = 0.82; // Lower pitch to reduce accent prominence
      params.volume = 0.97; // Higher volume for clarity
    }

    // Ensure parameters stay within safe bounds
    params.rate = Math.max(0.5, Math.min(1.5, params.rate));
    params.pitch = Math.max(0.5, Math.min(1.5, params.pitch));
    params.volume = Math.max(0.1, Math.min(1.0, params.volume));

    return params;
  };

  // Test voice quality and accent neutrality (for debugging)
  const testVoiceQuality = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const testMessage = "This is a test of voice quality and accent neutrality.";

    console.log('=== VOICE QUALITY TEST ===');

    // Test top 3 voices
    const topVoices = [];
    for (let i = 0; i < Math.min(3, voices.length); i++) {
      const voice = voices[i];
      if (voice.lang.toLowerCase().startsWith('en')) {
        topVoices.push(voice);
      }
    }

    // Test selected voice
    const selectedVoice = selectProfessionalFemaleVoice();
    if (selectedVoice && !topVoices.includes(selectedVoice)) {
      topVoices.unshift(selectedVoice);
    }

    topVoices.forEach((voice, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(
          `Voice ${index + 1}: ${voice.name}. ${testMessage}`
        );
        utterance.voice = voice;

        const params = optimizeSpeechParameters(voice);
        utterance.rate = params.rate;
        utterance.pitch = params.pitch;
        utterance.volume = params.volume;

        console.log(`Testing voice ${index + 1}: ${voice.name} (${voice.lang})`);
        window.speechSynthesis.speak(utterance);
      }, index * 4000); // 4 second delay between tests
    });
  };

  const showVisualAnnouncement = (queueNumber) => {
    const announcement = document.createElement('div');
    announcement.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-blue-400 animate-bounce max-w-md w-full mx-4';
    announcement.innerHTML = `
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-2">📢 Announcement</h3>
        <p class="text-lg mb-1">Queue Number <strong class="text-3xl font-bold text-yellow-300">${queueNumber}</strong></p>
        <p class="text-base">Please proceed to the counter</p>
      </div>
    `;
    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 3000);
  };

  const getWaitingCount = () => {
    return queueData.filter(item => item.status === 'waiting').length;
  };

  const getCompletedCount = () => {
    return queueData.filter(item => item.status === 'completed').length;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Show loading while checking user access
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center text-gray-600 text-center p-8">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center text-gray-600 text-center p-8">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Loading queue data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center text-gray-600 text-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={fetchQueueData}
            className="bg-red-600 text-white border-none py-4 px-8 rounded-xl text-lg cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-1"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const deptInfo = departmentInfo[department];

  // Handle case where department is not found
  if (!department || !deptInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8 font-sans">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Department Not Found</h2>
            <p className="text-gray-600 mb-6">
              {!department
                ? "Unable to determine which department dashboard to display."
                : `The department "${department}" is not configured.`
              }
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Available departments:</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => navigate('/admin/registrar')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📋 Registrar
                </button>
                <button
                  onClick={() => navigate('/admin/admissions')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  🎓 Admissions
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    if (currentWindow) {
      const windowNames = {
        window1: 'Window 1',
        window2: 'Window 2',
        window3: 'Window 3'
      };
      return `${deptInfo.name} - ${windowNames[currentWindow]}`;
    }
    return deptInfo.name;
  };

  const getPageSubtitle = () => {
    if (currentWindow) {
      const windowServices = {
        window1: 'Transcript Request, Certificate of Enrollment',
        window2: 'Diploma Verification, Grade Inquiry',
        window3: 'Student Records Update'
      };
      return windowServices[currentWindow];
    }
    return 'Queue Management Dashboard';
  };

  return (
    <AdminLayout
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-600 text-sm uppercase tracking-wider mb-4 font-semibold">Current Number</h3>
          <div className={`text-5xl font-bold ${deptInfo.colorClasses.text}`}>
            {currentNumber}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-600 text-sm uppercase tracking-wider mb-4 font-semibold">Waiting</h3>
          <div className="text-5xl font-bold text-amber-500">
            {getWaitingCount()}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h3 className="text-gray-600 text-sm uppercase tracking-wider mb-4 font-semibold">Completed Today</h3>
          <div className="text-5xl font-bold text-emerald-500">
            {getCompletedCount()}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <button
          onClick={callNextPerson}
          className={`py-4 px-8 border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[200px] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:transform-none hover:-translate-y-1 hover:shadow-xl ${deptInfo.colorClasses.bg} ${deptInfo.colorClasses.hover}`}
          disabled={getWaitingCount() === 0}
        >
          📢 Call Next Person
        </button>

        <button
          onClick={markAsCompleted}
          className="py-4 px-8 border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[200px] bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:transform-none hover:bg-emerald-600 hover:-translate-y-1"
          disabled={!currentServing}
        >
          ✅ Mark as Completed
        </button>

        <button
          onClick={recallCurrentNumber}
          className="py-4 px-8 border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[200px] bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:transform-none hover:bg-gray-700 hover:-translate-y-1"
          disabled={!currentServing}
        >
          🔄 Recall Current Number
        </button>
      </div>

      {currentServing && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h3 className="text-gray-800 text-xl font-semibold mb-6">Currently Serving</h3>
          <div className={`flex items-center gap-8 p-6 border-4 rounded-2xl bg-gray-50 ${deptInfo.colorClasses.border}`}>
            <div className={`
              w-20 h-20 rounded-full text-white flex items-center justify-center
              text-2xl font-bold flex-shrink-0 ${deptInfo.colorClasses.bg}
              animate-pulse
            `}>
              {currentServing.queueNumber}
            </div>
            <div className="flex-grow">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{currentServing.fullName}</h4>
              <p className="text-gray-600 mb-1"><strong>Service:</strong> {currentServing.service}</p>
              <p className="text-gray-600 mb-1"><strong>Purpose:</strong> {currentServing.purpose}</p>
              <p className="text-gray-600 mb-1"><strong>Contact:</strong> {currentServing.contact}</p>
              <p className="text-gray-600"><strong>Time:</strong> {formatTime(currentServing.timestamp)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-gray-800 text-xl font-semibold mb-6">Queue Status</h3>
        <div className="flex flex-col gap-4">
          {queueData.length === 0 ? (
            <div className="text-center py-12 text-gray-600 italic">
              <p>No entries in the queue</p>
            </div>
          ) : (
            queueData.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-6 p-6 border-2 border-l-4 rounded-xl transition-all duration-300 ${
                  item.status === 'serving' ? 'bg-blue-50 border-blue-200' :
                  item.status === 'completed' ? 'opacity-70 bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}
                style={{
                  borderLeftColor: item.status === 'serving' ? deptInfo.color : undefined
                }}
              >
                <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  item.status === 'serving' ? '' :
                  item.status === 'completed' ? 'bg-emerald-500' :
                  'bg-gray-600'
                }`}
                style={{ backgroundColor: item.status === 'serving' ? deptInfo.color : undefined }}
                >
                  {item.queueNumber}
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.fullName}</h4>
                  <p className="text-gray-600 mb-1">{item.service}</p>
                  <small className="text-gray-500 text-sm">{formatTime(item.timestamp)}</small>
                </div>
                <div className={`py-2 px-4 rounded-full text-sm font-semibold whitespace-nowrap ${
                  item.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'serving' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.status === 'waiting' && '⏳ Waiting'}
                  {item.status === 'serving' && '👥 Serving'}
                  {item.status === 'completed' && '✅ Completed'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
