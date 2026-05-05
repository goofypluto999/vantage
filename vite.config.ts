import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Code-split heavy dependencies into separate chunks so the initial
        // bundle stays small. Three.js + react-three deps load only when
        // Hero3DScene mounts; gsap loads only when an animation needs it.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap': ['gsap'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'motion': ['motion'],
          'helmet': ['react-helmet-async'],
        },
      },
    },
    // Increase warning limit to reduce console noise — three.js chunk
    // legitimately exceeds 500 kB and we have already addressed it via
    // manual splitting + lazy loading.
    chunkSizeWarningLimit: 800,
  },
});