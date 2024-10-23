import { expect, test } from "bun:test";

import { compact, truncate } from ".";

test("compact", () => {
  const string = `
    a  b
    c  d
  `;
  expect(compact(string)).toBe("a b c d");
});

test("truncate", () => {
  const string = "Hello, world!";
  expect(truncate(string, Math.floor(string.length / 2))).toBe("Hello,...");
  expect(truncate(string, string.length)).toBe(string);
});
