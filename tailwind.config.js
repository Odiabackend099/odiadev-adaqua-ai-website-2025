/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0C1C3A',
        gold: '#C8A862',
        cloud: '#E9EEF5',
        stone: '#93A4BE',
        ink: '#0C1C3A',
        navySoft: '#1a2a4a',
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
