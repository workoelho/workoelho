import { test, expect } from "bun:test";

import { create } from ".";

import "~/src/migrate";

test("create", () => {
  const organization = create({
    payload: {
      name: "Test",
    },
  });

  expect(organization).toEqual({
    id: 1,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    name: "Test",
  });
});
