import { expect, setSystemTime, test } from "bun:test";

import { create } from "./api";

test("create", async () => {
  const createdAt = new Date("1990-05-04T00:00:00Z");
  setSystemTime(createdAt);

  const organization = await create({
    payload: {
      name: "Test  name ",
    },
  });

  expect(organization).toEqual({
    id: expect.any(Number),
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    name: "Test name",
  });
});
