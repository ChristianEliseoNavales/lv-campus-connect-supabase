import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Enable Fast Refresh (default is true, but being explicit)
    fastRefresh: true,
  })],
  server: {
    port: 5173,
    strictPort: true, // Fail if port 5173 is not available instead of trying other ports
    host: true, // Allow external connections
    hmr: {
      overlay: true, // Show HMR errors in overlay
      port: 24678, // Use a different port for HMR WebSocket
    }
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  // Optimize dependencies for better HMR
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
