import { expect, setSystemTime, test } from "bun:test";

import { datetime, email, id, name, password } from "./schemas";

test("id", () => {
  expect(id.parse("01BX5ZZKBKACTAV9WEVGEMMVRZ")).toBe(
    "01BX5ZZKBKACTAV9WEVGEMMVRZ",
  );
  expect(() => id.parse("bad")).toThrow();
});

test("email", () => {
  expect(email.parse(" Test@Example.com ")).toBe("test@example.com");
  expect(() => email.parse("bad")).toThrow();
});

test("name", () => {
  expect(name.parse("  John  Doe  ")).toBe("John Doe");
});

test("password", () => {
  expect(password.parse("0123456789abcdef")).toBe("0123456789abcdef");
  expect(() => password.parse("bad")).toThrow();
});

test("datetime", () => {
  expect(datetime.parse("2022-01-01T00:00:00.000Z")).toBe(
    "2022-01-01T00:00:00.000Z",
  );
  expect(() => datetime.parse("bad")).toThrow();

  setSystemTime(new Date("2022-01-01T00:00:00.000Z"));

  expect(datetime.parse(undefined)).toBe("2022-01-01T00:00:00.000Z");
});
