"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

export async function create({ payload }: Context) {
  superstruct.assert(
    payload,

    superstruct.object({
      name: schema.name,
      email: schema.email,
      role: schema.role,
      organizationId: schema.id,
    }),
  );

  return await db.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: await password.create(undefined),
      role: superstruct.create(payload.role, schema.role),
      organizationId: payload.organizationId,
    },
  });
}

export async function update({ query, payload }: Context) {
  superstruct.assert(
    query,

    superstruct.object({
      id: schema.id,
    }),
  );

  superstruct.assert(
    payload,

    superstruct.object({
      email: superstruct.optional(schema.email),
      name: superstruct.optional(schema.name),
      password: superstruct.optional(schema.password),
    }),
  );

  return await db.user.update({
    where: {
      id: query.id,
    },
    data: {
      email: payload.email,
      name: payload.name,
      password: payload.password
        ? await password.create(payload.password)
        : undefined,
    },
  });
}

export async function list({ query }: Context) {
  superstruct.assert(
    query,

    superstruct.object({
      organizationId: schema.id,
    }),
  );

  return await db.user.findMany({
    where: {
      organizationId: query.organizationId,
    },
  });
}
