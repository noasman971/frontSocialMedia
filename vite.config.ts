import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirect all /api call to backend (:3000)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // change header to match with backend adress (not sure if it's really necessary)
        rewrite: (path) => path.replace(/^\/api/, ''), // plutôt cool cette technique
      },
      // Redirect all /uploads call to backend (:3000)
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Redirect all /seed-images call to backend (:3000)
      '/seed-images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

