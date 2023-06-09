const config = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
};

/**
 * Return configuration object for the application.
 */
export function getConfig() {
  return config;
}
