import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        astral: {
          void: "#07070b",
          night: "#11111a",
          panel: "#171723",
          line: "#2b2638",
          gold: "#d9b66d",
          violet: "#8f6ee8",
          teal: "#6bd4c8",
          rose: "#df8caa"
        }
      },
      boxShadow: {
        astral: "0 24px 80px rgba(0, 0, 0, 0.38)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
