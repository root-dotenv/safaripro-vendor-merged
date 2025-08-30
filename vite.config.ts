// - - - vite.config.ts
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- Add this server proxy configuration ---
  server: {
    proxy: {
      // Any request starting with '/sso-api' will be proxied
      "/sso-api": {
        target: "http://sso.safaripro.net/api",
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/sso-api/, ""), // Removes '/sso-api' from the request path
      },
    },
  },
});
