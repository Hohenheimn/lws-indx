const path = require("path");
module.exports = {
  publicRuntimeConfig: {
    site: {
      name: "Index",
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://index-cms.vercel.app",
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
  plugins: [
    // load `moment/locale/ja.js` and `moment/locale/it.js`
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
  ],
  resolve: {
    alias: {
      "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/icons.js"),
      moment: `moment/moment.js`,
    },
  },
};
