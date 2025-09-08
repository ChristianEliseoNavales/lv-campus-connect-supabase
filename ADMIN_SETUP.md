# University Queue System - Admin Module Setup Guide

This guide will help you set up and configure the admin modules for the University Queue System.

## Overview

The admin system provides role-based access control with three main roles:
- **MIS Super Admin**: Full system access, user management, system settings
- **Registrar Admin**: Registrar queue management, window controls, services
- **Admissions Admin**: Admissions queue management, application processing

## Features Implemented

### ✅ Authentication & Authorization
- **Dual Login System**: Google SSO + Email/Password fallback
- JWT token-based authentication
- Role-based access control
- Protected routes with automatic redirects
- Test credentials for development
- Automatic backend fallback when server unavailable

### ✅ Admin Layout & Navigation
- **Modern Navy Blue Design**: Professional navy blue sidebar and header
- **Header-based Navigation**: Hamburger menu and user profile in header
- **Responsive Sidebar**: Collapsible navy blue sidebar with white text
- **Role-specific Menu Items**: Filtered navigation based on user permissions
- **User Profile Dropdown**: Header-based user menu with sign out functionality
- **Professional Footer**: Credits and branding information
- **Consistent Styling**: Tailwind CSS with custom navy blue theme

### ✅ MIS Super Admin Dashboard
- User management (CRUD operations)
- System statistics overview
- User role assignment
- Department management
- System monitoring

### ✅ Registrar Admin Dashboard
- Queue management
- Multi-window controls
- Service completion tracking
- Real-time queue updates
- Window operator assignment

### ✅ Admissions Admin Dashboard
- Admissions queue management
- Application status tracking
- Document requirement management
- Interview scheduling
- Application approval workflow

### ✅ Shared UI Components
- DataTable with search, sort, pagination
- Modal dialogs with confirmation
- Form components with validation
- Status badges and indicators
- Loading states and error handling

## Quick Start

### 1. Frontend Setup

```bash
cd capstone-test/frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Access Admin Panel

Navigate to `http://localhost:5173/login` to access the admin login page.

**Login Options**:
1. **Google SSO**: Use your university Google account (requires configuration)
2. **Email & Password**: Use test credentials or configured user accounts

**Test Credentials** (available when backend is not configured):
- **Super Admin**: admin@test.edu / Admin123!
- **Registrar Admin**: registrar@test.edu / Registrar123!
- **Admissions Admin**: admissions@test.edu / Admissions123!

### 3. Admin Routes

- `/admin` - Main dashboard (role-based content)
- `/admin/mis` - MIS Super Admin dashboard
- `/admin/registrar` - Registrar Admin dashboard
- `/admin/admissions` - Admissions Admin dashboard

## Login System

### Dual Authentication Methods

The system supports two login methods:

1. **Google SSO (Primary)**:
   - University Google account authentication
   - Seamless integration with Google Identity Services
   - Automatic role assignment based on email domain
   - Secure OAuth 2.0 flow

2. **Email & Password (Fallback)**:
   - Manual credential entry
   - Form validation and error handling
   - Test credentials for development
   - Backend fallback when server unavailable

### Login Interface Features

- **Toggle Interface**: Easy switching between login methods
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed attempts
- **Accessibility**: Proper labels, placeholders, and ARIA attributes
- **Responsive Design**: Works on all screen sizes

## Configuration

### Google SSO Setup

1. **Create Google OAuth Client**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Identity Services API
   - Create OAuth 2.0 credentials

