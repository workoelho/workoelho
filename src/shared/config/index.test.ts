import { test, expect } from "bun:test";

import { setConfig, getConfig } from ".";

test("getConfig", () => {
  expect(getConfig("env")).toBe("test");
});

test("setConfig", () => {
  setConfig("env", "development");
  expect(getConfig("env")).toBe("development");
});
