import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfbf8",
          100: "#faf6f0",
          200: "#f3ece1",
        },
        ink: {
          700: "#3f3a35",
          800: "#2b2723",
          900: "#1c1917",
        },
        sunset: {
          50: "#fff4ec",
          100: "#ffe4d1",
          200: "#ffc39c",
          300: "#ffa066",
          400: "#fb8140",
          500: "#f2652a",
          600: "#dd4e18",
          700: "#b73c13",
        },
        harbor: {
          50: "#eef5ff",
          100: "#dbe9ff",
          200: "#b3d2ff",
          300: "#82b4ff",
          400: "#5591f7",
          500: "#3672e0",
          600: "#2857bd",
          700: "#204497",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(43, 39, 35, 0.06)",
        card: "0 8px 24px rgba(43, 39, 35, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "sheet-backdrop": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "sheet-pop": {
          from: { opacity: "0", transform: "scale(0.96) translateY(4px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "sheet-backdrop": "sheet-backdrop 0.2s ease-out",
        "sheet-up": "sheet-up 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
        "sheet-pop": "sheet-pop 0.18s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
