import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        entrelinhas: {
          void: "#050A12",
          obsidian: "#040812",
          graphite: "#071525",
          navy: "#071525",
          ink: "#071525",
          panel: "#08182A",
          night: "#0B2742",
          line: "rgba(214,168,92,0.22)",
          champagne: "#D6A85C",
          gold: "#D6A85C",
          goldLight: "#F0D49A",
          bronze: "#B98745",
          bronzeLight: "#D6A85C",
          wine: "#0B2742",
          wineLight: "#123A5D",
          nude: "#b78a72",
          olive: "#31351f",
          purple: "#123A5D",
          purpleLight: "#2F7EA8",
          violet: "#123A5D",
          teal: "#2F7EA8",
          rose: "#123A5D",
          ivory: "#F7F2EA",
          pearl: "#FFF8EC",
          muted: "#A9B6C5",
          blue: "#123A5D",
          blueLight: "#2F7EA8"
        }
      },
      boxShadow: {
        entrelinhas: "0 28px 84px rgba(0, 0, 0, 0.46)",
        bronze: "0 18px 46px rgba(214, 168, 92, 0.10)",
        brand: "0 18px 52px rgba(4, 8, 18, 0.45), 0 0 0 1px rgba(214, 168, 92, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
