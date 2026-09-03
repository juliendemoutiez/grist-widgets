import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL ?? '/',
  resolve: {
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'src/lib'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:  path.resolve(import.meta.dirname, 'index.html'),
        notes: path.resolve(import.meta.dirname, 'pages/notes.html'),
        todo: path.resolve(import.meta.dirname, 'pages/todo.html'),
      },
    },
  },
});
