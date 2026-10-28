import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF6EE', 50: '#FEFBF6', 100: '#F8F0E3', 200: '#F1E4D0', 300: '#E7D3B8' },
        rose: { DEFAULT: '#C4888A', 50: '#FBF1F1', 100: '#F5E1E1', 200: '#EBC8C8', 400: '#D3A0A1', 500: '#C4888A', 600: '#AD7274', 700: '#8F5A5C' },
        // Colores de la marca (tomados del logo)
        olivia: { green: '#C4D49C', beige: '#CCBC94' },
        cocoa: { DEFAULT: '#4A3333', 700: '#5E4343', 600: '#775A5A', 500: '#8E7272', 400: '#A89090' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 40px -12px rgba(110, 70, 70, 0.25)' },
    },
  },
  plugins: [],
};
export default config;
