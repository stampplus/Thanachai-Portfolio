import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    // Base path for GitHub Pages subdirectory deployment
    // Format: /repository-name/
    base: '/Thanachai-Portfolio/',

    build: {
        // Output directory for production build
        outDir: 'dist',

        // Generate sourcemaps for debugging (optional)
        sourcemap: false,

        // Minify output
        minify: 'esbuild',

        // Asset handling
        assetsDir: 'assets',

        // Rollup options
        rollupOptions: {
            output: {
                // Manual chunk splitting for better caching
                manualChunks: undefined,
            }
        }
    },

    // Server configuration for local development
    server: {
        port: 5173,
        open: true
    }
})
