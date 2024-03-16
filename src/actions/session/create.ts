"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  organizationId: schema.id,
  userId: schema.id,
  expiresAt: superstruct.optional(schema.session.expiresAt),
  deviceId: superstruct.string(),
  userAgent: superstruct.string(),
  remoteAddress: superstruct.string(),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create new session.
 */
export async function create(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

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
      organizationId: payload.organizationId,
      userId: payload.userId,
      expiresAt: superstruct.create(
        payload.expiresAt,
        schema.session.expiresAt,
      ),
      deviceId: payload.deviceId,
      userAgent: payload.userAgent,
      remoteAddress: payload.remoteAddress,
    },
    include: {
      user: true,
      organization: true,
    },
  });
}
