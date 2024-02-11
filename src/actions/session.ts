"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { comparePassword } from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

import { ValidationError } from "../lib/server/ValidationError";

export async function create({ payload: data }: Context) {
  superstruct.assert(
    data,
    superstruct.union([
      superstruct.object({
        email: schema.email,
        password: schema.password,
        remoteAddress: superstruct.string(),
        userAgent: superstruct.string(),
        deviceId: superstruct.string(),
      }),
      superstruct.object({
        email: schema.email,
        recovery: superstruct.literal(true),
        remoteAddress: superstruct.string(),
        userAgent: superstruct.string(),
        deviceId: superstruct.string(),
      }),
    ])
  );

  const user = await db.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ValidationError("E-mail not found");
  }

  if (
    "password" in data &&
    !(await comparePassword(data.password, user.password))
  ) {
    throw new ValidationError("Bad password");
  }

  return await db.session.create({
    data: {
      userId: user.id,
      expiresAt: superstruct.create(undefined, schema.session.expiresAt),
      deviceId: data.deviceId,
      remoteAddress: data.remoteAddress,
      userAgent: data.userAgent,
    },
    include: {
      user: {
        include: {
          organization: true,
        },
      },
    },
  });
}
