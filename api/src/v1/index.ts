import { Hono } from "hono";
import { z } from "zod";
import { api } from "~/src/api";
import { getConfig } from "~/src/config";
import { Database } from "~/src/shared/database";
import { setRequestDatabase, setRequestSession } from "~/src/shared/request";
import { schemas } from "~/src/shared/schemas";

export const v1 = new Hono();

v1.use(setRequestDatabase(() => Database.open(getConfig("databaseUrl"))));

v1.use(
  setRequestSession((database, token) =>
    api.sessions.findValidByToken(database, { token }),
  ),
);

v1.post("/users", async (ctx) => {
  const data = z
    .object({
      email: schemas.email,
      password: schemas.password,
    })
    .parse(await ctx.req.json());
});
