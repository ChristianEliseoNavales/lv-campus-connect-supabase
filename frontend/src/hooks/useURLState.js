import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing state persistence using URL query parameters
 * Provides a clean API for components to persist filter states across navigation
 */
const useURLState = (initialState = {}, options = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    replace = true, // Use replace instead of push to avoid cluttering browser history
    debounceMs = 300 // Debounce URL updates to avoid excessive history entries
  } = options;

  // Memoize the initial state to prevent infinite loops
  const memoizedInitialState = useMemo(() => initialState, []);

  // Parse URL parameters into state object
  const parseURLParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlState = {};

    // Parse each parameter based on the initial state type
    Object.keys(memoizedInitialState).forEach(key => {
      const value = searchParams.get(key);
      if (value !== null) {
        const initialValue = memoizedInitialState[key];

        // Type conversion based on initial state
        if (typeof initialValue === 'number') {
          urlState[key] = parseInt(value, 10) || initialValue;
        } else if (typeof initialValue === 'boolean') {
          urlState[key] = value === 'true';
        } else if (initialValue instanceof Date) {
          // Handle Date objects - store as ISO string in URL
          const dateValue = new Date(value);
          urlState[key] = isNaN(dateValue.getTime()) ? null : dateValue;
        } else {
          // String values
          urlState[key] = value || initialValue;
        }
      } else {
        urlState[key] = memoizedInitialState[key];
      }
    });

    return urlState;
  }, [location.search, memoizedInitialState]);

  // Initialize state from URL or use initial values
  const [state, setState] = useState(() => parseURLParams());

  // Debounced URL update function
  const updateURL = useCallback(() => {
    const searchParams = new URLSearchParams();

    // Add non-default values to URL
    Object.keys(state).forEach(key => {
      const value = state[key];
      const initialValue = memoizedInitialState[key];

      // Only add to URL if value differs from initial/default
      if (value !== initialValue && value !== null && value !== undefined && value !== '') {
        if (value instanceof Date) {
          searchParams.set(key, value.toISOString());
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace('?', '');

    // Only update URL if search params actually changed
    if (newSearch !== currentSearch) {
      const newURL = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;

      if (replace) {
        navigate(newURL, { replace: true });
      } else {
        navigate(newURL);
      }
    }
  }, [state, memoizedInitialState, location.pathname, location.search, navigate, replace]);

  // Debounced URL update
  useEffect(() => {
    const timeoutId = setTimeout(updateURL, debounceMs);
    return () => clearTimeout(timeoutId);
  }, [updateURL, debounceMs]);

  // Update state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlState = parseURLParams();
    setState(urlState);
  }, [parseURLParams]);

  // Update individual state values
  const updateState = useCallback((key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value
    }));
  }, []);

  // Update multiple state values at once
  const updateMultipleState = useCallback((updates) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  // Reset state to initial values
  const resetState = useCallback(() => {
    setState(memoizedInitialState);
  }, [memoizedInitialState]);

  // Clear URL parameters (reset to clean URL)
  const clearURL = useCallback(() => {
    navigate(location.pathname, { replace: true });
    setState(memoizedInitialState);
  }, [navigate, location.pathname, memoizedInitialState]);

  return {
    state,
    updateState,
    updateMultipleState,
    resetState,
    clearURL
  };
};

export default useURLState;
