/**
 * Get application configuration.
 */
export function getConfig() {
  return {
    env: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "3000", 10),
    verbose: !!process.env.DEBUG,
  };
}
