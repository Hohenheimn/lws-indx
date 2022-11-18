const colors = require("./styles/theme.js");

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
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },

      colors: {
        ...colors,
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
