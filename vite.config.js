import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${path.resolve(__dirname, 'src/styles/extras/dependencies').replace(/\\/g, '/')}";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.taiga.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
