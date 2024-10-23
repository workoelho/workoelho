import { DateTime } from "luxon";
import { ulid } from "ulid";
import { z } from "zod";
import { api } from "~/src/api";
import type { Database } from "~/src/shared/database";
import { must } from "~/src/shared/must";
import { schemas } from "~/src/shared/schemas";
import { Criteria, sql } from "~/src/shared/sql";

/**
 * Default session duration, in luxon's notation.
 */
const defaultSessionDuration = { day: 1 };

/**
 * Session schema.
 */
export const schema = z.object({
  id: schemas.id,
  createdAt: schemas.datetime,
  expiresAt: schemas.datetime,
  userId: schemas.id,
  token: z.string().ulid(),
});

/**
 * Session shape type.
 */
export type Session = typeof schema;

/**
 * Run migrations.
 */
export async function migrate(database: Database) {
  await api.users.migrate(database);

  await database.run(
    `
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        createdAt TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
      );
    `,
  );
}

/**
 * Create a new session.
 */
export async function create(
  database: Database,
  input: Pick<z.input<Session>, "userId">,
) {
  const now = DateTime.utc();

  const data = {
    id: ulid(),
    createdAt: now.toISO(),
    expiresAt: now.plus(defaultSessionDuration).toISO(),
    userId: input.userId,
    token: ulid(),
  };

  const entry = new sql.Entry(schema.parse(data));

  const session = await database.get<z.infer<Session>>(
    ...new sql.Query("INSERT INTO sessions", entry, "RETURNING *;").toSQL(),
  );

  return schema.parse(session);
}

/**
 * Invalidate a session by ID.
 */
export async function invalidate(
  database: Database,
  data: { id: z.infer<typeof schemas.id> },
) {
  const patch = new sql.Patch({
    expiresAt: DateTime.utc().toISO(),
  });

  const criteria = new Criteria(["id = ?", data.id]);

  return must(
    await database.get<z.infer<Session>>(
      ...new sql.Query(
        "UPDATE sessions",
        patch,
        criteria,
        "RETURNING *;",
      ).toSQL(),
    ),
  );
}

/**
 * Find a valid session by token.
 */
export async function findValidByToken(
  database: Database,
  data: { token: z.infer<typeof schema.shape.token> },
) {
  const criteria = new sql.Criteria();
  criteria.push("token = ?", data.token);
  criteria.push("expiresAt > ?", DateTime.utc().toISO());

  return await database.get<z.infer<Session>>(
    ...new sql.Query("SELECT * FROM sessions", criteria, "LIMIT 1;").toSQL(),
  );
}

/**
 * Find a session by ID.
 */
export async function findById(
  database: Database,
  data: { id: z.infer<typeof schemas.id> },
) {
  const criteria = new sql.Criteria();
  criteria.push("id = ?", data.id);

  return await database.get<z.infer<Session>>(
    ...new sql.Query("SELECT * FROM sessions", criteria, "LIMIT 1;").toSQL(),
  );
}

/**
 * List all sessions of a user.
 */
export async function listByUserId(
  database: Database,
  data: Pick<z.input<typeof schema>, "userId">,
) {
  const criteria = new sql.Criteria();
  criteria.push("userId = ?", data.userId);

  return await database.all<z.infer<Session>>(
    ...new sql.Query(
      "SELECT * FROM sessions",
      criteria,
      "ORDER BY createdAt DESC;",
    ).toSQL(),
  );
}
