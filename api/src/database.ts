import { api } from "~/src/api";
import type { Database } from "~/src/shared/database";

/**
 * Run all migrations.
 */
export async function migrate(database: Database) {
  for await (const module of Object.values(api)) {
    if (
      typeof module === "object" &&
      module !== null &&
      "migrate" in module &&
      typeof module.migrate === "function"
    ) {
      await module.migrate(database);
    }
  }
}

/**
 * Seed the database.
 */
export async function seed(database: Database) {
  for await (const module of Object.values(api)) {
    if (
      typeof module === "object" &&
      module !== null &&
      "seed" in module &&
      typeof module.seed === "function"
    ) {
      await module.seed(database);
    }
  }
}