2. **Configure OAuth Client**:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`

3. **Update Environment Variables**:
   ```env
   # frontend/.env
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
   ```

### Role-Based Access

The system enforces strict role-based access:

```javascript
// Route Protection Examples
'/admin/mis/*'        -> super_admin only
'/admin/registrar/*'  -> super_admin, registrar_admin
'/admin/admissions/*' -> super_admin, admissions_admin
```

## User Interface Standards

### Color Scheme
- **Primary**: `#2F0FE4` (Purple-blue for accents)
- **Navy Blue**: `#1F3463` (Sidebar and header background)
- **Background**: `bg-gray-50` (Light gray main content)
- **Cards**: `bg-white` with subtle shadows
- **Text**: White/light colors on navy, dark colors on light backgrounds
- **Success**: Green variants
- **Warning**: Yellow/amber variants
- **Danger**: Red variants

### Typography
- Headers: Bold, clear hierarchy
- Body: Readable, consistent spacing
- Monospace: For IDs and codes

### Components
- All components use Tailwind CSS utilities
- Consistent spacing and padding
- Hover states and transitions
- Focus states for accessibility

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx              # Google SSO login
│   │   ├── ProtectedRoute.jsx     # Route protection
│   │   └── Unauthorized.jsx       # Access denied page
│   ├── layouts/
│   │   ├── AdminLayout.jsx        # Admin sidebar layout
│   │   └── KioskLayout.jsx        # Public kiosk layout
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx        # Main dashboard
│   │   │   ├── MISAdminDashboard.jsx     # MIS admin
│   │   │   ├── RegistrarAdminDashboard.jsx
│   │   │   └── AdmissionsAdminDashboard.jsx
│   │   └── [kiosk pages...]
│   └── ui/
│       ├── Button.jsx             # Reusable button
│       ├── Card.jsx               # Card components
│       ├── DataTable.jsx          # Data table with features
│       ├── Form.jsx               # Form components
│       ├── Modal.jsx              # Modal dialogs
│       ├── Badge.jsx              # Status badges
│       └── LoadingSpinner.jsx     # Loading states
├── contexts/
│   └── AuthContext.jsx            # Authentication state
├── hooks/
│   └── useGoogleAuth.js           # Google SSO hook
└── App.jsx                        # Main routing
```

## Security Features

### Authentication
- Google SSO with JWT tokens
- Automatic token refresh
- Secure token storage
- Session timeout handling

### Authorization
- Role-based route protection
- Component-level access control
- API endpoint protection
- Unauthorized access handling

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure API communication

## Development Guidelines

### Adding New Admin Features

1. **Create Component**: Add to `components/pages/admin/`
2. **Add Route**: Update `App.jsx` with protected route
3. **Update Navigation**: Modify `AdminLayout.jsx` navigation
4. **Test Access Control**: Verify role-based restrictions

### Styling Guidelines

1. **Use Tailwind Classes**: Avoid custom CSS
2. **Follow Color Scheme**: Use defined color palette
3. **Maintain Consistency**: Use existing component patterns
4. **Responsive Design**: Ensure mobile compatibility

### Testing

1. **Role Testing**: Test each role's access permissions
2. **Route Protection**: Verify unauthorized access handling
3. **UI Components**: Test all interactive elements
4. **Authentication Flow**: Test login/logout process

## Troubleshooting

### Common Issues

1. **Google SSO Not Working**:
   - Check client ID configuration
   - Verify authorized origins
   - Check browser console for errors

2. **Route Access Denied**:
   - Verify user role in JWT token
   - Check route protection configuration
   - Ensure user is properly authenticated

3. **UI Components Not Loading**:
   - Check component imports
   - Verify Tailwind CSS is working
   - Check browser console for errors

### Support

For technical issues:
- Check browser console for errors
- Verify environment variables
- Review authentication flow
- Contact system administrator

## Next Steps

To complete the admin system:

1. **Backend Integration**: Connect to actual API endpoints
2. **Real-time Updates**: Implement WebSocket connections
3. **Advanced Features**: Add reporting, analytics
4. **Testing**: Comprehensive testing suite
5. **Documentation**: User manuals for each role

## Security Notes

- Never commit real Google OAuth credentials
- Use environment variables for all secrets
- Implement proper session management
- Regular security audits recommended
- Follow OWASP security guidelines
