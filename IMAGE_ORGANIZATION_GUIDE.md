# Image Organization Guide - University Kiosk System

## Overview
This document outlines the new image organization structure implemented for the University Kiosk System. Images have been reorganized into page-specific subfolders within the `/frontend/public` directory to improve maintainability and organization.

## New Folder Structure

```
frontend/public/
├── header.png              # Shared header image (used across all layouts)
├── main-bg.jpg             # Shared background image (used across all layouts)
├── vite.svg                # Favicon (shared)
├── directory/
│   └── mis.png             # MIS office directory image
├── idle/
│   ├── image1.png          # University campus carousel image 1
│   ├── image2.png          # University campus carousel image 2
│   ├── image3.png          # University campus carousel image 3
│   ├── image4.png          # University campus carousel image 4
│   └── image5.png          # University campus carousel image 5
├── map/
│   └── 1F.jpg              # First floor map image
└── queue/
    └── qr.png              # QR code placeholder image
```

## Image Usage by Component

### Shared Images (Root `/public` folder)
- **`header.png`** - Used in:
  - `KioskLayout.jsx`
  - `QueueLayout.jsx`
  - `DirectoryLayout.jsx`
- **`main-bg.jpg`** - Used in:
  - `KioskLayout.jsx`
  - `QueueLayout.jsx`
  - `DirectoryLayout.jsx`
- **`vite.svg`** - Used in:
  - `index.html` (favicon)

### Page-Specific Images

#### `/public/idle/` - Idle Page Images
- **`image1.png` to `image5.png`** - Used in:
  - `IdlePage.jsx` (carousel images)
- **Reference pattern**: `/idle/image1.png`

#### `/public/queue/` - Queue System Images
- **`qr.png`** - Used in:
  - `Queue.jsx` (QR code display)
- **Reference pattern**: `/queue/qr.png`

#### `/public/directory/` - Directory Page Images
- **`mis.png`** - Used in:
  - `Directory.jsx` (MIS office directory)
- **Reference pattern**: `/directory/mis.png`

#### `/public/map/` - Map Page Images
- **`1F.jpg`** - Used in:
  - `Map.jsx` (first floor map)
- **Reference pattern**: `/map/1F.jpg`

## Guidelines for Adding New Images

### 1. Determine Image Usage
Before adding a new image, determine which page(s) or component(s) will use it:

- **Single page usage**: Place in the appropriate page-specific subfolder
- **Multiple page usage**: Consider placing in the root `/public` folder if used across layouts
- **Admin-specific usage**: Create `/public/admin/` subfolder if needed

### 2. Naming Conventions
- Use descriptive, lowercase filenames
- Use hyphens for multi-word names (e.g., `office-map.jpg`)
- Include appropriate file extensions (`.png`, `.jpg`, `.svg`)

### 3. Folder Guidelines

#### When to use `/public/idle/`
- Images for the idle/screensaver page
- University campus photos
- Carousel/slideshow images

#### When to use `/public/queue/`
- QR codes
- Queue-related graphics
- Print-related images

#### When to use `/public/directory/`
- Office directory images
- Department maps
- Contact-related graphics

#### When to use `/public/map/`
- Floor plans
- Campus maps
- Navigation-related images

#### When to use root `/public/`
- Images used across multiple layouts
- Header images
- Background images
- Favicons and logos

### 4. Reference Patterns
When referencing images in components, use the appropriate path:

```jsx
// Page-specific images
<img src="/idle/campus-photo.png" alt="Campus" />
<img src="/queue/qr-code.png" alt="QR Code" />
<img src="/directory/office-map.png" alt="Office Map" />
<img src="/map/floor-plan.jpg" alt="Floor Plan" />

// Shared images
<img src="/header.png" alt="Header" />
<img src="/main-bg.jpg" alt="Background" />
```

## Migration Summary

### Files Moved
- `image1.png` → `/idle/image1.png`
- `image2.png` → `/idle/image2.png`
- `image3.png` → `/idle/image3.png`
- `image4.png` → `/idle/image4.png`
- `image5.png` → `/idle/image5.png`
- `qr.png` → `/queue/qr.png`
- `mis.png` → `/directory/mis.png`
- `1F.jpg` → `/map/1F.jpg`

### Components Updated
- `IdlePage.jsx` - Updated carousel image paths
- `Queue.jsx` - Updated QR code image path
- `Directory.jsx` - Updated MIS directory image path
- `Map.jsx` - Updated floor map image path

### Files Kept in Root
- `header.png` - Used across multiple layouts
- `main-bg.jpg` - Used across multiple layouts
- `vite.svg` - Favicon reference in index.html

## Benefits of This Organization

1. **Improved Maintainability**: Easy to locate images by their usage context
2. **Better Scalability**: Clear structure for adding new images
3. **Reduced Clutter**: Root folder contains only shared resources
4. **Easier Debugging**: Image paths clearly indicate their purpose
5. **Team Collaboration**: Developers can quickly understand image organization

## Future Considerations

- Consider creating `/public/admin/` subfolder if admin-specific images are added
- Monitor for images that become shared across multiple pages and move to root as needed
- Implement image optimization for better performance
- Consider adding image compression for production builds
