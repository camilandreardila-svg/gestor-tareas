import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El código React vive en /client y se compila a /dist, que sirve Express.
export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
