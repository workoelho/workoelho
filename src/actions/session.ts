"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { comparePassword } from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";
import { ValidationError } from "~/src/lib/server/ValidationError";

export async function create({ payload }: Context) {
  const data = superstruct.create(
    payload,
    superstruct.object({
      email: schema.email,
      remoteAddress: superstruct.string(),
      userAgent: superstruct.string(),
      deviceId: superstruct.string(),
      password: superstruct.optional(schema.password),
    }),
  );

  const user = await db.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ValidationError("E-mail not found");
  }

  if (
    "password" in data &&
    !(await comparePassword(String(data.password), user.password))
  ) {
    throw new ValidationError("Bad password");
  }

  await db.session.updateMany({
    where: {
      userId: user.id,
      deviceId: data.deviceId,
    },
    data: {
      expiresAt: new Date(),
    },
  });

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
