const path = require("path");

module.exports = {
  publicRuntimeConfig: {
    site: {
      name: "Index",
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://index-website.vercel.app",
      title: "Index",
      description: "Index Description",
      socialPreview: "/images/preview.png",
    },
  },
  swcMinify: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  images: {
    domains: ["picsum.photos"],
  },
  // resolve: {
  //   alias: {
  //     "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/icons.js"),
  //     moment: `moment/moment.js`,
  //   },
  // },
};
