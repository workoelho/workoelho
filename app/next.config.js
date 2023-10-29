/** @type {import("next").NextConfig} */
module.exports = {
  webpack(config) {
    config.watchOptions = {
      poll: 100,
      aggregateTimeout: 50,
    };
    return config;
  },
};
