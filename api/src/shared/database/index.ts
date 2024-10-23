import * as sqlite from "bun:sqlite";
import { print } from "~/src/shared/log";
import { compact, truncate } from "~/src/shared/string";

/**
 * Type of database binding value.
 */
export type Binding = string | number | bigint | boolean | null;

/**
 * Database wrap.
 */
export class Database {
  /** Actual database instance. */
  instance: sqlite.Database | null = null;

  /** If it should log queries. */
  log = true;

  /**
   * Open a database connection.
   */
  static async open(url: URL) {
    const database = new Database();
    await database.open(url);
    return database;
  }

  /**
   * Open a database connection.
   */
  async open(url: URL) {
    if (url.protocol !== "sqlite:") {
      throw new Error(
        `Unsupported database protocol ${JSON.stringify(url.protocol)}`,
      );
    }

    this.instance = new sqlite.Database(url.pathname.slice(1), {
      strict: true,
    });

    // Enabling SQLite's write-ahead improves performance of concurrent writes.
    this.instance.exec("PRAGMA journal_mode = WAL;");
  }

  /**
   * Close the database connection.
   */
  async close() {
    this.instance?.close(true);
    this.instance = null;
    return Promise.resolve();
  }

  /**
   * Support for `using`.
   */
  async [Symbol.asyncDispose]() {
    await this.close();
  }

  /**
   * Prepare statement and execute it synchronously.
   */
  execute<T>(operation: "run", sql: string, ...bindings: Binding[]): void;
  execute<T>(operation: "get", sql: string, ...bindings: Binding[]): T | null;
  execute<T>(operation: "all", sql: string, ...bindings: Binding[]): T[];
  execute<T>(
    operation: "run" | "all" | "get",
    sql: string,
    ...bindings: Binding[]
  ) {
    if (!this.instance) {
      throw new Error(
        `Can't execute a query "${truncate(compact(sql), 20)}" with the database closed`,
      );
    }

    performance.mark("query");

    const result = this.instance
      .query<T, Binding[]>(sql)
      [operation](...bindings);

    if (this.log) {
      const { duration } = performance.measure("query", "query");
      print(
        "log",
        "database.run",
        compact(sql),
        bindings,
        `${duration.toFixed(2)}ms`,
      );
    }

    return result;
  }

  /**
   * Execute prepared and cached statement with no returning value.
   */
  async run(sql: string, ...bindings: Binding[]) {
    return this.execute<void>("run", sql, ...bindings);
  }

  /**
   * Execute prepared and cached statement and return at most a single record.
   */
  async get<T>(sql: string, ...bindings: Binding[]) {
    return this.execute<T>("get", sql, ...bindings) as T | undefined;
  }

  /**
   * Execute prepared and cached statement and return all records.
   */
  async all<T>(sql: string, ...bindings: Binding[]) {
    return this.execute<T[]>("all", sql, ...bindings) as T[];
  }

  /**
   * Begin a transaction, execute the function, and rollback if it throws.
   */
  async transaction(fn: () => Promise<void>) {
    try {
      await this.run("BEGIN;");
      await fn();
      await this.run("COMMIT;");
    } catch (err) {
      await this.run("ROLLBACK;");
      throw err;
    }
  }
}
