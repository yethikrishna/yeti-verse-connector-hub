
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
    cors: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Handle the specific import path that SWR uses
      "use-sync-external-store/shim/index.js": path.resolve(__dirname, "src/lib/use-sync-external-store-shim.js"),
      // Also handle the general shim import for other packages
      "use-sync-external-store/shim": path.resolve(__dirname, "src/lib/use-sync-external-store-shim.js"),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT') return;
        warn(warning);
      }
    },
    sourcemap: true,
  },
  logLevel: 'info',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
    exclude: ['@clerk/clerk-react'],
    force: true,
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'es2020'
  }
});
