import { defineConfig } from 'vite';

export default defineConfig({
  base: '/npx-prespec/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'terser'
  }
});
