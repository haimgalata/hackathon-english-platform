import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6366F1",
          "primary-hover": "#4F46E5",
          secondary: "#818CF8",
          success: "#22C55E",
          "success-hover": "#16A34A",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        surface: {
          base: "#0F0F1A",
          elevated: "#16162A",
          card: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.10)",
          "border-strong": "rgba(255,255,255,0.18)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.35)",
        "glow-sm": "0 0 10px rgba(99,102,241,0.25)",
        "glow-success": "0 0 16px rgba(34,197,94,0.35)",
        "glow-warning": "0 0 16px rgba(245,158,11,0.30)",
        card: "0 4px 24px rgba(0,0,0,0.40)",
      },
      keyframes: {
        pulse_ring: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        bounce_dots: {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-6px)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        pop_in: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slide_up: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pulse_ring: "pulse_ring 2s ease-in-out infinite",
        bounce_dots: "bounce_dots 1.2s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
        pop_in: "pop_in 0.2s ease-out forwards",
        slide_up: "slide_up 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
