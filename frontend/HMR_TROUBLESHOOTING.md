# Hot Module Replacement (HMR) Troubleshooting Guide

## Changes Made to Fix HMR Issues

### 1. Updated Vite Configuration (`vite.config.js`)
- Enabled explicit Fast Refresh in React plugin
- Added HMR overlay for better error visibility
- Set dedicated HMR WebSocket port (24678)
- Added dependency optimization for React packages

### 2. Updated React Setup (`main.jsx`)
- Temporarily disabled React.StrictMode (can interfere with HMR)
- Added comment for re-enabling in production

### 3. Enhanced ESLint Configuration (`eslint.config.js`)
- Updated react-refresh rule with additional export allowances
- Better compatibility with HMR patterns

### 4. Added HMR Compatibility to Components
- Added `import.meta.hot.accept()` to key components
- Created HMRTest component for testing

## Testing HMR

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Or use the batch file: `start-dev-hmr.bat`

2. **Open browser to:** http://localhost:5173

3. **Test HMR by:**
   - Modifying the HMRTest component text
   - Changing colors in KioskLayout component
   - Adding/removing elements
   - State should persist during updates

## Common HMR Issues and Solutions

### Issue: Browser doesn't update after file changes
**Solutions:**
- Check browser console for WebSocket connection errors
- Ensure port 24678 is not blocked by firewall
- Try hard refresh (Ctrl+F5) once, then test again

### Issue: Full page reload instead of hot update
**Causes:**
- Syntax errors in components
- Export/import issues
- React component not following HMR patterns

### Issue: State is lost during updates
**Solutions:**
- Ensure components are properly exported as default
- Check for console errors
- Verify component follows React Fast Refresh rules

## Verification Steps

1. **Check HMR WebSocket Connection:**
   - Open browser DevTools → Network → WS tab
   - Should see WebSocket connection to localhost:24678

2. **Test with HMRTest Component:**
   - Click the counter button to increment state
   - Modify the component text and save
   - Counter state should persist, text should update

3. **Check Console Messages:**
   - Should see "[vite] hot updated" messages
   - No error messages about HMR failures

## Reverting Changes (if needed)

If HMR still doesn't work and you need to revert:

1. **Re-enable StrictMode in main.jsx:**
   ```jsx
   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

2. **Simplify vite.config.js:**
   ```js
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       strictPort: true,
       host: true
     }
   });
   ```

## Additional Notes

- HMR works best with functional components using hooks
- Class components may require full page reload
- Large state changes might trigger full reload
- File watching works better on local drives vs network drives
