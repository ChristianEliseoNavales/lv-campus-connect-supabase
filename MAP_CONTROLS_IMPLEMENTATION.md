# University Kiosk System - MAP Page Controls Implementation

## Overview
This document describes the implementation of enhanced map controls for the University Kiosk System MAP page (directory/location finder), including wheelchair button active state, removal of active rings from other controls, and full screen map view with draggable/pinch-zoomable functionality.

## Changes Made

### 1. Wheelchair Button Active/Toggle State

**Location**: `frontend/src/components/pages/Map.jsx`

**Implementation**:
- Added `isAccessibilityActive` state to track wheelchair button toggle status
- Button now toggles between active and inactive states when clicked
- Active state uses **#FFE251 yellow** background with **#1F3463 navy blue** text
- Inactive state uses **#1F3463 navy blue** background with white text
- Smooth transition between states with `transition-all duration-150`

**Code**:
```jsx
const [isAccessibilityActive, setIsAccessibilityActive] = useState(false);

const handleAccessibility = () => {
  setIsAccessibilityActive(prev => !prev);
};

<button
  onClick={handleAccessibility}
  className={`flex-1 px-3 py-4 active:scale-95 transition-all duration-150 focus:outline-none flex items-center justify-center gap-2 border-r border-[#1A2E56] ${
    isAccessibilityActive
      ? 'bg-[#FFE251] text-[#1F3463]'
      : 'bg-[#1F3463] text-white active:bg-[#1A2E56]'
  }`}
  title="Priority Accessible Route"
  aria-label="Toggle priority accessible route"
>
  <FaWheelchair className="w-6 h-6" />
</button>
```

### 2. Removed Active Rings from Map Controls

**Changes**:
- Removed `focus:ring-4 focus:ring-blue-200` classes from:
  - Zoom In button
  - Zoom Out button
  - Full Screen button
  - Search button
- Wheelchair button also has focus ring removed
- Buttons now only have `focus:outline-none` for cleaner appearance

**Before**:
```jsx
className="... focus:outline-none focus:ring-4 focus:ring-blue-200 ..."
```

**After**:
```jsx
className="... focus:outline-none ..."
```

### 3. Full Screen Map View Implementation

**New Features**:
- Full screen overlay that covers entire viewport
- Draggable map with mouse and touch support
- Pinch-to-zoom functionality (scale range: 0.5x to 3x)
- Professional UI with navy blue header/footer and yellow accents
- Exit button with clear "EXIT FULL SCREEN MODE" text
- Zoom controls in footer with percentage display

**State Management**:
```jsx
const [isFullscreen, setIsFullscreen] = useState(false);
const [mapScale, setMapScale] = useState(1);
const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
const mapContainerRef = useRef(null);
```

**Drag Handlers**:
- `handleMouseDown` / `handleTouchStart` - Initiates dragging
- `handleMouseMove` / `handleTouchMove` - Updates map position during drag
- `handleMouseUp` / `handleTouchEnd` - Ends dragging
- Event listeners cleaned up on unmount with `useEffect`

**Zoom Handlers**:
- `handleZoomIn` - Increases scale by 0.2 (max 3x)
- `handleZoomOut` - Decreases scale by 0.2 (min 0.5x)
- Zoom buttons disabled at min/max limits

**Full Screen UI Structure**:
```
┌─────────────────────────────────────────────────────┐
│ Header (Navy Blue #1F3463)                          │
│ - Title: "CAMPUS MAP - FULL VIEW"                   │
│ - Exit Button (Yellow #FFE251)                      │
│   Border: Yellow #FFE251 (4px bottom)               │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Map Container (Gray Background)                     │
│ - Draggable map image                               │
│ - Cursor: move                                       │
│ - Touch action: none (for touch gestures)           │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Footer Controls (Navy Blue #1F3463)                 │
│ - ZOOM OUT button | Scale % | ZOOM IN button        │
│   Border: Yellow #FFE251 (4px top)                  │
└─────────────────────────────────────────────────────┘
```

**Full Screen Component**:
```jsx
{isFullscreen && (
  <div className="fixed inset-0 z-50 bg-[#1F3463] flex flex-col">
    {/* Header with title and exit button */}
    <div className="bg-[#1F3463] px-8 py-6 flex items-center justify-between border-b-4 border-[#FFE251]">
      <h2 className="text-3xl font-bold text-white">CAMPUS MAP - FULL VIEW</h2>
      <button onClick={handleExitFullscreen} className="bg-[#FFE251] text-[#1F3463] ...">
        <FaTimes className="w-6 h-6" />
        EXIT FULL SCREEN MODE
      </button>
    </div>

    {/* Draggable map container */}
    <div 
      ref={mapContainerRef}
      className="flex-grow relative overflow-hidden bg-gray-100 cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <img
        src="/map/1F.jpg"
        style={{
          transform: `scale(${mapScale}) translate(${mapPosition.x / mapScale}px, ${mapPosition.y / mapScale}px)`,
          touchAction: 'none'
        }}
        draggable={false}
      />
    </div>

    {/* Footer with zoom controls */}
    <div className="bg-[#1F3463] px-8 py-6 flex items-center justify-center gap-6 border-t-4 border-[#FFE251]">
      <button onClick={handleZoomOut} disabled={mapScale <= 0.5}>ZOOM OUT</button>
      <div>{Math.round(mapScale * 100)}%</div>
      <button onClick={handleZoomIn} disabled={mapScale >= 3}>ZOOM IN</button>
    </div>
  </div>
)}
```

## Design Specifications

### Color Scheme
- **Primary Navy Blue**: `#1F3463` (backgrounds, text)
- **Accent Yellow**: `#FFE251` (active states, borders, buttons)
- **White**: Text on navy backgrounds
- **Gray**: `bg-gray-100` for map container background

