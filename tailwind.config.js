const colors = require("./styles/theme.js");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./utils/helpers.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
        xs: "425px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      boxShadow: {
        DEFAULT: `0 .1rem .2rem 0 ${colors.gray[300]}`,
        input: `0 0 .2rem 0 ${colors.primary.DEFAULT}`,
      },
      colors: {
        ...colors,
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
