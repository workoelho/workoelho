import * as Bun from "bun";
import { DateTime } from "luxon";
import { ulid } from "ulid";
import { z } from "zod";
import type { Database } from "~/src/shared/database";
import { schemas } from "~/src/shared/schemas";
import { sql } from "~/src/shared/sql";

/**
 * User schema.
 */
export const schema = z.object({
  id: schemas.id,
  createdAt: schemas.datetime,
  updatedAt: schemas.datetime,
  name: schemas.name,
  email: schemas.email,
  password: schemas.password,
});

/**
 * User schema type.
 */
export type User = typeof schema;

/**
 * Run migrations.
 */
export async function migrate(database: Database) {
  await database.run(
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `,
  );
}

export async function authenticate(
  database: Database,
  input: { email: string; password: string },
) {
  const data = schema.pick({ email: true, password: true }).parse(input);

  const user = await database.get<z.infer<User>>(
    ...new sql.Query(
      "SELECT * FROM users",
      ["WHERE email = ?", data.email],
      "LIMIT 1;",
    ).toSQL(),
  );

  if (!user) {
    return undefined;
  }

  if (await Bun.password.verify(data.password, user.password)) {
    return user;
  }
}

/**
 * Create a new user.
 */
export async function create(
  database: Database,
  input: Pick<z.input<User>, "name" | "email" | "password">,
) {
  const now = DateTime.utc();

  const data = schema.parse({
    id: ulid(),
    createdAt: now.toISO(),
    updatedAt: now.toISO(),
    name: input.name,
    email: input.email,
    password: await Bun.password.hash(input.password),
  });

  const entry = new sql.Entry(data);

  const user = await database.get<z.infer<User>>(
    ...new sql.Query("INSERT INTO users", entry, "RETURNING *;").toSQL(),
  );

  return schema.parse(user);
}
