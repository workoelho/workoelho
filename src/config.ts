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

const config = {
  env,
  port,
  databaseUrl,
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
