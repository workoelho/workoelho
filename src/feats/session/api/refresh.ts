"use server";

import * as superstruct from "superstruct";

import { create } from "~/src/feats/session/api";
import { ValidationError } from "~/src/lib/server/ValidationError";
import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";

const payloadSchema = superstruct.object({
  sessionId: superstruct.string(),
  deviceId: superstruct.string(),
  userAgent: superstruct.string(),
  remoteAddress: superstruct.string(),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create a new session from an existing valid session.
 */
export async function refresh(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  const session = await db.session.findUnique({
    where: { id: payload.sessionId, expiresAt: { gt: new Date() } },
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
      organizationId: session.organizationId,
      userId: session.userId,
      deviceId: payload.deviceId,
      remoteAddress: payload.remoteAddress,
      userAgent: payload.userAgent,
    },
  });
}
