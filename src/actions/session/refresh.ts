"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { ValidationError } from "~/src/lib/server/ValidationError";

import { create } from ".";

/**
 * Create a new session from an existing valid session.
 */
export async function refresh(context: Context) {
  const query = superstruct.create(
    context.query,
    superstruct.object({
      sessionId: superstruct.string(),
    }),
  );

  const payload = superstruct.create(
    context.payload,
    superstruct.object({
      deviceId: superstruct.string(),
      userAgent: superstruct.string(),
      remoteAddress: superstruct.string(),
    }),
  );

  const session = await db.session.findUnique({
    where: { id: query.sessionId, expiresAt: { gt: new Date() } },
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
      deviceId: payload.deviceId,
      remoteAddress: payload.remoteAddress,
      userAgent: payload.userAgent,
    },
  });
}
