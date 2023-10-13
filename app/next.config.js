/** @type {import("next").NextConfig} */
module.exports = {
  webpack(config) {
    config.watchOptions = {
      poll: 500,
      aggregateTimeout: 100,
    };
    return config;
  },
};
