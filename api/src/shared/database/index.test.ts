import { describe, expect, test } from "bun:test";

import { Database } from ".";

describe("Database", async () => {
  const database = new Database();

  test("open", async () => {
    await database.open(new URL("sqlite://"));
    await using _ = database;
    expect(database.instance).not.toBeUndefined();
  });

  test("close/dispose", async () => {
    expect(database.instance).toBeUndefined();
  });
});
