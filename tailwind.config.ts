import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#1A56DB",
          50: "#EFF4FF",
          100: "#DBE6FE",
          500: "#2962FF",
          600: "#1A56DB",
          700: "#1B47B0",
        },
        status: {
          completed: { bg: "#DEF7EC", fg: "#03543F" },
          incomplete: { bg: "#FDF6B2", fg: "#723B13" },
          missing: { bg: "#FDE8E8", fg: "#9B1C1C" },
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.02)",
      },
    },
  },
  plugins: [],
} satisfies Config;
