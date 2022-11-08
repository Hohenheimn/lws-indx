const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "425px",
        // => @media (min-width: 992px) { ... }
      },
      colors: {
        primary: {
          100: "#7ddce0",
          200: "#68d6db",
          300: "#52d1d6",
          400: "#3dcbd1",
          500: "#27c5cc",
          600: "#23b1b8",
          700: "#1f9ea3",
          800: "#1b8a8f",
          900: "#17767a",
        },
        default: {
          page: "#F7F8FF",
          text: "#333333",
        },
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tw-elements/dist/plugin"),
  ],
  // important: true,
};
