import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#3b474f",
          alt: "#46545d",
          deep: "#27323a",
        },
        paper: "#f2f4ef",
        muted: "#b7c0c3",
        signal: {
          DEFAULT: "#e9ad12",
          light: "#ffd76a",
          dark: "#a97100",
        },
        rust: {
          DEFAULT: "#8f5944",
          light: "#c48b70",
        },
        concrete: {
          DEFAULT: "#d3d9d5",
          pale: "#e3e6df",
          line: "#aeb8b6",
        },
        steel: {
          DEFAULT: "#7d909b",
          dark: "#596a73",
        },
        glass: {
          DEFAULT: "#a9bcc4",
          cold: "#c3d0d2",
        },
      },
      boxShadow: {
        "tt-panel": "inset 0 1px 0 rgba(242,244,239,0.08), 0 14px 34px rgba(39,50,58,0.18)",
        "tt-card": "inset 0 1px 0 rgba(242,244,239,0.06), 0 10px 24px rgba(39,50,58,0.14)",
        "tt-map": "inset 0 0 0 1px rgba(211,217,213,0.18), 0 18px 42px rgba(39,50,58,0.2)",
        "tt-signal": "0 0 0 1px rgba(233,173,18,0.28), 0 10px 24px rgba(233,173,18,0.1)",
      },
      backgroundImage: {
        "tt-concrete-field":
          "linear-gradient(180deg, rgba(211,217,213,0.20), rgba(211,217,213,0.04) 28%, transparent 58%), radial-gradient(circle at top left, rgba(169,188,196,0.22), transparent 24%), radial-gradient(circle at 84% 14%, rgba(125,144,155,0.24), transparent 30%)",
        "tt-glass-panel": "linear-gradient(135deg, rgba(211,217,213,0.12), rgba(169,188,196,0.04))",
        "tt-hero": "linear-gradient(135deg, rgba(211,217,213,0.14), rgba(169,188,196,0.06)), linear-gradient(180deg, rgba(233,173,18,0.04), transparent 38%)",
        "tt-alert-line": "linear-gradient(90deg, #e9ad12, #a9bcc4)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        display: ["var(--font-oswald)", "Impact", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
