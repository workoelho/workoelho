import { test, expect } from "bun:test";

import { create } from ".";

test("create", async () => {
  const organization = await create({
    payload: {
      name: "Test",
    },
  });

  expect(organization).toEqual({
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    name: "Test",
  });
});
