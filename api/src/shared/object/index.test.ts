import { expect, test } from "bun:test";

import { omit, pick } from ".";

test("omit", () => {
  expect(omit({ a: 1, b: 2, c: 3 }, "a", "c")).toEqual({ b: 2 });
});

test("pick", () => {
  expect(pick({ a: 1, b: 2, c: 3 }, "a", "c")).toEqual({ a: 1, c: 3 });
});
