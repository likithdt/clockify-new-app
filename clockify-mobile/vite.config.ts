import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createViteApiMiddleware } from "./src/backend/apiMiddleware.ts";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "clockify-mobile-backend-api",
      configureServer(server) {
        server.middlewares.use(createViteApiMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(createViteApiMiddleware());
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
