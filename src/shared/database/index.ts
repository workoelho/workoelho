import type { SQLQueryBindings } from "bun:sqlite";
import { Database } from "bun:sqlite";
import type { z } from "zod";
import { getConfig } from "~/src/shared/config";
import type { Id } from "~/src/shared/schema";

export type { SQLQueryBindings as Bindings } from "bun:sqlite";

/**
 * Session type.
 */
export type Session = {
  userId: z.infer<typeof Id>;
};

/**
 * Context for database operations.
 */
export type Context<T = never> = T extends Record<string, unknown>
  ? { session?: Session; options?: Record<string, unknown>; payload: T }
  : { session?: Session; options?: Record<string, unknown> };

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
      `Unsupported database protocol ${JSON.stringify(url.protocol)}`,
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
export function getInsertValues<T extends Record<string, unknown>>(data: T) {
  return `(${Object.keys(data).join(", ")}) values (${Object.keys(data)
    .map((key) => `$${key}`)
    .join(", ")})`;
}

/**
 * Get SQL for update values.
 */
export function getUpdateValues<T extends Record<string, unknown>>(data: T) {
  return Object.keys(data)
    .map((key) => `${key} = $${key}`)
    .join(", ");
}

/**
 * Bun's SQLite require prefixed bindings, i.e. { $value: ... } instead of { value: ... }.
 */
export function getPrefixedBindings<
  T extends Record<string, string | bigint | number | boolean | null>,
>(data: T) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [`$${key}`, value]),
  ) as SQLQueryBindings;
}
