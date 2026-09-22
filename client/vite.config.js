import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Ensure env variables prefixed with VITE_ are exposed to the client bundle
  // base: '/' ensures asset paths work correctly on Vercel
  base: '/',

  build: {
    // Output directory — Vercel looks for 'dist' by default
    outDir: 'dist',

    // Warn if any single chunk exceeds 1MB
    chunkSizeWarningLimit: 1000,
  },

  server: {
    // Local dev proxy — avoids CORS issues when running frontend on 5173
    // and backend on 5000 during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})