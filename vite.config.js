import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/goit-advancedjs-hw-04/',
  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
});