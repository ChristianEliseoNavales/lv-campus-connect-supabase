# PortalQueue Component

## Overview
The PortalQueue component is a mobile-responsive queue status page designed for the University Kiosk System. It serves as the endpoint for users who scan QR codes to check their queue status.

## Features
- **Mobile-First Design**: Optimized for smartphones, tablets, and iPads
- **Responsive Layout**: Adapts to different screen sizes using Tailwind CSS breakpoints
- **University Branding**: Uses the #1F3463 navy blue color scheme
- **Real-Time Date**: Displays current date dynamically
- **Queue Status Display**: Shows current serving number and waiting queue numbers

## Route
- **Development**: `/portalqueue`
- **Production**: Can be configured for any endpoint

## Layout Structure

### 1. Header Section
- Mobile header image from `/public/mobile/mobileHeader.png`
- Responsive sizing: 24px (mobile) to 40px (desktop) max height

### 2. Date Validity Section
- Dynamic date display using JavaScript Date object
- Format: "This queue is only valid on [Month Day, Year]"

### 3. Queue Number Display
- Large circular border design (consistent with existing QR queue styling)
- Responsive sizing: 36x36 (mobile) to 56x56 (desktop)
- Navy blue border and text color (#1F3463)

### 4. Queue Information Section
- Queue Number label
- Location (office name)
- Window assignment
- Responsive typography

### 5. Queue Status Container
- Light gray background container
- 3-column grid layout:
  - Column 1: "NOW SERVING" (navy blue background)
  - Columns 2-3: "WAITING IN LINE" (gray background)
- Labels: "Serving" and "Waiting in line"

### 6. Footer Section
- Footer image from `/public/mobile/footer.png`
- Responsive sizing: 16px (mobile) to 24px (desktop) max height

## Responsive Breakpoints
- **Mobile**: Default (320px+)
- **Small**: sm: (640px+)
- **Medium**: md: (768px+)
- **Large**: lg: (1024px+)

## State Management
Currently uses static data for demonstration:
- `queueNumber`: 42
- `selectedOffice`: "Registrar"
- `assignedWindow`: 3
- `nowServing`: 38
- `waitingNumbers`: [39, 40]

## Future Integration
The component is prepared for future integration with:
- Real queue data from backend API
- Dynamic office and window assignment
- Real-time queue status updates
- WebSocket connections for live updates

## Styling
- **Font**: SF Pro Rounded (font-kiosk-public)
- **Primary Color**: #1F3463 (navy blue)
- **Background**: Light gray (#f9fafb)
- **Framework**: Tailwind CSS utility classes

## Accessibility
- Semantic HTML structure
- Alt text for images
- Proper heading hierarchy
- Color contrast compliance
- Touch-friendly button sizes

## Browser Compatibility
- Chrome/Edge (Primary)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing
Access the component at: `http://localhost:5173/portalqueue`

## Dependencies
- React 18+
- Tailwind CSS
- React Router DOM
- SF Pro Rounded font family
