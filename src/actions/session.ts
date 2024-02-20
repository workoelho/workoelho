"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";
import { ValidationError } from "~/src/lib/server/ValidationError";

/**
 * Create new session.
 */
export async function create({ payload }: Context) {
  const data = superstruct.create(
    payload,
    superstruct.object({
      userId: superstruct.number(),
      expiresAt: superstruct.optional(schema.session.expiresAt),
      deviceId: superstruct.string(),
      userAgent: superstruct.string(),
      remoteAddress: superstruct.string(),
    }),
  );

  // Reduce impact of leakage by expiring all other sessions from the same device.
  // await db.session.updateMany({
  //   where: {
  //     userId: data.userId,
  //     deviceId: data.deviceId,
  //   },
  //   data: {
  //     expiresAt: new Date(),
  //   },
  // });

  return await db.session.create({
    data: {
      userId: data.userId,
      expiresAt: superstruct.create(data.expiresAt, schema.session.expiresAt),
      deviceId: data.deviceId,
      userAgent: data.userAgent,
      remoteAddress: data.remoteAddress,
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

/**
 * Create new session from credentials.
 */
export async function authenticate({ payload }: Context) {
  const data = superstruct.create(
    payload,
    superstruct.object({
      email: schema.email,
      password: schema.password,
      deviceId: superstruct.string(),
      userAgent: superstruct.string(),
      remoteAddress: superstruct.string(),
    }),
  );

  const user = await db.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ValidationError("E-mail not found");
  }

  if (!(await password.validate(String(data.password), user.password))) {
    throw new ValidationError("Bad password");
  }

  return await create({
    payload: {
      userId: user.id,
      deviceId: data.deviceId,
      userAgent: data.userAgent,
      remoteAddress: data.remoteAddress,
    },
  });
}

/**
 * Create new session from an existing valid session.
 */
export async function refresh({ payload }: Context) {
  const data = superstruct.create(
    payload,
    superstruct.object({
      sessionId: superstruct.string(),
      deviceId: superstruct.string(),
      userAgent: superstruct.string(),
      remoteAddress: superstruct.string(),
    }),
  );

  const session = await db.session.findUnique({
    where: { id: data.sessionId, expiresAt: { gt: new Date() } },
  });

  if (!session) {
    throw new ValidationError("Session not found or expired");
  }

  // Invalidate the old session.
  await db.session.update({
    where: { id: session.id },
    data: {
      expiresAt: new Date(),
    },
  });

  return await create({
    payload: {
      userId: session.userId,
      deviceId: data.deviceId,
      remoteAddress: data.remoteAddress,
      userAgent: data.userAgent,
    },
  });
}
