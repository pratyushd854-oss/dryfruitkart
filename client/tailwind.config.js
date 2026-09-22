/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rcb: {
          red: '#D0142C',
          deepRed: '#8C0E1F',
          black: '#0B0B0C',
          dark: '#141416',
          gold: '#D4AF37',
          lightGold: '#F1D77C',
          paper: '#FBF8F1',
          goldMuted: '#B8972E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        red: '0 4px 20px -2px rgba(208, 20, 44, 0.3)',
      },
    },
  },
  plugins: [],
};