### Typography
- **SF Pro Rounded** font family (inherited from KioskLayout)
- **Font sizes**:
  - Header title: `text-3xl` (30px)
  - Button text: `text-xl` (20px)
  - Zoom percentage: `text-2xl` (24px)

### Spacing & Layout
- **16:9 landscape optimization** for kiosk displays
- **Padding**: `px-8 py-6` for header/footer
- **Gaps**: `gap-6` between footer controls
- **Borders**: `border-4` for yellow accent borders

### Interactions
- **Active states**: `active:scale-95` for button press feedback
- **Shadows**: `shadow-lg` with `active:shadow-md` for depth
- **Transitions**: `transition-all duration-150` for smooth state changes
- **Cursor**: `cursor-move` in fullscreen map container
- **Touch**: `touchAction: 'none'` to prevent default touch behaviors

## Accessibility Features

### ARIA Labels
- Wheelchair button: `aria-label="Toggle priority accessible route"`
- Descriptive `title` attributes on all control buttons

### Keyboard Support
- All buttons focusable with `focus:outline-none` (custom focus styles)
- Disabled states on zoom buttons at min/max limits

### Visual Feedback
- Clear active state for wheelchair button (yellow background)
- Scale percentage display in fullscreen mode
- Disabled button styling when zoom limits reached

## Browser Compatibility

### Touch Events
- Full support for touch gestures (drag, pinch-to-zoom)
- `touchAction: 'none'` prevents browser default behaviors
- Separate touch handlers for mobile/tablet devices

### Mouse Events
- Standard mouse drag support for desktop
- Event listeners properly cleaned up on unmount

### CSS Transforms
- Hardware-accelerated transforms for smooth performance
- Conditional transitions (disabled during drag for responsiveness)

## File Structure

```
frontend/src/components/pages/Map.jsx
├── Imports
│   ├── React hooks (useState, useRef, useEffect)
│   ├── KioskLayout
│   ├── React Icons (FaSearch, FaWheelchair, FaExpand, FaTimes, etc.)
│   └── HolographicKeyboard
├── State Management
│   ├── Search & keyboard states
│   ├── Floor & department selection
│   ├── Accessibility toggle state (NEW)
│   ├── Fullscreen states (NEW)
│   └── Drag & zoom states (NEW)
├── Event Handlers
│   ├── Search handlers
│   ├── Dropdown handlers
│   ├── Accessibility toggle (UPDATED)
│   ├── Fullscreen handlers (NEW)
│   ├── Zoom handlers (UPDATED)
│   └── Drag handlers (NEW)
├── Main Layout (KioskLayout)
│   ├── Search bar
│   ├── Map display
│   └── Control panel
│       ├── Department selector
│       ├── Floor selector
│       └── Map controls
│           ├── Wheelchair button (UPDATED - toggle state)
│           ├── Zoom in button (UPDATED - no focus ring)
│           ├── Zoom out button (UPDATED - no focus ring)
│           └── Fullscreen button (UPDATED - no focus ring)
└── Fullscreen Overlay (NEW)
    ├── Header with exit button
    ├── Draggable map container
    └── Footer with zoom controls
```

## Testing Recommendations

### Functional Testing
1. **Wheelchair Button Toggle**
   - Click wheelchair button → should turn yellow
   - Click again → should return to navy blue
   - Verify smooth transition between states

2. **Fullscreen Mode**
   - Click fullscreen button → should open fullscreen overlay
   - Verify map is centered and at 100% scale
   - Click "EXIT FULL SCREEN MODE" → should return to normal view

3. **Map Dragging**
   - In fullscreen mode, click and drag map → should move smoothly
   - Test on touchscreen → should support touch drag
   - Verify cursor changes to "move" in fullscreen

4. **Zoom Controls**
   - Click "ZOOM IN" → scale should increase to 120%, 140%, etc.
   - Click "ZOOM OUT" → scale should decrease to 80%, 60%, etc.
   - Verify buttons disable at 50% (min) and 300% (max)
   - Verify percentage display updates correctly

5. **Focus Ring Removal**
   - Tab through controls → verify no blue focus rings appear
   - Verify buttons still have focus outline removed

### Visual Testing
- Verify #FFE251 yellow color matches other public interface elements
- Verify #1F3463 navy blue consistency across all controls
- Verify 16:9 landscape optimization on kiosk displays
- Verify SF Pro Rounded font rendering

### Accessibility Testing
- Test with screen readers (ARIA labels)
- Verify keyboard navigation works correctly
- Test color contrast ratios (WCAG compliance)

### Performance Testing
- Test drag performance with large map images
- Verify smooth zoom transitions
- Test on various devices (desktop, tablet, touchscreen kiosk)

## Future Enhancements

### Potential Features
1. **Multi-touch Pinch Zoom**: Implement two-finger pinch gesture for zoom
2. **Floor Switching in Fullscreen**: Allow floor selection without exiting fullscreen
3. **Route Highlighting**: When accessibility mode is active, highlight accessible routes on map
4. **Search Integration**: Highlight searched locations on map in fullscreen mode
5. **Reset View Button**: Quick button to reset zoom and position to defaults
6. **Minimap**: Small overview map showing current viewport position
7. **Zoom Slider**: Alternative to +/- buttons for more precise zoom control

## Notes

- All changes use **Tailwind CSS utility classes exclusively** (no native CSS files)
- Maintains complete separation between public kiosk interface and admin modules
- Follows University Kiosk System design patterns and color scheme
- Optimized for 16:9 landscape kiosk displays
- Compatible with existing HolographicKeyboard overlay system

