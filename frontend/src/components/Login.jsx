import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification, showAuthError } from './NotificationSystem';
import useGoogleAuth from '../hooks/useGoogleAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithEmail, isAuthenticated, logout, user, loading } = useAuth();
  const { showError, showSuccess } = useNotification();
  const { isGoogleLoaded, isLoading, signInWithGoogle } = useGoogleAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' or 'email'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);

  // Check if already authenticated and handle accordingly
  useEffect(() => {
    // Don't redirect immediately, wait for loading to complete
    if (!loading && isAuthenticated) {
      // Check if this is a forced login (e.g., from URL parameter)
      const urlParams = new URLSearchParams(location.search);
      const forceLogin = urlParams.get('force') === 'true';

      if (forceLogin) {
        // User wants to force re-login, so logout first
        logout();
        setShowAlreadyLoggedIn(false);
      } else {
        // Show already logged in state instead of immediate redirect
        setShowAlreadyLoggedIn(true);
      }
    }
  }, [isAuthenticated, loading, location.search, logout]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle role-based navigation - always redirect based on current user role only
  const navigateBasedOnRole = (user) => {
    // Always redirect based on current user's role, ignore any cached navigation state
    if (user.role === 'super_admin') {
      navigate('/admin/mis', { replace: true });
    } else if (user.role === 'registrar_admin') {
      navigate('/admin/registrar', { replace: true });
    } else if (user.role === 'admissions_admin') {
      navigate('/admin/admissions', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginWithEmail(formData.email, formData.password);

      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}!`);

        // Wait a moment for the authentication state to fully propagate
        await new Promise(resolve => setTimeout(resolve, 200));

        navigateBasedOnRole(result.user);
      } else {
        if (result.code === 'INVALID_CREDENTIALS') {
          showError('Invalid email or password. Please check your credentials and try again.');
        } else if (result.code === 'GOOGLE_ONLY_ACCOUNT') {
          showError('This account uses Google Sign-In only. Please use the Google login option.');
        } else {
          showError(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Email login error:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleLoaded) {
      showError('Google Sign-In is not ready. Please try again.');
      return;
    }

    setIsSigningIn(true);

    try {
      const googleToken = await signInWithGoogle();
      const result = await login(googleToken);

      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}!`);

        // Wait a moment for the authentication state to fully propagate
        await new Promise(resolve => setTimeout(resolve, 200));

        navigateBasedOnRole(result.user);
      } else {
        showAuthError({ response: { data: { error: result.error } } }, showError);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      showAuthError(error, showError);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleBackToKiosk = () => {
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    logout();
    setShowAlreadyLoggedIn(false);
    showSuccess('You have been logged out successfully.');
  };

  const handleContinueAsCurrentUser = () => {
    navigateBasedOnRole(user);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Show already logged in state
  if (showAlreadyLoggedIn && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 sm:p-5 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
          <div className="text-center py-8 px-5 sm:py-10 sm:px-8 bg-gradient-to-br from-green-50 to-green-200 border-b border-green-200">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-slate-800 text-2xl font-bold mb-2">Already Signed In</h1>
            <h2 className="text-slate-600 text-lg font-semibold mb-3">Welcome back, {user.name}!</h2>
            <p className="text-slate-500 text-sm leading-relaxed">You are currently signed in as <strong>{user.role.replace('_', ' ')}</strong></p>
          </div>

          <div className="p-5 sm:p-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">You are already authenticated. What would you like to do?</p>

              <div className="space-y-3">
                <button
                  onClick={handleContinueAsCurrentUser}
                  className="w-full py-3 px-5 bg-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-600 hover:shadow-lg"
                >
                  Continue to Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-5 bg-gray-500 text-white rounded-lg font-medium transition-all duration-200 hover:bg-gray-600 hover:shadow-lg"
                >
                  Sign Out & Login as Different User
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="mb-2 text-sm font-semibold text-blue-800">Current Session Info</h4>
              <div className="text-xs text-blue-900 space-y-1">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role.replace('_', ' ')}</div>
                {user.department && <div><strong>Department:</strong> {user.department}</div>}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 py-4 px-5 sm:py-5 sm:px-8 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={handleBackToKiosk}
              className="bg-gray-500 text-white border-none py-2 px-4 rounded text-sm font-medium transition-colors duration-200 hover:bg-gray-600"
            >
              ← Back to Kiosk
            </button>
            <p className="text-gray-500 text-xs">© 2024 University Kiosk System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="text-center py-8 px-6 sm:py-10 sm:px-8 bg-gradient-to-br from-slate-50 to-slate-200 border-b border-slate-200">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-slate-800 text-2xl font-bold mb-3">University Kiosk System</h1>
          <h2 className="text-slate-600 text-lg font-semibold mb-4">Admin Access</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Sign in with your university Google account to access the admin dashboard</p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Login Method Tabs */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                loginMethod === 'google'
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setLoginMethod('google')}
            >
              Google SSO
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                loginMethod === 'email'
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setLoginMethod('email')}
            >
              Email & Password
            </button>
          </div>

          {/* Google Sign-In Section */}
          {loginMethod === 'google' && (
            <div className="text-center mb-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={!isGoogleLoaded || isSigningIn || isLoading}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 shadow-sm hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSigningIn || isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Fallback Google Sign-In button container */}
              <div id="google-signin-button" style={{ display: 'none' }}></div>
            </div>
          )}

          {/* Email/Password Sign-In Section */}
          {loginMethod === 'email' && (
            <div className="mb-8">
              <form onSubmit={handleEmailLogin} className="mb-8">
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full py-3 px-4 border-2 rounded-lg text-base transition-all duration-200 box-border focus:outline-none ${
                      formErrors.email
                        ? 'border-red-600 shadow-red-100 focus:border-red-600 focus:shadow-lg focus:shadow-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100'
                    } ${isSubmitting ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <span className="block mt-2 text-xs text-red-600">{formErrors.email}</span>}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full py-3 px-4 border-2 rounded-lg text-base transition-all duration-200 box-border focus:outline-none ${
                      formErrors.password
                        ? 'border-red-600 shadow-red-100 focus:border-red-600 focus:shadow-lg focus:shadow-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100'
                    } ${isSubmitting ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  {formErrors.password && <span className="block mt-2 text-xs text-red-600">{formErrors.password}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-blue-500 border-none rounded-lg text-base font-medium text-white transition-all duration-200 shadow-md hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-200 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
                <h4 className="mb-4 text-sm font-semibold text-blue-800 flex items-center gap-2">🧪 Test Credentials</h4>
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-blue-900 font-mono bg-white py-3 px-4 rounded border border-blue-100">
                    <strong>Super Admin:</strong> admin@test.edu / Admin123!
                  </div>
                  <div className="text-xs text-blue-900 font-mono bg-white py-3 px-4 rounded border border-blue-100">
                    <strong>Registrar Admin:</strong> registrar@test.edu / Registrar123!
                  </div>
                  <div className="text-xs text-blue-900 font-mono bg-white py-3 px-4 rounded border border-blue-100">
                    <strong>Admissions Admin:</strong> admissions@test.edu / Admissions123!
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="mb-6">
              <h3 className="text-slate-800 text-base font-semibold mb-4 flex items-center gap-2">🔐 Authorized Personnel Only</h3>
              <ul className="ml-6 text-slate-600 text-sm leading-relaxed space-y-2">
                <li><strong>MIS Super Admin:</strong> Full system access and user management</li>
                <li><strong>Registrar Admin:</strong> Registrar's Office queue management</li>
                <li><strong>Admissions Admin:</strong> Admissions Office queue management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-800 text-base font-semibold mb-4 flex items-center gap-2">📧 Contact Information</h3>
              <p className="text-slate-500 text-sm mb-3 leading-relaxed">If you need access to the admin system, please contact:</p>
              <p className="text-slate-500 text-sm leading-relaxed"><strong>MIS Department:</strong> mis@university.edu</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 py-5 px-6 sm:py-6 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <button
            onClick={handleBackToKiosk}
            className="bg-gray-500 text-white border-none py-3 px-5 rounded text-sm font-medium transition-colors duration-200 hover:bg-gray-600"
          >
            ← Back to Kiosk
          </button>

          <div className="text-center sm:text-right flex-1 space-y-1">
            <p className="text-gray-500 text-xs leading-tight">© 2024 University Kiosk System</p>
            <p className="text-gray-500 text-xs leading-tight">Secure authentication powered by Google</p>
            <p className="text-gray-500 text-xs leading-tight">
              Already logged in? <a href="/login?force=true" className="text-blue-500 hover:text-blue-600 underline">Force re-login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
