"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  name: schema.name,
  userId: schema.id,
  applicationId: schema.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create a role.
 */
export async function create({ session, ...context }: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(session);

  return await db.role.create({
    data: {
      organizationId: session.organizationId,
      name: payload.name,
      userId: payload.userId,
      applicationId: payload.applicationId,
    },
  });
}
