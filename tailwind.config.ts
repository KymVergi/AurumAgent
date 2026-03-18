import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        aurum: {
          gold: "#D4A843",
          "gold-light": "#F0C866",
          "gold-dim": "#8A6A20",
          amber: "#C97B2E",
          purple: "#7B5EA7",
          "purple-light": "#A07DD4",
          "purple-dim": "#3D2F58",
          blue: "#3B6EA5",
          "blue-light": "#5A8FC4",
          "blue-dim": "#1D3C5E",
          bg: "#080810",
          "bg-card": "#0D0D1A",
          "bg-elevated": "#12121F",
          "bg-border": "#1E1E35",
          "text-primary": "#E8E8F0",
          "text-secondary": "#8888AA",
          "text-dim": "#555570",
          "glow-gold": "rgba(212, 168, 67, 0.15)",
          "glow-purple": "rgba(123, 94, 167, 0.15)",
          "glow-blue": "rgba(59, 110, 165, 0.15)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "aurum-hero": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(123,94,167,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(212,168,67,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 20% 60%, rgba(59,110,165,0.15) 0%, transparent 60%)",
        "card-glow": "linear-gradient(135deg, rgba(212,168,67,0.05) 0%, rgba(123,94,167,0.05) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(212,168,67,0.2), 0 0 60px rgba(212,168,67,0.05)",
        "purple-glow": "0 0 30px rgba(123,94,167,0.2), 0 0 60px rgba(123,94,167,0.05)",
        "card": "0 1px 1px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
        "card-hover": "0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
