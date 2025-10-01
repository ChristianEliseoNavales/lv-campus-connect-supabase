# MAP Page Implementation Diagram

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Map Component                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  State Management                                            │
│  ├─ mapScale (1 to 3)                                       │
│  ├─ mapPosition { x, y }                                    │
│  ├─ isDragging (boolean)                                    │
│  ├─ isFullscreen (boolean)                                  │
│  └─ isAccessibilityActive (boolean)                         │
│                                                              │
│  Refs                                                        │
│  ├─ normalMapContainerRef → Normal view container           │
│  ├─ normalMapImageRef → Normal view image                   │
│  ├─ mapContainerRef → Fullscreen container                  │
│  └─ mapImageRef → Fullscreen image                          │
│                                                              │
│  Functions                                                   │
│  ├─ constrainPosition() → Boundary detection                │
│  ├─ handleZoomIn() → Zoom in with constraints               │
│  ├─ handleZoomOut() → Zoom out with constraints             │
│  ├─ handleMouseDown/Move/Up → Mouse drag handlers           │
│  ├─ handleTouchStart/Move/End → Touch drag handlers         │
│  ├─ handleFullscreen() → Enter fullscreen                   │
│  └─ handleExitFullscreen() → Exit fullscreen                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action
    ↓
Event Handler
    ↓
Calculate New State
    ↓
Apply Constraints
    ↓
Update State
    ↓
Re-render with Transform
```

## Zoom Flow

```
User clicks Zoom In/Out button
    ↓
handleZoomIn() or handleZoomOut()
    ↓
Calculate new scale
    ├─ Zoom In: min(current + 0.2, 3)
    └─ Zoom Out: max(current - 0.2, 1)
    ↓
Select correct refs (normal or fullscreen)
    ↓
constrainPosition(x, y, newScale, containerRef, imageRef)
    ↓
Update mapScale and mapPosition state
    ↓
CSS transform applied to image
```

## Pan Flow

```
User starts dragging
    ↓
handleMouseDown() or handleTouchStart()
    ↓
Set isDragging = true
Store dragStart position
    ↓
User moves mouse/finger
    ↓
handleMouseMove() or handleTouchMove()
    ↓
Calculate new position
    newX = clientX - dragStart.x
    newY = clientY - dragStart.y
    ↓
Select correct refs (normal or fullscreen)
    ↓
constrainPosition(newX, newY, mapScale, containerRef, imageRef)
    ↓
Update mapPosition state
    ↓
CSS transform applied to image
    ↓
User releases mouse/finger
    ↓
handleMouseUp() or handleTouchEnd()
    ↓
Set isDragging = false
```

## Constraint Algorithm

```
constrainPosition(newX, newY, scale, containerRef, imageRef)
    ↓
Get container dimensions
    container.width, container.height
    ↓
Get image natural dimensions
    image.naturalWidth, image.naturalHeight
    ↓
Calculate scaled dimensions
    scaledWidth = naturalWidth × scale
    scaledHeight = naturalHeight × scale
    ↓
Calculate max translation
    maxX = max(0, (scaledWidth - containerWidth) / 2)
    maxY = max(0, (scaledHeight - containerHeight) / 2)
    ↓
Constrain position
    constrainedX = max(-maxX, min(maxX, newX))
    constrainedY = max(-maxY, min(maxY, newY))
    ↓
Return { x: constrainedX, y: constrainedY }
```

## View Modes

### Normal View Mode

```
┌─────────────────────────────────────────────────────────┐
│ KioskLayout                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Search Bar                                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Map Container (normalMapContainerRef)               │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │                                                  │ │ │
│ │ │  Map Image (normalMapImageRef)                  │ │ │
│ │ │  - Draggable                                     │ │ │
│ │ │  - Zoomable                                      │ │ │
│ │ │  - Transform applied                             │ │ │
│ │ │                                                  │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Controls                                            │ │
│ │ [Dept ▼] [Floor ▼] [♿][+][-][⛶]                   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

