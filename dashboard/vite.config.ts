import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['petterssonhome.se', 'api.petterssonhome.se'],

    hmr: {
      protocol: "wss",
      host: "petterssonhome.se",
      clientPort: 443
    }
  }
})
