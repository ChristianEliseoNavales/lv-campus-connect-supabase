/**
 * Text-to-Speech Utility for LVCampusConnect System
 * Professional female voice with airline announcement style
 * Accent-neutral American English with slower rate and clear enunciation
 */

class TextToSpeechService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.voices = [];
    this.selectedVoice = null;
    this.isInitialized = false;
    
    if (this.isSupported) {
      this.initializeVoices();
    }
  }

  /**
   * Initialize and load available voices
   */
  initializeVoices() {
    const loadVoices = () => {
      this.voices = speechSynthesis.getVoices();
      this.selectBestVoice();
      this.isInitialized = true;
      console.log('🔊 TTS voices loaded:', this.voices.length);
    };

    // Load voices immediately if available
    loadVoices();

    // Also listen for voice changes (some browsers load voices asynchronously)
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  /**
   * Select the best professional female voice
   * Priority: Professional female voices > Female voices > Any voice
   */
  selectBestVoice() {
    if (!this.voices.length) return;

    // Preferred voice names for professional female voices
    const preferredVoiceNames = [
      'Microsoft Zira - English (United States)',
      'Microsoft Aria - English (United States)', 
      'Google US English Female',
      'Alex (Enhanced)', // macOS
      'Samantha', // macOS
      'Victoria', // macOS
      'Karen', // Windows
      'Hazel', // Windows
      'Zira', // Windows
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft Aria Desktop - English (United States)'
    ];

    // First, try to find preferred professional voices
    for (const preferredName of preferredVoiceNames) {
      const voice = this.voices.find(v => 
        v.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (voice) {
        this.selectedVoice = voice;
        console.log('🎤 Selected preferred voice:', voice.name);
        return;
      }
    }

    // Fallback: Find any female voice
    const femaleVoice = this.voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      (voice.name.toLowerCase().includes('en') && 
       (voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('aria') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('hazel')))
    );

    if (femaleVoice) {
      this.selectedVoice = femaleVoice;
      console.log('🎤 Selected female voice:', femaleVoice.name);
      return;
    }

    // Final fallback: Use first English voice
    const englishVoice = this.voices.find(voice => 
      voice.lang.startsWith('en')
    );

    if (englishVoice) {
      this.selectedVoice = englishVoice;
      console.log('🎤 Selected English voice:', englishVoice.name);
    } else {
      this.selectedVoice = this.voices[0];
      console.log('🎤 Selected default voice:', this.voices[0]?.name);
    }
  }

  /**
   * Speak text with professional airline announcement style
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        console.warn('⚠️ Text-to-speech not supported in this browser');
        resolve();
        return;
      }

      if (!this.isInitialized) {
        console.warn('⚠️ TTS not initialized yet, retrying...');
        setTimeout(() => this.speak(text, options).then(resolve).catch(reject), 100);
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Professional airline announcement settings
      utterance.rate = options.rate || 0.75; // Slower for clarity (0.7-0.8)
      utterance.pitch = options.pitch || 0.9; // Slightly lower pitch for authority
      utterance.volume = options.volume || 0.9; // Clear but not overwhelming
      utterance.lang = options.lang || 'en-US'; // Accent-neutral American English

      // Event handlers
      utterance.onend = () => {
        console.log('🔊 TTS completed:', text);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('❌ TTS error:', event.error);
        reject(new Error(`TTS Error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log('🔊 TTS started:', text);
      };

      // Speak the text
      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Announce queue number with professional style
   * @param {number} queueNumber - Queue number to announce
   * @param {string} windowName - Window name (e.g., "Window 1")
   */
  announceQueueNumber(queueNumber, windowName) {
    const paddedNumber = String(queueNumber).padStart(2, '0');
    const announcement = `Queue number ${paddedNumber}, please proceed to ${windowName}`;
    
    console.log('📢 Queue announcement:', announcement);
    return this.speak(announcement);
  }

  /**
   * Announce queue transfer
   * @param {number} queueNumber - Queue number being transferred
   * @param {string} newWindowName - New window name
   */
  announceQueueTransfer(queueNumber, newWindowName) {
    const paddedNumber = String(queueNumber).padStart(2, '0');
    const announcement = `Queue number ${paddedNumber}, please proceed to ${newWindowName}`;
    
    console.log('📢 Transfer announcement:', announcement);
    return this.speak(announcement);
  }

  /**
   * Stop any ongoing speech
   */
  stop() {
    if (this.isSupported) {
      speechSynthesis.cancel();
      console.log('🔇 TTS stopped');
    }
  }

  /**
   * Check if TTS is available and ready
   */
  isReady() {
    return this.isSupported && this.isInitialized && this.selectedVoice;
  }

  /**
   * Get information about the selected voice
   */
  getVoiceInfo() {
    if (!this.selectedVoice) return null;
    
    return {
      name: this.selectedVoice.name,
      lang: this.selectedVoice.lang,
      gender: this.selectedVoice.name.toLowerCase().includes('female') || 
              this.selectedVoice.name.toLowerCase().includes('woman') ||
              ['zira', 'aria', 'samantha', 'karen', 'hazel'].some(name => 
                this.selectedVoice.name.toLowerCase().includes(name)) ? 'female' : 'unknown'
    };
  }

  /**
   * Test the TTS with a sample announcement
   */
  test() {
    const testMessage = "Queue number zero one, please proceed to Window 1";
    console.log('🧪 Testing TTS with:', testMessage);
    return this.speak(testMessage);
  }
}

// Create and export singleton instance
const textToSpeechService = new TextToSpeechService();

export default textToSpeechService;

// Named exports for convenience
export const {
  speak,
  announceQueueNumber,
  announceQueueTransfer,
  stop,
  isReady,
  getVoiceInfo,
  test
} = textToSpeechService;
