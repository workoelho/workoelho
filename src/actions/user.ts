"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { createPassword } from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

export async function signUp({ payload }: Context) {
  superstruct.assert(
    payload,

    superstruct.object({
      email: schema.email,
      name: schema.name,
      role: schema.role,
      organization: schema.name,
      password: schema.password,
      remoteAddress: superstruct.string(),
      userAgent: superstruct.string(),
      deviceId: superstruct.string(),
    })
  );

  return await db.user.create({
    data: {
      email: payload.email,
      password: await createPassword(payload.password),
      name: payload.name,
      role: superstruct.create(undefined, schema.role),
      organization: {
        create: {
          name: payload.organization,
        },
      },
      sessions: {
        create: [
          {
            expiresAt: superstruct.create(undefined, schema.session.expiresAt),
            deviceId: payload.deviceId,
            remoteAddress: payload.remoteAddress,
            userAgent: payload.userAgent,
          },
        ],
      },
    },
    include: {
      organization: true,
      sessions: true,
    },
  });
}

export async function create({ payload }: Context) {
  superstruct.assert(
    payload,

    superstruct.object({
      email: schema.email,
      name: schema.name,
      role: schema.role,
      organizationId: schema.id,
    })
  );

  return await db.user.create({
    data: {
      email: payload.email,
      password: await createPassword(Math.random().toString(36).slice(2)),
      name: payload.name,
      role: superstruct.create(payload.role, schema.role),
      organizationId: payload.organizationId,
      sessions: {
        create: [
          {
            expiresAt: superstruct.create(undefined, schema.session.expiresAt),
            deviceId: "",
            remoteAddress: "",
            userAgent: "",
          },
        ],
      },
    },
  });
}

export async function list({ query }: Context) {
  superstruct.assert(
    query,

    superstruct.object({
      organizationId: schema.id,
    })
  );

  return await db.user.findMany({
    where: {
      organizationId: query.organizationId,
    },
  });
}
