const config = {
  env: process.env.NODE_ENV || "development",
  databaseUrl: new URL(process.env.DATABASE_URL || "sqlite:///database.sqlite"),
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
