import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f0f0d",
          accent: "#cc1a2c",
          blue: "#168ccd",
          warm: "#f3a40d",
          ink: "#1a1a18",
          muted: "#a0a0a0"
        }
      },
      fontFamily: {
        heading: ["var(--font-russo-one)", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 24px rgba(204, 26, 44, 0.48)"
      }
    }
  },
  plugins: []
};

export default config;
