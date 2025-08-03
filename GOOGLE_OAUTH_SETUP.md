# Google OAuth Setup Guide for University Queue System

This guide will help you configure Google Single Sign-On (SSO) authentication for the University Queue System.

## Prerequisites

- Google account with access to Google Cloud Console
- University Queue System backend and frontend running locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "University Queue System"
4. Click "Create"

## Step 2: Enable Google Identity Services API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Identity Services API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (for testing with any Google account)
3. Fill in the required information:
   - **App name**: University Queue System
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click "Save and Continue"
5. Skip "Scopes" section (click "Save and Continue")
6. Add test users if needed (click "Save and Continue")

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Enter name: "University Queue System Web Client"
5. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3001
   ```
6. Add Authorized redirect URIs:
   ```
   http://localhost:3001/auth/google/callback
   ```
7. Click "Create"
8. **IMPORTANT**: Copy the Client ID and Client Secret

## Step 5: Configure Backend Environment

1. Open `backend/.env` file
2. Replace the placeholder values:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```

## Step 6: Configure Frontend Environment

1. Open `frontend/.env` file
2. Replace the placeholder value:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
   ```

## Step 7: Add Authorized Users

1. Open `backend/data/users.json`
2. Add users who should have access to the admin system:
   ```json
   {
     "users": [
       {
         "id": "1",
         "name": "Admin User",
         "email": "admin@yourdomain.com",
         "role": "super_admin",
         "department": "mis",
         "isActive": true,
         "createdAt": "2024-01-01T00:00:00.000Z"
       },
       {
         "id": "2",
         "name": "Registrar Admin",
         "email": "registrar@yourdomain.com",
         "role": "registrar_admin",
         "department": "registrar",
         "isActive": true,
         "createdAt": "2024-01-01T00:00:00.000Z"
       }
     ]
   }
   ```

## Step 8: Test the Configuration

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login`
4. Click "Sign in with Google"
5. Complete the Google authentication flow

## Troubleshooting

### Common Issues and Solutions

#### 1. "The given client ID is not found"
- **Cause**: Invalid or placeholder Google Client ID
- **Solution**: Ensure you've replaced the placeholder with your actual Google Client ID in both backend and frontend `.env` files

#### 2. "Server did not send the correct CORS headers"
- **Cause**: CORS configuration doesn't allow Google's domains
- **Solution**: The backend has been updated to include Google's authentication domains in CORS settings

#### 3. "ERR_FAILED on id assertion endpoint"
- **Cause**: Network connectivity or Google services issue
- **Solution**: Check internet connection and try again. Ensure Google Identity Services script is loaded

#### 4. "Access denied. Your email is not authorized"
- **Cause**: User's email is not in the authorized users list
- **Solution**: Add the user's email to `backend/data/users.json` with appropriate role

#### 5. Google Sign-In button not appearing
- **Cause**: Google Identity Services script not loaded
- **Solution**: Check that the script tag is in `frontend/index.html` and loading properly

### Development vs Production

**Development (localhost)**:
- Use the configuration as described above
- Authorized origins: `http://localhost:5173`, `http://localhost:3001`

**Production**:
- Update authorized origins to your production domain
- Use HTTPS for all URLs
- Update environment variables with production values
- Consider using Google Cloud Secret Manager for credentials

## Security Notes

- Never commit actual Google credentials to version control
- Use environment variables for all sensitive configuration
- Regularly rotate Google OAuth credentials
- Monitor Google Cloud Console for unusual activity
- Use HTTPS in production environments

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Check the backend logs for authentication errors
3. Verify all environment variables are set correctly
4. Ensure Google Cloud project settings match the configuration
