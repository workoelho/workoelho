/**
 * Environment preset.
 */
const env = process.env.NODE_ENV || "development";

/**
 * Port to listen on.
 */
const port = parseInt(process.env.PORT || "3000", 10);

/**
 * Database URL.
 */
const databaseUrl = process.env.DATABASE_URL;

/**
 * Log level: verbose, info, warn, or error.
 */
const logLevel = process.env.LOG_LEVEL || "info";

const config = {
  env,
  port,
  databaseUrl,
  logLevel,
} as const;

/**
 * Get application configuration.
 */
export function getConfig(): typeof config;
export function getConfig<T extends keyof typeof config>(
  key: T
): (typeof config)[T];
export function getConfig<T extends keyof typeof config>(key?: T) {
  return key ? config[key] : config;
}
