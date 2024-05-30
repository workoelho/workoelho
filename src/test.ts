import { beforeAll } from "bun:test";

// Use in memory database.
process.env.DATABASE_URL = "sqlite:///";

beforeAll(() => {
  require("~/src/migrate");
});
