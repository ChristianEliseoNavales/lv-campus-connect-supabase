import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-white text-gray-800 border border-gray-300',
    dark: 'bg-gray-800 text-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Status Badge - for common status indicators
export const StatusBadge = ({ status, className = '', ...props }) => {
  const statusConfig = {
    active: { variant: 'success', text: 'Active' },
    inactive: { variant: 'danger', text: 'Inactive' },
    pending: { variant: 'warning', text: 'Pending' },
    completed: { variant: 'success', text: 'Completed' },
    cancelled: { variant: 'danger', text: 'Cancelled' },
    processing: { variant: 'info', text: 'Processing' },
    draft: { variant: 'secondary', text: 'Draft' },
    published: { variant: 'success', text: 'Published' },
    archived: { variant: 'secondary', text: 'Archived' },
    online: { variant: 'success', text: 'Online' },
    offline: { variant: 'danger', text: 'Offline' },
    maintenance: { variant: 'warning', text: 'Maintenance' }
  };

  const config = statusConfig[status] || { variant: 'default', text: status };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  );
};

// Role Badge - for user roles
export const RoleBadge = ({ role, className = '', ...props }) => {
  const roleConfig = {
    super_admin: { variant: 'danger', text: 'Super Admin' },
    registrar_admin: { variant: 'primary', text: 'Registrar Admin' },
    admissions_admin: { variant: 'info', text: 'Admissions Admin' },
    user: { variant: 'secondary', text: 'User' },
    guest: { variant: 'light', text: 'Guest' }
  };

  const config = roleConfig[role] || { variant: 'default', text: role };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  );
};

// Priority Badge - for priority levels
export const PriorityBadge = ({ priority, className = '', ...props }) => {
  const priorityConfig = {
    low: { variant: 'success', text: 'Low' },
    medium: { variant: 'warning', text: 'Medium' },
    high: { variant: 'danger', text: 'High' },
    urgent: { variant: 'danger', text: 'Urgent' }
  };

  const config = priorityConfig[priority] || { variant: 'default', text: priority };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  );
};

// Count Badge - for numbers/counts
export const CountBadge = ({ count, max = 99, className = '', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <Badge 
      variant="danger" 
      size="sm" 
      className={`${className}`} 
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;
