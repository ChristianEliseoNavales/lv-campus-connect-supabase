
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Temporarily disable StrictMode for better HMR compatibility
// Re-enable for production builds
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
