import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/responsive-mesh-studio/',
  server: { port: 5174, open: true },
});
