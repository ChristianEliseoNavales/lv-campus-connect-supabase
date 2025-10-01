import React from 'react';

// Form Container
export const Form = ({ children, onSubmit, className = '', ...props }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

// Form Group (Label + Input wrapper)
export const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

// Form Label
export const FormLabel = ({ children, required = false, htmlFor, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// Form Input
export const FormInput = ({ 
  type = 'text', 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors';
  const normalClasses = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
      {...props}
    />
  );
};

// Form Select
export const FormSelect = ({ 
  children, 
  error = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors';
  const normalClasses = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  return (
    <select
      className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// Form Textarea
export const FormTextarea = ({ 
  error = false, 
  className = '', 
  rows = 4,
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors resize-vertical';
  const normalClasses = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  return (
    <textarea
      rows={rows}
      className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
      {...props}
    />
  );
};

// Form Error Message
export const FormError = ({ children, className = '' }) => {
  if (!children) return null;
  
  return (
    <p className={`text-sm text-red-600 ${className}`}>
      {children}
    </p>
  );
};

// Form Help Text
export const FormHelp = ({ children, className = '' }) => {
  if (!children) return null;
  
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

// Form Checkbox
export const FormCheckbox = ({
  label,
  error = false,
  variant = 'default', // 'default', 'kiosk'
  className = '',
  ...props
}) => {
  const checkboxClasses = variant === 'kiosk'
    ? `h-16 w-16 rounded-lg border-4 border-gray-400 text-[#1F3463] focus:ring-[#1F3463] focus:ring-4 focus:border-[#1F3463] transition-all duration-200 touch-target-lg shadow-lg hover:shadow-xl active:scale-95 cursor-pointer ${
        error ? 'border-red-400' : ''
      }`
    : `h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
        error ? 'border-red-300' : ''
      }`;

  const labelClasses = variant === 'kiosk'
    ? 'ml-6 block text-xl text-gray-700 flex-1 pt-2'
    : 'ml-2 block text-sm text-gray-700';

  const containerClasses = variant === 'kiosk'
    ? `flex items-start space-x-6 cursor-pointer group ${className}`
    : `flex items-center ${className}`;

  const checkboxStyle = variant === 'kiosk'
    ? { accentColor: '#1F3463' }
    : {};

  return (
    <div className={containerClasses}>
      <input
        type="checkbox"
        className={checkboxClasses}
        style={checkboxStyle}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className={labelClasses}>
          {label}
        </label>
      )}
    </div>
  );
};

// Form Radio Group
export const FormRadioGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

// Form Radio
export const FormRadio = ({ 
  label, 
  error = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="radio"
        className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
          error ? 'border-red-300' : ''
        }`}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

// Form Actions (Button container)
export const FormActions = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-4 ${className}`}>
      {children}
    </div>
  );
};

// Complete Form Field (combines label, input, error, help)
export const FormField = ({ 
  label, 
  type = 'text', 
  error, 
  help, 
  required = false,
  children,
  ...props 
}) => {
  const inputId = props.id || props.name;
  
  return (
    <FormGroup>
      {label && (
        <FormLabel htmlFor={inputId} required={required}>
          {label}
        </FormLabel>
      )}
      
      {children || (
        type === 'select' ? (
          <FormSelect error={!!error} {...props} />
        ) : type === 'textarea' ? (
          <FormTextarea error={!!error} {...props} />
        ) : (
          <FormInput type={type} error={!!error} {...props} />
        )
      )}
      
      <FormError>{error}</FormError>
      <FormHelp>{help}</FormHelp>
    </FormGroup>
  );
};

export default Form;
