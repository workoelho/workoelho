import { expect, test } from "bun:test";

import * as organizations from "~/src/feats/organizations";

import { ZodError } from "zod";
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

  expect(async () => {
    await create({
      payload: {
        organizationId: 0,
        email: "",
        name: "",
        password: "",
      },
    });
  }).toThrowError(ZodError);

  const payload = {
    name: "Test",
    email: "test@example.com",
    password: "password1234567",
    organizationId: organization.id,
  };

  const user = await create({
    payload,
  });

  expect(user).toEqual({
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    organizationId: organization.id,
    name: "Test",
    email: "test@example.com",
    password: expect.any(String),
  });

  expect(await password.verify(payload.password, user.password)).toBeTrue();
});
