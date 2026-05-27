import path from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
// import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
