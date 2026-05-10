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
          obsidian: "#050609",
          graphite: "#151820",
          navy: "#0d1322",
          ink: "#10121a",
          panel: "#111827",
          night: "#0f1420",
          line: "#2c3242",
          champagne: "#e6cf9a",
          gold: "#e0c27e",
          goldLight: "#f2d999",
          bronze: "#b8874f",
          bronzeLight: "#d4ad78",
          wine: "#3b1720",
          wineLight: "#8f5360",
          nude: "#b78a72",
          olive: "#31351f",
          purple: "#8b5cf6",
          purpleLight: "#b69cff",
          violet: "#8b5cf6",
          teal: "#6bd4c8",
          rose: "#df8caa",
          ivory: "#f7f2e8",
          pearl: "#fbf7ee",
          muted: "#b9c0ce"
        }
      },
      boxShadow: {
        entrelinhas: "0 24px 72px rgba(0, 0, 0, 0.42)",
        bronze: "0 18px 48px rgba(184, 135, 79, 0.14)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
