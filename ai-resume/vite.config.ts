import path from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 打包分析（手动开启：open: true）
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // 大依赖拆成独立 chunk → 浏览器并行下载 + 长效缓存
        manualChunks: {
          "vue-vendor": ["vue", "vue-router", "pinia", "pinia-plugin-persistedstate"],
          "antd-vendor": ["ant-design-vue", "@ant-design/icons-vue"],
          "echarts-vendor": ["echarts", "vue-echarts"],
          "lottie-vendor": ["vue3-lottie", "lottie-web"],
          "editor-vendor": ["@wangeditor/editor", "@wangeditor/editor-for-vue"],
          "utils-vendor": [
            "axios",
            "canvas-confetti",
            "dayjs",
            "html2canvas",
            "gsap",
            "dompurify",
            "@vueuse/core",
            "lucide-vue-next",
          ],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
