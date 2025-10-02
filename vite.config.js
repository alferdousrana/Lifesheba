// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 5173,
  },
  // 👇 গুরুত্বপূর্ণ
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
  },
  // 👇 SPA fallback fix
  server: {
    historyApiFallback: true,
  },
});
