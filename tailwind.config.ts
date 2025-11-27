// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      // Shell / bakgrunn
      shellBg: "#020617", // mørk slate-950
      shellText: "#E5E7EB", // lys tekst
      shellTextMuted: "#9CA3AF", // mer dempet tekst
      shellBorder: "#1F2937", // slate-800-ish

      // Kort / paneler
      cardBg: "#020617", // mørk bakgrunn for cards
      cardElevatedBg: "#020617", // kan bruke samme nå, juster senere om du vil ha mer “pop”

      // Brand
      primary: "#38BDF8", // sky-400
      primarySoft: "#0F172A", // kan bruke bg-primary/10 sammen med denne
      accent: "#F97316", // oransje
      accentSoft: "#1C1917", // mørk brun-oransje bakgrunn
      danger: "#FB7185", // rose-400
    },
  },
},
  plugins: [],
};

export default config;