State: isFullscreen = false
Refs: normalMapContainerRef, normalMapImageRef
```

### Fullscreen View Mode

```
┌─────────────────────────────────────────────────────────┐
│ Fullscreen Overlay (fixed inset-0)                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Header (Navy Blue #1F3463)                          │ │
│ │ CAMPUS MAP - FULL VIEW          [EXIT FULL SCREEN] │ │
│ ├═════════════════════════════════════════════════════┤ │ ← Yellow border
│ │                                                     │ │
│ │ Map Container (mapContainerRef)                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │                                                  │ │ │
│ │ │  Map Image (mapImageRef)                        │ │ │
│ │ │  - Draggable                                     │ │ │
│ │ │  - Zoomable                                      │ │ │
│ │ │  - Transform applied                             │ │ │
│ │ │                                                  │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ ├═════════════════════════════════════════════════════┤ │ ← Yellow border
│ │ Footer (Navy Blue #1F3463)                          │ │
│ │ [ZOOM OUT]        100%        [ZOOM IN]             │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

State: isFullscreen = true
Refs: mapContainerRef, mapImageRef
```

## Transform Logic

### CSS Transform Applied to Image

```css
transform: scale(mapScale) translate(mapPosition.x / mapScale, mapPosition.y / mapScale)
```

**Why divide by scale?**
- Translation happens AFTER scaling
- Need to compensate for scale factor
- Keeps position consistent across zoom levels

**Example:**
```
Scale: 2x
Position: { x: 100, y: 50 }

Transform: scale(2) translate(50px, 25px)
           ↑         ↑
           2x zoom   100/2, 50/2

Result: Image is 2x larger and shifted 100px right, 50px down
```

## Boundary Calculation Example

### Scenario 1: Image Smaller Than Container

```
Container: 800px × 600px
Image: 400px × 300px (at 100% scale)

Scaled: 400px × 300px
Max Translation: 0px (image fits entirely)

Allowed Range:
  X: 0px to 0px (centered)
  Y: 0px to 0px (centered)

Result: Image cannot be panned (too small)
```

### Scenario 2: Image Larger Than Container

```
Container: 800px × 600px
Image: 1200px × 900px (at 100% scale)

Scaled: 1200px × 900px
Max Translation X: (1200 - 800) / 2 = 200px
Max Translation Y: (900 - 600) / 2 = 150px

Allowed Range:
  X: -200px to +200px
  Y: -150px to +150px

Result: Image can be panned within bounds
```

### Scenario 3: Zoomed In Image

```
Container: 800px × 600px
Image: 600px × 450px (at 100% scale)
Zoomed: 1200px × 900px (at 200% scale)

Scaled: 1200px × 900px
Max Translation X: (1200 - 800) / 2 = 200px
Max Translation Y: (900 - 600) / 2 = 150px

Allowed Range:
  X: -200px to +200px
  Y: -150px to +150px

Result: Zooming in enables panning
```

## State Transitions

```
Initial State
  mapScale: 1
  mapPosition: { x: 0, y: 0 }
  isDragging: false
  isFullscreen: false

User clicks Zoom In
  mapScale: 1.2
  mapPosition: { x: 0, y: 0 } (constrained)

User drags map
  isDragging: true
  mapPosition: { x: 50, y: 30 } (constrained)

User releases drag
  isDragging: false
  mapPosition: { x: 50, y: 30 }

User clicks Fullscreen
  isFullscreen: true
  mapScale: 1 (reset)
  mapPosition: { x: 0, y: 0 } (reset)

User exits Fullscreen
  isFullscreen: false
  mapScale: 1 (reset)
  mapPosition: { x: 0, y: 0 } (reset)
```

## Event Handler Routing

```
Event Occurs
    ↓
Is it in Normal View or Fullscreen?
    ↓
    ├─ Normal View
    │   ├─ Use normalMapContainerRef
    │   └─ Use normalMapImageRef
    │
    └─ Fullscreen View
        ├─ Use mapContainerRef
        └─ Use mapImageRef
    ↓
Apply same logic to both views
    ↓
Update shared state (mapScale, mapPosition)
    ↓
Both views use same transform
```

## Zoom Button States

```
mapScale = 1.0 (100%)
  ├─ Zoom Out: DISABLED (at minimum)
  └─ Zoom In: ENABLED

mapScale = 1.2 (120%)
  ├─ Zoom Out: ENABLED
  └─ Zoom In: ENABLED

mapScale = 2.0 (200%)
  ├─ Zoom Out: ENABLED
  └─ Zoom In: ENABLED

mapScale = 3.0 (300%)
  ├─ Zoom Out: ENABLED
  └─ Zoom In: DISABLED (at maximum)
```

## Constraint Visualization

### At 100% Zoom (Minimum)

```
┌─────────────────────────────────┐
│ Container                       │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   Image (actual size)     │  │
│  │   Cannot pan              │  │
│  │                           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Position: { x: 0, y: 0 } (centered)
```

### At 200% Zoom

```
┌─────────────────────────────────┐
│ Container                       │
│  ┌───────────────────────────┐  │
│  │ ╔═══════════════════════╗ │  │
│  │ ║                       ║ │  │
│  │ ║   Image (2x size)     ║ │  │
│  │ ║   Can pan ↕ ↔         ║ │  │
│  │ ║                       ║ │  │
│  │ ╚═══════════════════════╝ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Position: { x: -100, y: -50 } (panned left/up)
Image extends beyond container
```

### At 300% Zoom (Maximum)

```
┌─────────────────────────────────┐
│ Container                       │
│  ┌───────────────────────────┐  │
│  │ ╔═══════════════════════╗ │  │
│  │ ║ ┌─────────────────┐   ║ │  │
│  │ ║ │ Image (3x size) │   ║ │  │
│  │ ║ │ Can pan ↕ ↔     │   ║ │  │
│  │ ║ └─────────────────┘   ║ │  │
│  │ ╚═══════════════════════╝ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Position: { x: 200, y: 150 } (panned right/down)
Image extends far beyond container
```

## Performance Considerations

### Optimizations
1. **Conditional Transitions**: Disabled during drag for smooth movement
2. **Hardware Acceleration**: CSS transforms use GPU
3. **Ref-based Calculations**: Direct DOM access for dimensions
4. **Constrained Updates**: Only update when within bounds
5. **Event Cleanup**: Remove listeners on unmount

### Render Triggers
- `mapScale` changes → Re-render with new transform
- `mapPosition` changes → Re-render with new transform
- `isDragging` changes → Toggle transition
- `isFullscreen` changes → Switch view mode

## Summary

This implementation provides:
- ✅ Zoom and pan in both normal and fullscreen views
- ✅ Smart constraints (100%-300% zoom, bounded pan)
- ✅ Smooth interactions with mouse and touch
- ✅ Consistent behavior across view modes
- ✅ Efficient performance with hardware acceleration
- ✅ Clean code with reusable constraint function

