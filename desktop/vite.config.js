const { defineConfig, loadEnv } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: path.join(__dirname, 'src', 'renderer'),
    base: './',
    plugins: [react()],
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL || env.VITE_API_URL || 'http://127.0.0.1:8000')
    },
    server: {
      port: 5174,
      strictPort: true
    },
    build: {
      outDir: path.join(__dirname, 'dist', 'renderer'),
      emptyOutDir: true
    }
  };
});
