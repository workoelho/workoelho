import z from "zod";
import type { Bindings, Context } from "~/src/shared/database";
import {
  database,
  getInsertValues,
  getPrefixedBindings,
} from "~/src/shared/database";
import { Id, Name } from "~/src/shared/schema";

export const Organization = z.object({
  id: Id,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  name: Name,
});

export type Organization = z.infer<typeof Organization>;

export function migrate() {
  database()
    .query(
      `
        CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          name TEXT NOT NULL
        );
      `,
    )
    .run();
}

export async function create(context: Context<Pick<Organization, "name">>) {
  const createdAt = new Date().toISOString();

  const data = Organization.omit({ id: true }).parse({
    ...context.payload,
    createdAt,
    updatedAt: createdAt,
  });

  const organization = database()
    .query<Organization, Bindings>(
      `INSERT INTO organizations ${getInsertValues(data)} RETURNING *;`,
    )
    .get(getPrefixedBindings(data));

  if (!organization) {
    throw new Error("Query failed");
  }

  return organization;
}
