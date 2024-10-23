/**
 * Global config. object.
 */
const config = {
  env: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "5678"),
  databaseUrl: new URL(
    process.env.DATABASE_URL || "sqlite:///storage/database.sqlite",
  ),
};

/**
 * Read configuration.
 */
export function getConfig(): typeof config;
export function getConfig<T extends keyof typeof config>(
  key?: T,
): (typeof config)[T];
export function getConfig<T extends keyof typeof config>(key?: T) {
  return key ? config[key] : config;
}

/**
 * Set configuration.
 */
export function setConfig<T extends keyof typeof config>(
  key: T,
  value: (typeof config)[T],
) {
  config[key] = value;
}
