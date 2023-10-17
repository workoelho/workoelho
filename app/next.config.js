/** @type {import("next").NextConfig} */
module.exports = {
  webpack(config) {
    config.watchOptions = {
      poll: 500,
      aggregateTimeout: 50,
    };
    return config;
  },
  experimental: {
    serverActions: true,
  },
};
