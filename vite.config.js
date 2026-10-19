import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/index.html', // Take index.html from src
          dest: '.'              // Put it in the root of dist
        }
      ]
    })
  ]
});