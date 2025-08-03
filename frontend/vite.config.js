import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Fail if port 5173 is not available instead of trying other ports
    host: true // Allow external connections
  },
  preview: {
    port: 4173,
    strictPort: true
  }
})
