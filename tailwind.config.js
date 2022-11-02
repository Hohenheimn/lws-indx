module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-100": "#7ddce0",
        "primary-200": "#68d6db",
        "primary-300": "#52d1d6",
        "primary-400": "#3dcbd1",
        "primary-500": "#27c5cc",
        "primary-600": "#23b1b8",
        "primary-700": "#1f9ea3",
        "primary-800": "#1b8a8f",
        "primary-900": "#17767a",
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tw-elements/dist/plugin"),
  ],
};
