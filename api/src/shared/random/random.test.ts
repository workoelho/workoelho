import { describe, expect, test } from "bun:test";

import { number, string } from "./random";

describe("number", () => {
  test("0, 1", () => {
    expect(number(0, 1)).toBeWithin(0, 1);
  });
  test("10, 20", () => {
    expect(number(10, 20)).toBeWithin(10, 20);
  });
  test("10, 10", () => {
    expect(number(10, 10)).toBe(10);
  });
});

describe("string", () => {
  test("10", () => {
    expect(string(10)).toHaveLength(10);
  });
});
