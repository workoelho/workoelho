const config = {
	env: process.env.NODE_ENV || "development",
	port: Number.parseInt(process.env.PORT || "3000", 10),
	databaseUrl: new URL(
		process.env.DATABASE_URL || "sqlite:///database.sqlite",
	),
} as const;

/**
 * Get configuration.
 */
export function getConfig(): typeof config;
export function getConfig<T extends keyof typeof config>(key: T): typeof config[T];
export function getConfig<T extends keyof typeof config>(key?: T) {
	if (key) {
		return config[key as keyof typeof config];
	}
	return config;
}
