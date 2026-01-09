import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: false, // nginx handles SSL
    cors: true,
    strictPort: true,
    origin: 'https://petterssonhome.se',
    allowedHosts: ['petterssonhome.se', 'localhost', '127.0.0.1', 'nginx'],
    hmr: {
      host: 'petterssonhome.se',
      protocol: 'wss',
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  },
  preview: {
    allowedHosts: ['petterssonhome.se']
  }
});
