

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';



export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Pixolo',
      fileName: (format) => `pixolo.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
