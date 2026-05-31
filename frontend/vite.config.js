import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL || env.VITE_API_URL || 'http://127.0.0.1:8000')
    },
    server: {
      port: 5173,
      strictPort: false
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
