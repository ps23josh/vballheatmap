import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    },
    host: true,
    port: 5173
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  clearScreen: false
})
