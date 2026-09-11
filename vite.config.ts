import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL;

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        // Redirect all /api call to backend (:3000)
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },

        // Redirect all /uploads call to backend (:3000)
        "/uploads": {
          target: backendUrl,
          changeOrigin: true,
        },

        // Redirect all /seed-images call to backend (:3000)
        "/seed-images": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },

    test: {
      environment: "jsdom",
      setupFiles: "./src/tests/setup.ts",
      globals: true,
    },
  };
});