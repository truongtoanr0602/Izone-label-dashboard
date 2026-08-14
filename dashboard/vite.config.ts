import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this app from a /Izone-label-dashboard/ subpath, but the
  // Docker/nginx deployment serves it from the domain root — using the Pages
  // base there makes nginx's SPA fallback return index.html for every asset
  // request instead of the real JS/CSS file.
  base: mode === 'docker' ? '/' : '/Izone-label-dashboard/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}))
