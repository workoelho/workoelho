"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  deviceId: schema.deviceId,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List sessions created from a given device, distinctively by organization.
 */
export async function listByDevice(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.session.findMany({
    where: {
      deviceId: payload.deviceId,
      expiresAt: { gt: new Date() },
      organizationId: { not: context.session.organizationId },
    },
    include: {
      user: true,
      organization: true,
    },
    orderBy: { createdAt: "desc" },
    distinct: ["organizationId"],
  });
}
