import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: 'game.html',
    },
  },
  server: {
    open: true,
    // Project lives on a network/SMB share where native fs.watch fails
    // with "UNKNOWN: watch". Polling is required for the dev server to run.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
