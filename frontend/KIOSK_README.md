# University Kiosk System - Public Interface

## Overview
This is a public kiosk interface for the University Queue System, designed specifically for student and visitor use. The interface provides access to university services without requiring authentication.

## Features

### 🏠 **Home Page**
- Welcome message and university information
- Quick access cards for major services
- Office hours and emergency contact information

### 📢 **Announcements**
- Latest university news and updates
- Priority-based announcement system (High, Medium, Low)
- Searchable announcement archive

### 🔍 **Search**
- Find departments, services, and faculty
- Category-based filtering
- Comprehensive search results with contact information

### 🗺️ **Campus Map**
- Interactive campus building map
- Building information and department listings
- Navigation pathways and accessibility information

### 📋 **Directory**
- Faculty and staff contact information
- Department listings with office hours
- Email and phone contact details

### 📝 **Queue System**
- Join queues for university services
- Department and service selection
- Real-time queue status and wait times

### ❓ **FAQs**
- Frequently asked questions by category
- Searchable knowledge base
- Contact information for additional help

### 🆘 **Help & Support**
- System usage instructions
- Emergency contact information
- Technical support details

## Design Specifications

### Layout
- **Aspect Ratio**: 16:9 landscape orientation
- **Header**: University branding with real-time date/time
- **Navigation**: Bottom navigation bar with 8 items
- **Color Scheme**: Navy blue (#1e3a8a) primary, white text

### Navigation Structure
1. **HOME** - Main landing page
2. **ANNOUNCEMENT** - University news
3. **SEARCH** - Find information
4. **MAP** - Campus navigation
5. **DIRECTORY** - Contact information
6. **QUEUE** - Service queues
7. **FAQs** - Help articles
8. **?** - Help & support (circular button)

### Accessibility Features
- High contrast text for visibility
- Touch-optimized interface (44px minimum touch targets)
- Responsive design for various screen sizes
- WCAG accessibility standards compliance

## Technical Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Inline SVG components

## File Structure
```
src/
├── components/
│   ├── layouts/
│   │   ├── KioskLayout.jsx     # Main layout component
│   │   └── index.js
│   ├── pages/
│   │   ├── Home.jsx            # Home page
│   │   ├── Announcement.jsx    # Announcements
│   │   ├── Search.jsx          # Search functionality
│   │   ├── Map.jsx             # Campus map
│   │   ├── Directory.jsx       # Contact directory
│   │   ├── Queue.jsx           # Queue system
│   │   ├── FAQ.jsx             # FAQ system
│   │   ├── Help.jsx            # Help & support
│   │   └── index.js
│   └── ui/                     # Reusable UI components
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd capstone-test/frontend
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Kiosk Deployment Notes

### Display Requirements
- Minimum resolution: 1920x1080 (Full HD)
- Recommended: 16:9 aspect ratio displays
- Touch screen capability recommended

### Browser Configuration
- Full-screen mode (F11)
- Disable browser navigation (back/forward buttons)
- Auto-refresh capability for updates
- Disable right-click context menu

### Performance Optimization
- All assets are optimized for fast loading
- Minimal external dependencies
- Responsive images and icons
- Efficient component rendering

## Maintenance

### Content Updates
- Announcements: Update the `announcements` array in `Announcement.jsx`
- FAQ: Modify the `faqData` array in `FAQ.jsx`
- Directory: Update the `directoryData` array in `Directory.jsx`
- Campus Map: Modify the `buildings` array in `Map.jsx`

### Styling Updates
- Global styles: Edit `src/index.css`
- Component styles: Use Tailwind utility classes
- Color scheme: Update the navy blue theme in components

## Security Notes
- No authentication required for public access
- No backend API dependencies
- All data is static and client-side only
- No sensitive information exposed

## Support
For technical issues or feature requests, contact the IT Help Desk:
- Phone: (123) 456-7804
- Email: helpdesk@university.edu
