import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  required = false,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full border rounded-md transition-all duration-300 focus:outline-none focus:ring-4 shadow-sm focus:shadow-md';

  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
    error: 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 shadow-md',
    success: 'border-emerald-500 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 shadow-md',
    kiosk: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-lg shadow-lg focus:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    kiosk: 'px-4 py-4 text-lg lg:px-6 lg:py-5 lg:text-xl'
  };

  const inputVariant = error ? 'error' : variant;
  const classes = `${baseClasses} ${variants[inputVariant]} ${sizes[size]} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={classes}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helperText,
  required = false,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full border rounded-md transition-all duration-300 focus:outline-none focus:ring-4 resize-vertical shadow-sm focus:shadow-md';

  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
    error: 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 shadow-md',
    success: 'border-emerald-500 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 shadow-md',
    kiosk: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-lg shadow-lg focus:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    kiosk: 'px-4 py-4 text-lg lg:px-6 lg:py-5 lg:text-xl'
  };

  const inputVariant = error ? 'error' : variant;
  const classes = `${baseClasses} ${variants[inputVariant]} ${sizes[size]} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={inputId}
        rows={rows}
        className={classes}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  required = false,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  children,
  ...props
}) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full border rounded-md transition-all duration-300 focus:outline-none focus:ring-4 bg-white shadow-sm focus:shadow-md';

  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
    error: 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200 shadow-md',
    success: 'border-emerald-500 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 shadow-md',
    kiosk: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-lg shadow-lg focus:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    kiosk: 'px-4 py-4 text-lg lg:px-6 lg:py-5 lg:text-xl'
  };

  const inputVariant = error ? 'error' : variant;
  const classes = `${baseClasses} ${variants[inputVariant]} ${sizes[size]} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={inputId}
        className={classes}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
