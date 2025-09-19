import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  className = '',
  onClick,
  hoverable = false,
  ...props 
}) => {
  const baseClasses = 'bg-white transition-all duration-150';
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'border-0',
    outlined: 'border-2 border-gray-300',
    kiosk: 'bg-white/95 backdrop-blur-sm border-4 border-transparent',
    admin: 'bg-white shadow-sm border border-gray-200',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
    kiosk: 'p-8 lg:p-12' // Optimized for kiosk interfaces
  };

  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
    kiosk: 'shadow-2xl active:shadow-xl drop-shadow-lg'
  };

  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    kiosk: 'rounded-3xl'
  };

  const hoverClasses = hoverable ? 'active:scale-95 active:shadow-lg cursor-pointer transition-transform duration-150' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${paddings[padding]} 
    ${shadows[shadow]} 
    ${roundeds[rounded]} 
    ${hoverClasses} 
    ${clickableClasses} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Specialized card components
export const KioskCard = ({ children, department, ...props }) => {
  const departmentColors = {
    registrar: 'border-blue-600 active:border-blue-700',
    admissions: 'border-red-600 active:border-red-700'
  };

  const borderColor = department ? departmentColors[department] : 'border-gray-300';

  return (
    <Card
      variant="kiosk"
      padding="kiosk"
      rounded="kiosk"
      shadow="kiosk"
      hoverable
      className={`${borderColor} group`}
      {...props}
    >
      {children}
    </Card>
  );
};

export const AdminCard = ({ children, ...props }) => (
  <Card
    variant="admin"
    padding="lg"
    rounded="lg"
    shadow="md"
    {...props}
  >
    {children}
  </Card>
);

export const StatCard = ({ title, value, icon, color = 'blue', ...props }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-emerald-600',
    yellow: 'text-amber-600',
    gray: 'text-gray-600'
  };

  return (
    <AdminCard className="text-center" {...props}>
      {icon && (
        <div className={`text-3xl mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
      )}
      <h3 className="text-gray-600 text-sm uppercase tracking-wider mb-2 font-semibold">
        {title}
      </h3>
      <div className={`text-4xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
    </AdminCard>
  );
};

export default Card;
