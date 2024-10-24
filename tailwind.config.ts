import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        rawmats: {
          primary: {
            900: "#050418",
            700: "#0A0830",
            500: "#1A1660",
            300: "#2A2490",
            100: "#3A32C0",
          },
          secondary: {
            900: "#4A90B3",
            700: "#9BD0F3",
            500: "#B5DFF6",
            300: "#CFEEF9",
            100: "#E9F8FC",
          },
          accent: {
            900: "#012647",
            700: "#013F79",
            500: "#0258AB",
            300: "#0371DD",
            100: "#048AFF",
          },
          neutral: {
            900: "#4B5563",
            700: "#9CA3AF",
            500: "#F3F4F6",
          },
          text: {
            700: "#040029",
            500: "#0C0066",
          },
          shade: {
            light: "#F1F0F0",
            dark: "#050418",
          },
          background: {
            700: "#DBEFFC",
          },
          feedback: {
            success: "#22C55E",
            error: "#EF4444",
            warning: "#F59E0B",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
