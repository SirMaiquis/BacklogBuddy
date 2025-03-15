import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: [
      'lz-string',
      'uuid',
      'jquery',
      'specificity',
      'css-selector-parser',
      'detect-node-es',
      'get-nonce',
      'whatwg-url',
      'tr46',
      'punycode',
      'ws'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        'lz-string',
        'uuid',
        'jquery',
        'specificity',
        'css-selector-parser',
        'detect-node-es',
        'get-nonce',
        'whatwg-url',
        'tr46',
        'punycode',
        'ws'
      ]
    }
  }
}); 