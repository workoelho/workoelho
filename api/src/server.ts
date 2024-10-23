import { serve } from "bun";
import { Hono } from "hono";
import { getConfig } from "~/src/config";
import { migrate, seed } from "~/src/database";
import { Database } from "~/src/shared/database";
import { print } from "~/src/shared/log";
import { handleRequestError, setRequestLogger } from "~/src/shared/request";
import { v1 } from "~/src/v1";

print("log", "server", "Config dump", getConfig());

{
  await using database = await Database.open(getConfig("databaseUrl"));

  await migrate(database);
  await seed(database);
}

const app = new Hono();

app.onError(handleRequestError);
app.use(setRequestLogger());

app.route("/api/v1", v1);

setInterval(() => {
  performance.mark("jobs");

  // ...

  const { duration } = performance.measure("jobs", "jobs");

  print(
    "log",
    "server",
    "Background jobs completed",
    `${duration.toFixed(2)}ms`,
  );
}, 1000);

print("log", "server", `Listening on http://localhost:${getConfig("port")}`);

serve({
  fetch: app.fetch,
  port: getConfig("port"),
});
