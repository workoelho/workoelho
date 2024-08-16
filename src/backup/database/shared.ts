import { init } from "@paralleldrive/cuid2";
import Database from 'better-sqlite3';
import { getConfig } from "~/src/config";
import { print } from "~/src/shared/log";

/**
 * Database ID type.
 */
export type Id = string;

/**
 * A patch of a record type.
 */
export type Patch<T> = Partial<T> & { id: Id };

/**
 * Create a new unique ID using CUID2.
 */
export const createId = init({
	length: 10,
});

const databaseUrl = getConfig("databaseUrl");

if (databaseUrl.protocol !== "sqlite:") {
	throw new Error(`Unsupported database: ${databaseUrl.protocol}`);
}

/**
 * Database instance.
 */
const database = new Database(databaseUrl.pathname, {
	verbose(sql) {
		print("log", `Query executed: ${sql}`);
	}
});

database.pragma('journal_mode = WAL');

/**
 * Execute the SQL query.
 */
export function run(sql: string, ...params: unknown[]) {
	return Promise.resolve(database.prepare(sql).run(params));
}

/**
 * Get a single row from executing the SQL query.
 */
export function get<T>(sql: string, ...params: unknown[]) {
	return Promise.resolve(database.prepare(sql).get(params)) as Promise<T>;
}

/**
 * Get a list of rows from executing the SQL query.
 */
export function all<T extends unknown[]>(sql: string, ...params: unknown[]) {
	return Promise.resolve(database.prepare(sql).all(params)) as Promise<T[]>;
}