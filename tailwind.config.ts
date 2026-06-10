import type { Config } from "tailwindcss";

/**
 * ZONURA Design Tokens (Sleek Amazon Blueprint)
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "zonura-navy": "#0E1E2E",
        "zonura-gold": "#D4AF37",
        "zonura-sand": "#F9F8F6",
      },
      borderRadius: {
        "premium": "14px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
