import type { SQLQueryBindings } from "bun:sqlite";
import { Database } from "bun:sqlite";
import { getConfig } from "~/src/shared/config";

/**
 * Id type.
 */
export type Id = number;

/**
 * Session type.
 */
export type Session = {
  userId: Id;
};

/**
 * Context for database operations.
 */
export type Context<
  T extends Record<string, unknown> = Record<string, unknown>
> = T extends undefined
  ? { session?: Session; options?: Record<string, unknown> }
  : { session?: Session; options?: Record<string, unknown>; payload: T };

/**
 * Database instance.
 */
let instance: Database;

/**
 * Open database.
 */
export function open(url: URL) {
  if (url.protocol !== "sqlite:") {
    throw new Error(
      `Unsupported database protocol ${JSON.stringify(url.protocol)}`
    );
  }

  if (instance) {
    instance.close();
  }

  instance = new Database(url.pathname.slice(1));

  // Enabling write-ahead logging improves concurrent writes performance.
  instance.exec("PRAGMA journal_mode = WAL;");
}

/**
 * Get database instance.
 */
export function database() {
  if (!instance) {
    open(getConfig("databaseUrl"));
  }
  return instance;
}

/**
 * Get SQL for insert values.
 */
export function getInsertValues<T extends Record<string, unknown>>(payload: T) {
  return `(${Object.keys(payload).join(", ")}) values (${Object.keys(payload)
    .map((key) => `$${key}`)
    .join(", ")})`;
}

/**
 * Get SQL for update values.
 */
export function getUpdateValues<T extends Record<string, unknown>>(payload: T) {
  return Object.keys(payload)
    .map((key) => `${key} = $${key}`)
    .join(", ");
}

/**
 * Bun's SQLite require prefixed bindings, i.e. { $value: ... }.
 */
export function getPrefixedBindings<T extends SQLQueryBindings[]>(
  ...values: T
) {
  return values.map((value) => {
    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [`$${key}`, value])
      ) as SQLQueryBindings;
    }

    return value;
  });
}
