import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 9092,
    https: true,
    cors: true,
    strictPort: true,
    origin: 'https://tv.petterssonhome.se',
    hmr: {
      host: 'tv.petterssonhome.se',
      protocol: 'wss',
      clientPort: 443
    }
  }
});
