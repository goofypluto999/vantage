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
    // Strip the three.js chunk out of Vite's auto-injected
    // `<link rel="modulepreload">` in index.html. Hero3DScene is gated
    // to desktop ≥1024px AND non-reduced-motion, so the 1 MB three chunk
    // is unused on mobile — but the modulepreload tag was still telling
    // mobile browsers to fetch it eagerly, which is what Lighthouse
    // (2026-05-15) flagged as "299 KiB unused JavaScript". Filtering
    // it out means mobile pays $0 for three.js until/unless the user
    // ever lands on a desktop session that actually mounts the scene.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter(d => !d.includes('three-')),
    },
    // Increase warning limit to reduce console noise — three.js chunk
    // legitimately exceeds 500 kB and we have already addressed it via
    // manual splitting + lazy loading.
    chunkSizeWarningLimit: 800,
  },
});