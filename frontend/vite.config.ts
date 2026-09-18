import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['app.ccode.academy', 'www.app.ccode.academy'],
    port: 8001,
    proxy: {
      '/seb': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})

