import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; 

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: 'localhost',
    port: 3001,
    strictPort: true,
    open: true
  },
  build: {
    assetsInlineLimit: 4096,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  optimizeDeps: {
    include: ['boxicons']
  },
  resolve: {
    alias: {
<<<<<<< HEAD
      '@': path.resolve(__dirname, 'src') // 
=======
      '@': path.resolve(__dirname, 'src') 
>>>>>>> 1f0ce653374a1b8a6b7207a0f192fa26f3db4ff1
    }
  }
});
