import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/GB/',
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    allowedHosts: ['.manus.computer', 'localhost'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
