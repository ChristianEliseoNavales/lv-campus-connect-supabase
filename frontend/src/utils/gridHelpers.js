/**
 * Grid Helper Utilities for University Kiosk System
 * Provides utility functions for working with the ResponsiveGrid component
 */

/**
 * Determines the optimal grid layout configuration based on item count
 * @param {number} itemCount - Number of items to display
 * @returns {Object} Grid configuration object
 */
export const getGridConfiguration = (itemCount) => {
  const configs = {
    1: {
      layout: 'single',
      description: 'Single column, centered',
      containerClass: 'grid grid-cols-1 gap-8 max-w-md mx-auto',
      itemClass: 'w-full',
      maxWidth: 'max-w-md'
    },
    2: {
      layout: '2x1',
      description: '2 columns × 1 row, centered',
      containerClass: 'grid grid-cols-2 gap-x-32 gap-y-8 max-w-4xl mx-auto',
      itemClass: 'w-80',
      maxWidth: 'max-w-4xl'
    },
    3: {
      layout: '3x1',
      description: '3 columns × 1 row, centered',
      containerClass: 'grid grid-cols-3 gap-8 max-w-5xl mx-auto',
      itemClass: 'w-72',
      maxWidth: 'max-w-5xl'
    },
    4: {
      layout: '2x2',
      description: '2 columns × 2 rows, centered',
      containerClass: 'grid grid-cols-2 gap-x-24 gap-y-8 max-w-4xl mx-auto',
      itemClass: 'w-80',
      maxWidth: 'max-w-4xl'
    },
    5: {
      layout: 'special-5',
      description: 'Row 1: 3 columns, Row 2: 2 columns centered',
      containerClass: 'grid gap-8 max-w-5xl mx-auto',
      itemClass: 'w-72',
      maxWidth: 'max-w-5xl',
      customLayout: true
    },
    6: {
      layout: '3x2',
      description: '3 columns × 2 rows, all cells filled',
      containerClass: 'grid grid-cols-3 gap-8 max-w-6xl mx-auto',
      itemClass: 'w-72',
      maxWidth: 'max-w-6xl'
    }
  };

  if (itemCount <= 6) {
    return configs[itemCount];
  }

  // For 7+ items, use pagination with 6-item layout
  return {
    ...configs[6],
    layout: 'paginated',
    description: 'Paginated layout with navigation controls',
    requiresPagination: true
  };
};

/**
 * Calculates pagination information for a given dataset
 * @param {Array} items - Array of items
 * @param {number} itemsPerPage - Items per page (default: 6)
 * @param {number} currentPage - Current page index (default: 0)
 * @returns {Object} Pagination information
 */
export const calculatePagination = (items, itemsPerPage = 6, currentPage = 0) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = items.slice(startIndex, endIndex);
  
  return {
    totalItems,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    currentItems,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
    isFirstPage: currentPage === 0,
    isLastPage: currentPage === totalPages - 1
  };
};

/**
 * Generates default button styling for kiosk interface
 * @param {string} additionalClasses - Additional CSS classes
 * @returns {string} Complete button class string
 */
export const getKioskButtonClasses = (additionalClasses = '') => {
  const baseClasses = `
    text-white rounded-3xl shadow-lg drop-shadow-md p-6 
    hover:shadow-xl hover:drop-shadow-lg transition-all duration-200 
    border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200
  `.trim().replace(/\s+/g, ' ');
  
  return `${baseClasses} ${additionalClasses}`.trim();
};

/**
 * Generates default button styles for kiosk interface
 * @returns {Object} Style object for buttons
 */
export const getKioskButtonStyles = () => ({
  backgroundColor: '#1F3463'
});

/**
 * Generates hover event handlers for kiosk buttons
 * @returns {Object} Event handlers for mouse enter/leave
 */
export const getKioskButtonHandlers = () => ({
  onMouseEnter: (e) => {
    e.target.style.backgroundColor = '#1A2E56';
  },
  onMouseLeave: (e) => {
    e.target.style.backgroundColor = '#1F3463';
  }
});

/**
 * Creates a complete button configuration for kiosk interface
 * @param {string} additionalClasses - Additional CSS classes
 * @returns {Object} Complete button configuration
 */
export const createKioskButtonConfig = (additionalClasses = '') => ({
  className: getKioskButtonClasses(additionalClasses),
  style: getKioskButtonStyles(),
  ...getKioskButtonHandlers()
});

/**
 * Validates grid items array and provides helpful error messages
 * @param {Array} items - Items array to validate
 * @returns {Object} Validation result
 */
export const validateGridItems = (items) => {
  if (!Array.isArray(items)) {
    return {
      isValid: false,
      error: 'Items must be an array',
      suggestion: 'Ensure you pass an array of items to the ResponsiveGrid component'
    };
  }

  if (items.length === 0) {
    return {
      isValid: false,
      error: 'Items array is empty',
      suggestion: 'Provide at least one item to display in the grid'
    };
  }

  if (items.length > 50) {
    return {
      isValid: true,
      warning: 'Large number of items detected',
      suggestion: 'Consider implementing server-side pagination for better performance'
    };
  }

  return {
    isValid: true,
    itemCount: items.length,
    recommendedLayout: getGridConfiguration(items.length).layout
  };
};

/**
 * Generates sample data for testing grid layouts
 * @param {number} count - Number of items to generate
 * @param {string} prefix - Prefix for item names
 * @returns {Array} Array of sample items
 */
export const generateSampleItems = (count, prefix = 'Item') => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    key: `${prefix.toLowerCase()}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
    title: `${prefix} ${index + 1}`,
    description: `Sample description for ${prefix.toLowerCase()} ${index + 1}`
  }));
};

/**
 * Default render function for simple text items
 * @param {Object|string} item - Item to render
 * @returns {JSX.Element} Rendered item component
 */
export const defaultItemRenderer = (item) => {
  const displayText = item?.name || item?.title || item?.toString() || 'Unnamed Item';
  const description = item?.description;

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-white">
        {displayText}
      </h3>
      {description && (
        <p className="text-sm text-white opacity-90 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

/**
 * University Kiosk System color constants
 */
export const KIOSK_COLORS = {
  PRIMARY_NAVY: '#1F3463',
  HOVER_NAVY: '#1A2E56',
  HEADER_NAVY: '#161F55',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F3F4F6',
  GRAY_BORDER: '#D1D5DB'
};

/**
 * Common grid breakpoints for responsive design
 */
export const GRID_BREAKPOINTS = {
  MOBILE: '640px',
  TABLET: '768px',
  LAPTOP: '1024px',
  DESKTOP: '1280px',
  KIOSK: '1920px' // 16:9 landscape optimization
};
