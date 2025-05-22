// tailwind.config.js
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          tertiary: 'var(--color-tertiary)',
          quaternary: 'var(--color-quaternary)',
        },
        fontFamily: {
          sans: ['var(--font-instrument-sans)', 'sans-serif'],
          serif: ['var(--font-instrument-serif)', 'serif'],
        },
      },
    },
    plugins: [],
  };
  
  