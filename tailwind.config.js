/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morandi: {
          clay: '#E2D7D1',
          leaf: '#8E9775',
          water: '#D1D7E2',
          stone: '#7A8B99',
          ink: '#5E5E5E',
        }
      }
    },
  },
  plugins: [],
}