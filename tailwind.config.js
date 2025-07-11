/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}" // Thêm đường dẫn src vào
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0062FF", // A vibrant, hopeful blue
          light: "#69A1FF",
          dark: "#003E9E",
        },
        secondary: {
          DEFAULT: "#E6F0FF", // A very light blue for backgrounds or highlights
        },
        accent: {
          DEFAULT: "#FFC107", // A warm yellow for accents and CTAs
        },
        neutral: {
          100: "#FFFFFF",
          200: "#F5F7FA",
          300: "#E6EAF0",
          400: "#D1D8E0",
          500: "#A9B4C2",
          600: "#7C8A9D",
          700: "#526070",
          800: "#2C3642",
          900: "#1A202C",
        },
        success: {
          DEFAULT: "#28A745",
        },
        danger: {
          DEFAULT: "#DC3545",
        },
        warning: {
          DEFAULT: "#FFC107",
        },
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Setting a modern default font
      },
    },
  },
  plugins: [],
};
