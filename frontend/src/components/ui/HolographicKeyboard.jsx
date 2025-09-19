import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

// Holographic Overlay Keyboard Component - Optimized for Kiosk Touchscreen
const HolographicKeyboard = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onHide,
  isVisible,
  activeInputValue = '',
  activeInputLabel = '',
  activeInputPlaceholder = '',
  // New props for visitation form multi-field display
  showAllFields = false,
  allFieldsData = null,
  activeFieldName = '',
  onFieldFocus = null
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const keyboardRef = useRef(null);
  const overlayRef = useRef(null);

  // Helper function to calculate cursor position based on text content
  const calculateCursorPosition = (text, fontSize = '20px', fontFamily = 'SF Pro Rounded, ui-rounded, system-ui, sans-serif') => {
    // Create a temporary canvas element to measure text width
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize} ${fontFamily}`;

    // Measure the width of the text
    const textWidth = context.measureText(text || '').width;

    // Add padding (16px = px-4 in Tailwind) and return position
    return textWidth + 16; // 16px for left padding
  };

  // Keyboard layout
  const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      if (overlayRef.current && keyboardRef.current) {
        overlayRef.current.classList.remove('kiosk-overlay-exit');
        overlayRef.current.classList.add('kiosk-overlay-enter');
        keyboardRef.current.classList.remove('kiosk-keyboard-exit');
        keyboardRef.current.classList.add('kiosk-keyboard-enter');
      }
    } else {
      document.body.style.overflow = 'auto'; // Restore scrolling
      
      if (overlayRef.current && keyboardRef.current) {
        overlayRef.current.classList.remove('kiosk-overlay-enter');
        overlayRef.current.classList.add('kiosk-overlay-exit');
        keyboardRef.current.classList.remove('kiosk-keyboard-enter');
        keyboardRef.current.classList.add('kiosk-keyboard-exit');
        setTimeout(() => setIsAnimating(false), 300);
      }
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col items-center justify-center font-kiosk-public"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {/* Input Field Display - Single or Multiple Fields */}
      <div className="mb-8 w-full max-w-4xl px-8">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 shadow-2xl drop-shadow-2xl border border-white border-opacity-30">
          {showAllFields && allFieldsData ? (
            /* Multi-Field Display for Visitation Form */
            <div className="space-y-4">
              {allFieldsData.map((field) => (
                <div key={field.name}>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={field.value}
                      placeholder={field.placeholder}
                      readOnly
                      onClick={() => onFieldFocus && onFieldFocus(field.name)}
                      className={`w-full px-4 py-4 border-2 rounded-lg text-xl bg-white focus:outline-none shadow-inner cursor-pointer transition-all duration-150 ${
                        activeFieldName === field.name
                          ? 'border-[#1F3463] bg-blue-50'
                          : 'border-gray-300 active:border-[#1F3463]'
                      }`}
                    />
                    {activeFieldName === field.name && (
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2"
                        style={{ left: `${calculateCursorPosition(field.value, '20px')}px` }}
                      >
                        <div className="w-1 h-6 bg-[#1F3463] animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Field Display for Other Forms */
            <div>
              {activeInputLabel && (
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {activeInputLabel}
                </label>
              )}
              <div className="relative">
                <input
                  type="text"
                  value={activeInputValue}
                  placeholder={activeInputPlaceholder}
                  readOnly
                  className="w-full px-4 py-4 border-2 border-[#1F3463] rounded-lg text-xl bg-white focus:outline-none shadow-inner"
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: `${calculateCursorPosition(activeInputValue, '20px')}px` }}
                >
                  <div className="w-1 h-6 bg-[#1F3463] animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holographic Keyboard */}
      <div
        ref={keyboardRef}
        className="bg-transparent rounded-xl p-6 max-w-5xl mx-auto"
      >
        {/* Number Row */}
        <div className="flex justify-center gap-3 mb-4">
          {numberRow.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="w-20 h-16 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-2xl font-bold text-white active:bg-white active:bg-opacity-20 active:border-opacity-80 active:scale-95 shadow-lg active:shadow-md transition-all duration-150 select-none"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Letter Rows */}
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3 mb-4">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="w-20 h-16 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-2xl font-bold text-white active:bg-white active:bg-opacity-20 active:border-opacity-80 active:scale-95 shadow-lg active:shadow-md transition-all duration-150 select-none"
              >
                {key}
              </button>
            ))}
            {/* Add backspace button to the third row (after 'M' key) */}
            {rowIndex === 2 && (
              <button
                onClick={onBackspace}
                className="w-32 h-16 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-lg font-bold text-white active:bg-white active:bg-opacity-20 active:border-opacity-80 active:scale-95 shadow-lg active:shadow-md transition-all duration-150 select-none"
              >
                ⌫ BACK
              </button>
            )}
          </div>
        ))}

        {/* Bottom Row with Spacebar */}
        <div className="flex justify-center gap-3 mb-4">
          {/* Spacebar */}
          <button
            onClick={onSpace}
            className="w-80 h-16 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-lg font-bold text-white active:bg-white active:bg-opacity-20 active:border-opacity-80 active:scale-95 shadow-lg active:shadow-md transition-all duration-150 select-none"
          >
            SPACE
          </button>
        </div>

        {/* Hide Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onHide}
            className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white border-opacity-50 rounded-lg text-white font-semibold active:bg-white active:bg-opacity-20 active:border-opacity-80 active:scale-95 shadow-lg active:shadow-md transition-all duration-150"
          >
            <FaChevronDown className="w-4 h-4" />
            Click to hide keyboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolographicKeyboard;
