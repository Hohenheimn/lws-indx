const path = require("path");

module.exports = {
  // reactStrictMode: false,
  // publicRuntimeConfig: {
  //   site: {
  //     name: "Index",
  //     url:
  //       process.env.NODE_ENV === "development"
  //         ? "http://localhost:3000"
  //         : "https://index-website.vercel.app",
  //     title: "Index",
  //     description: "Index Description",
  //     socialPreview: "/images/preview.png",
  //   },
  // },
  swcMinify: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  images: {
    domains: [
      "picsum.photos",
      "staging-api.indxhealth.com",
      "dev-api.indxhealth.com",
      "192.168.68.118",
    ],
  },
  env: {
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
    REACT_APP_GA_ID: process.env.REACT_APP_GA_ID,
  },

  // resolve: {
  //   alias: {
  //     "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/icons.js"),
  //     moment: `moment/moment.js`,
  //   },
  // },
};
