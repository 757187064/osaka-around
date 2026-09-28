import { defineConfig } from 'vite';

const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true
  },
  preview: {
    host: 'localhost',
    port: 5173,
    strictPort: true
  },
  build: {
    chunkSizeWarningLimit: 1200
  }
});
