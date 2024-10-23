import { Hono } from "hono";
import { api } from "~/src/api";
import { migrate } from "~/src/database";
import { Database } from "~/src/shared/database";
import {
  type Env,
  setRequestDatabase,
  setRequestSession,
} from "~/src/shared/request";

/**
 * Reference DateTime for testing.
 */
export const now = new Date("1990-05-04T06:00:00.000Z");

export async function prepare() {
  const database = await Database.open(new URL("sqlite://"));
  database.close = () => Promise.resolve();

  await migrate(database);

  const app = new Hono<Env>();

  app.use(setRequestDatabase(() => Promise.resolve(database)));
  app.use(setRequestSession(api.sessions.findNotExpiredByToken));

  return { app, database };
}
