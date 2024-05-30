import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";

import {
  getInsertValues,
  getPrefixedBindings,
  getUpdateValues,
  database,
} from ".";

test("database", () => {
  expect(database()).toBeInstanceOf(Database);
});

test("getInsertValues", () => {
  const values = getInsertValues({
    a: 1,
    b: 2,
    c: 3,
  });

  expect(values).toEqual("(a, b, c) values ($a, $b, $c)");
});

test("getUpdateValues", () => {
  const values = getUpdateValues({
    a: 1,
    b: 2,
    c: 3,
  });

  expect(values).toEqual("a = $a, b = $b, c = $c");
});

test("getPrefixedBindings", () => {
  const bindings = getPrefixedBindings({
    a: 1,
    b: 2,
    c: 3,
  });

  expect(bindings).toEqual([
    {
      $a: 1,
      $b: 2,
      $c: 3,
    },
  ]);
});
