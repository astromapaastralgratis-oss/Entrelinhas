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
        entrelinhas: {
          void: "#070a12",
          navy: "#0d1322",
          ink: "#10121a",
          panel: "#111827",
          night: "#0f1420",
          line: "#2c3242",
          gold: "#e0c27e",
          goldLight: "#f2d999",
          purple: "#8b5cf6",
          purpleLight: "#b69cff",
          violet: "#8b5cf6",
          teal: "#6bd4c8",
          rose: "#df8caa",
          ivory: "#f7f2e8",
          muted: "#b9c0ce"
        }
      },
      boxShadow: {
        entrelinhas: "0 24px 80px rgba(0, 0, 0, 0.38)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
