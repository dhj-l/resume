import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff", // Main Brand Color
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
          950: "#001140",
        },
        success: "#52c41a",
        ai: "#722ed1",
        neutral: {
          50: "#f5f5f7",
          100: "#f0f0f0",
          200: "#d9d9d9",
          300: "#bfbfbf",
          400: "#8c8c8c",
          500: "#595959",
          600: "#434343", // Main Text
          700: "#262626",
          800: "#1f1f1f",
          900: "#141414",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
