import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#070912",
        card: "#0b1022",
        border: "#1b2343",
        primary: "#7c78ff",
        accent: "#2ecbff",
        muted: "#94a3b8"
      },
      boxShadow: {
        glow: "0 0 50px rgba(124,120,255,0.35)"
      }
    },
  },
  plugins: [],
};

export default config;
