import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { PluginAPI } from "tailwindcss/types/config";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "100": "#3A32C0",
          "300": "#2A2490",
          "500": "#1A1660",
          "700": "#0A0830",
          "900": "#050418",
        },
        secondary: {
          "100": "#E9F8FC",
          "300": "#CFEEF9",
          "500": "#B5DFF6",
          "700": "#9BD0F3",
          "900": "#4A90B3",
        },
        accent: {
          "100": "#048AFF",
          "300": "#0371DD",
          "500": "#0258AB",
          "700": "#013F79",
          "900": "#012647",
        },
        neutral: {
          "500": "#F3F4F6",
          "700": "#9CA3AF",
          "900": "#4B5563",
        },
        text: {
          "500": "#0C0066",
          "700": "#040029",
        },
        shade: {
          light: "#F1F0F0",
          dark: "#050418",
        },
        background: {
          "700": "#DBEFFC",
        },
        feedback: {
          success: "#22C55E",
          error: "#EF4444",
          warning: "#F59E0B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".scrollbar-hide": {
          "&::-webkit-scrollbar": {
            display: "none",
          },

          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};

export default config;
