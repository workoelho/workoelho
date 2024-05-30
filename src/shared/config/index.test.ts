import { expect, test } from "bun:test";

import { getConfig } from ".";

test("getConfig", () => {
  expect(getConfig()).toEqual({ env: "test", databaseUrl: expect.any(URL) });
  expect(getConfig("env")).toBe("test");
});
