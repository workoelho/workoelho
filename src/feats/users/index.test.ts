import { test, expect } from "bun:test";

import * as organizations from "~/src/feats/organizations";

import { create, password } from ".";

test("password", async () => {
  const hash = await password.hash("password");

  expect(hash).not.toBe("password");
  expect(await password.verify("password", hash)).toBeTrue();
  expect(await password.verify("wrong", hash)).toBeFalse();
});

test("create", async () => {
  const organization = await organizations.create({
    payload: {
      name: "Test",
    },
  });

  const user = await create({
    payload: {
      name: "Test",
      email: "test@example.com",
      password: "password",
      organizationId: organization.id,
    },
  });

  if (!user) {
    throw new Error();
  }

  expect(user).toEqual({
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    organizationId: organization.id,
    name: "Test",
    email: "test@example.com",
    password: expect.any(String),
  });

  expect(await password.verify("password", user.password)).toBeTrue();
});
