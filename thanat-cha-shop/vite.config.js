import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  // Base path for deployment (adjust for your domain)
  base: '/',

  // Development server
  server: {
    port: 5173,
    open: true,
    host: true, // Allow access from network (for mobile testing)
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          vendor: [],
        },
        // Asset naming for cache busting
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'images/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return 'css/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        autoprefixer,
      ],
    },
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    open: true,
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@lib': '/src/lib',
      '@styles': '/src/styles',
    },
  },
});
