import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  base: '/scrum-poker/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000', // Node.js sunucunuzun adresi
        ws: true, // WebSocket bağlantıları için gereklidir
      },
    }
  }
});