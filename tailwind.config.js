/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#dbeefe',
          200: '#b7dcfd',
          300: '#89c1fa',
          400: '#5da2f5',
          500: '#3b82f6',
          600: '#2565db',
          700: '#1d4eb4',
          800: '#1d3d8b',
          900: '#1b356f',
        },
        accent: '#00ffcc',
      },
    },
  },
  plugins: [],
};
