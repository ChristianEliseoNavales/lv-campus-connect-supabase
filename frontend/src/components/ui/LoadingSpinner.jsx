import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text,
  className = '',
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    red: 'border-red-600',
    emerald: 'border-emerald-600'
  };

  const spinnerClasses = `
    ${sizes[size]} 
    border-4 border-gray-200 border-t-4 ${colors[color]} 
    rounded-full animate-spin
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses}></div>
      {text && (
        <p className="mt-4 text-gray-600 text-center">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export const KioskLoadingSpinner = ({ text = "Loading..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex flex-col items-center justify-center text-white text-center p-8">
    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
    <p className="text-xl">{text}</p>
  </div>
);

export const AdminLoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p className="text-gray-600">{text}</p>
  </div>
);

export default LoadingSpinner;
