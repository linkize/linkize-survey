/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'linkize-blue': '#0077B6',
        'linkize-green': '#00E3A3',
      },
    },
  },
  plugins: [],
}
