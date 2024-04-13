import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve('./src'),
    },
  },
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
});
