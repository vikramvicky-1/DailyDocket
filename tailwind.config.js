/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        figtree: ["var(--font-figtree)", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        "text-primary": "var(--color-text-primary)",
        accent: "var(--color-accent)",
        hover: "var(--color-hover)",
        green: "var(--color-green)",
        red: "var(--color-red)",
        black: "var(--color-black)",
        "icon-bg": "var(--color-icon-bg)",
        "form-bg": "var(--color-form-bg)",
      },
    },
  },
  plugins: [],
};
