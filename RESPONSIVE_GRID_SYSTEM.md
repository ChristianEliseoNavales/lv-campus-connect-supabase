# University Kiosk System - Responsive Grid Layout System

## Overview

The ResponsiveGrid component provides a comprehensive, responsive grid layout system for all University Kiosk System pages that display department/office/service selection buttons. It automatically adapts the grid layout based on the number of items and provides pagination for larger datasets.

## Features

- **Automatic Layout Detection**: Intelligently chooses the optimal grid layout based on item count
- **Responsive Design**: Optimized for 16:9 landscape kiosk displays
- **Pagination Support**: Handles 7+ items with navigation controls
- **Consistent Styling**: Navy blue (#1F3463) background with hover effects
- **Touch-Friendly**: Large buttons optimized for kiosk interaction
- **WCAG Accessibility**: Meets accessibility standards for text contrast

## Grid Layout Rules

### 1 Item
- **Layout**: Single column, centered
- **Container**: `grid grid-cols-1 gap-8 max-w-md mx-auto`
- **Use Case**: Single option selection

### 2 Items
- **Layout**: 2 columns × 1 row, centered
- **Container**: `grid grid-cols-2 gap-x-32 gap-y-8 max-w-4xl mx-auto`
- **Use Case**: Binary choices (e.g., Basic/Higher Education)

### 3 Items
- **Layout**: 3 columns × 1 row, centered
- **Container**: `grid grid-cols-3 gap-8 max-w-5xl mx-auto`
- **Use Case**: Three-option selections

### 4 Items
- **Layout**: 2 columns × 2 rows, centered
- **Container**: `grid grid-cols-2 gap-x-24 gap-y-8 max-w-4xl mx-auto`
- **Use Case**: Four-option selections

### 5 Items (Special Layout)
- **Row 1**: 3 columns (items 1, 2, 3)
- **Row 2**: 2 columns centered (items 4, 5)
- **Container**: Custom grid with nested layouts
- **Use Case**: Department selections (current Directory page)

### 6 Items
- **Layout**: 3 columns × 2 rows, all cells filled
- **Container**: `grid grid-cols-3 gap-8 max-w-6xl mx-auto`
- **Use Case**: Maximum items without pagination

### 7+ Items (Pagination)
- **Layout**: Maximum 6 items per page following above rules
- **Navigation**: Previous/Next buttons with page indicators
- **Cycling**: Automatically resets to first page after reaching end
- **Use Case**: Large service lists, extensive department options

## Component Usage

### Basic Implementation

```jsx
import { ResponsiveGrid } from '../ui';

<ResponsiveGrid
  items={departments}
  onItemClick={(item) => handleItemClick(item)}
  renderItem={(item) => (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-white">
        {item.name}
      </h3>
    </div>
  )}
  showPagination={items.length > 6}
/>
```

### Advanced Configuration

```jsx
<ResponsiveGrid
  items={serviceOptions}
  onItemClick={(service, index) => handleServiceSelect(service, index)}
  renderItem={(service, index) => (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
      <p className="text-sm text-white opacity-90">{service.description}</p>
    </div>
  )}
  maxItemsPerPage={6}
  showPagination={true}
  containerClassName="custom-container-class"
  buttonClassName="custom-button-class"
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | `[]` | Array of items to display |
| `renderItem` | Function | - | Function to render each item |
| `onItemClick` | Function | - | Callback when item is clicked |
| `maxItemsPerPage` | Number | `6` | Maximum items per page |
| `showPagination` | Boolean | `true` | Show pagination controls |
| `containerClassName` | String | `''` | Additional container classes |
| `buttonClassName` | String | `''` | Additional button classes |

## Styling Specifications

### Button Styling
- **Background**: Navy blue (#1F3463)
- **Hover**: Darker navy (#1A2E56)
- **Border Radius**: `rounded-3xl` (24px)
- **Padding**: `p-6` (24px)
- **Shadow**: `shadow-lg drop-shadow-md`
- **Transition**: `transition-all duration-200`

### Typography
- **Title**: `text-xl font-semibold text-white`
- **Description**: `text-sm text-white opacity-90`

### Accessibility
- **Focus Ring**: `focus:ring-4 focus:ring-blue-200`
- **Outline**: `focus:outline-none`
- **Color Contrast**: WCAG AA compliant

## Implementation Status

### ✅ Completed Pages
- **Directory.jsx**: Department selection (5 items → special layout)
- **Queue.jsx**: 
  - Department selection (2 items → 2×1 grid)
  - Service selection (3+ items → 3×1 or pagination)
  - Role selection (2 items → 2×1 grid)
  - Priority selection (2 items → 2×1 grid)
- **Highlights.jsx**: Category selection (2 items → 2×1 grid)

### 🔄 Pages Using ResponsiveGrid
All major selection interfaces now use the ResponsiveGrid component for consistent layout and behavior.

## Testing

### Demo Page
Access the grid demonstration at `/grid-demo` to see all layout configurations:
- 1-10 item examples
- Pagination functionality
- Layout rule explanations
- Interactive testing

### Browser Testing
- ✅ Chrome/Edge (Recommended for kiosks)
- ✅ Firefox
- ✅ Safari
- ✅ Touch devices

## Maintenance

### Adding New Selection Pages
1. Import ResponsiveGrid: `import { ResponsiveGrid } from '../ui';`
2. Replace existing grid markup with ResponsiveGrid component
3. Configure props based on data structure
4. Test with different item counts

### Customization
- Modify `ResponsiveGrid.jsx` for global changes
- Use `buttonClassName` prop for page-specific styling
- Adjust `maxItemsPerPage` for different pagination needs

## Performance Considerations

- **Lazy Loading**: Consider for large datasets (100+ items)
- **Virtualization**: Not needed for current use cases (max ~20 items)
- **Memory**: Minimal impact with current implementation
- **Touch Response**: Optimized for kiosk touch interfaces

## Future Enhancements

- [ ] Animation transitions between pages
- [ ] Keyboard navigation support
- [ ] Voice navigation integration
- [ ] Dynamic grid sizing based on screen resolution
- [ ] Custom grid layouts for specific use cases
