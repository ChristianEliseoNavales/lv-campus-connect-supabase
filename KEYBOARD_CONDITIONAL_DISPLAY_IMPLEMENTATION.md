# Keyboard Conditional Display Implementation

## Overview
Implemented conditional display logic for the virtual keyboard toggle button in the University Kiosk System. The keyboard button now only appears when users are actively filling out forms, improving the user experience by reducing UI clutter on navigation and informational pages.

## Implementation Details

### 1. Enhanced Keyboard Toggle Button Design
**Location**: `frontend/src/components/layouts/QueueLayout.jsx` (lines 47-74)

**Improvements**:
- **Increased Size**: Button size increased from 24x12 to 32x16 for better touch-friendly interaction
- **Clear Labeling**: Added text labels "Keyboard" and "Hide" for improved accessibility
- **Enhanced Styling**: Added gradient backgrounds and improved visual hierarchy
- **Navy Blue Theme**: Consistent use of #1F3463 primary color with gradient effects

**Features**:
```javascript
// Enhanced button with larger size and clear labeling
className="w-32 h-16 flex flex-col items-center justify-center"
// Dynamic label based on keyboard state
<span className="text-xs font-semibold">
  {showKeyboard ? 'Hide' : 'Keyboard'}
</span>
```

### 2. Conditional Display Logic

#### Queue Component (Form Input Pages)
**Location**: `frontend/src/components/pages/Queue.jsx`

**Conditional Logic**:
- ✅ **Form Input Phase**: Keyboard button visible when `showForm = true`
- ❌ **Department Selection**: No keyboard button (navigation page)
- ❌ **Service Selection**: No keyboard button (selection page)

```javascript
// Form state - Shows keyboard button
if (showForm) {
  return (
    <QueueLayout
      showKeyboard={showKeyboard}
      onToggleKeyboard={toggleKeyboard}
    >
      {/* Form content with input fields */}
    </QueueLayout>
  );
}

// Navigation states - No keyboard button
return (
  <KioskLayout> {/* or QueueLayout without keyboard props */}
    {/* Navigation/selection content */}
  </KioskLayout>
);
```

#### Map Component (Search Input Page)
**Location**: `frontend/src/components/pages/Map.jsx`

**Features**:
- ✅ **Search Input Available**: Keyboard button shows when search is focused
- **Auto-focus Behavior**: Keyboard shows automatically when search input is focused
- **Standard Navigation**: Uses default KioskLayout navigation (no custom footer)
- **Inline Keyboard Toggle**: Keyboard button appears next to search input when needed

```javascript
// Keyboard toggle button appears inline with search controls
{(isSearchFocused || showKeyboard) && (
  <button
    onClick={toggleKeyboard}
    className="w-16 h-16 flex flex-col items-center justify-center rounded-lg..."
  >
    {/* Keyboard toggle button */}
  </button>
)}

return (
  <KioskLayout>
    {/* Map content with search input and inline keyboard toggle */}
  </KioskLayout>
);
```

### 3. Pages Without Keyboard Button

The following pages do **NOT** show the keyboard button as they contain no form inputs:

- **Home** (`/`): Navigation page only
- **Bulletin** (`/bulletin`): Content display only
- **Directory** (`/directory`): Navigation and information display
- **FAQ** (`/faq`): Accordion content display
- **Admin modules**: Use separate admin layouts

### 4. Button Styling Specifications

**Size & Position**:
- Width: 32 units (128px)
- Height: 16 units (64px)
- Position: Bottom center of screen
- Shape: Half-circle (rounded top, flat bottom)

**Colors**:
- **Inactive State**: Navy blue (#1F3463) with gradient to #1A2E56
- **Active State**: Yellow gradient (#fef08a to #fbbf24) with blue text
- **Hover Effects**: Subtle color transitions

**Typography**:
- Icon: 7x7 units (28px)
- Label: Extra small, semi-bold font
- Dynamic text: "Keyboard" (inactive) / "Hide" (active)

## Testing Scenarios

### ✅ Keyboard Button Should Appear:
1. **Queue Form**: Navigate to Queue → Select Department → Select Service → Fill Form
2. **Map Search**: Navigate to Map page (search input available)

### ❌ Keyboard Button Should NOT Appear:
1. **Home Page**: Main navigation screen
2. **Queue Navigation**: Department and service selection screens
3. **Highlights**: Content browsing
4. **Directory**: Contact information browsing
5. **FAQ**: Accordion content

## Accessibility Features

- **ARIA Label**: `aria-label="Toggle virtual keyboard"`
- **Focus Management**: Proper focus ring with blue outline
- **Clear Visual Feedback**: Distinct active/inactive states
- **Touch-Friendly**: Large button size optimized for kiosk touchscreens
- **Keyboard Navigation**: Supports keyboard accessibility

## Technical Implementation Notes

- **Layout Integration**: Uses existing QueueLayout and KioskLayout components
- **State Management**: Local component state for keyboard visibility
- **Animation Support**: Leverages existing CSS animations for smooth transitions
- **Responsive Design**: Maintains 16:9 landscape optimization
- **Performance**: Conditional rendering prevents unnecessary DOM elements

## Future Enhancements

1. **Auto-hide Timer**: Automatically hide keyboard after inactivity
2. **Input Field Detection**: Dynamic keyboard button based on active input fields
3. **Keyboard Shortcuts**: Support for physical keyboard shortcuts
4. **Multi-language Support**: Keyboard layouts for different languages
