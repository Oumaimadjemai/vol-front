/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#00C0E8',
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
      },
      
    },
  },
  plugins: [],
};
