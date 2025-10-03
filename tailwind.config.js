/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['var(--font-figtree)', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        accent: 'var(--color-accent)',
        hover: 'var(--color-hover)',
        green: 'var(--color-green)',
        red: 'var(--color-red)',
        black: 'var(--color-black)',
        'icon-bg': 'var(--color-icon-bg)',
      },
    },
  },
  plugins: [],
};
