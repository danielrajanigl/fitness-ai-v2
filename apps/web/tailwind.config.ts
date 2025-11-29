import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors - Clean White Theme
        primary: {
          DEFAULT: "#4B75FF",
          light: "#9DB7FF",
        },
        background: "#FFFFFF",
        surface: "#FFFFFF",
        "surface-alt": "#F9FAFB",
        text: {
          main: "#1F2937",
          muted: "#6B7280",
          light: "#9CA3AF",
        },
        stroke: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
        accent: {
          success: "#10B981",
          warm: "#F59E0B",
        },
        // Legacy Next.js vars
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro", "Segoe UI", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "10px",
        lg: "12px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.03)",
        md: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;

