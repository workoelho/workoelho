"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  id: schema.id,
  name: superstruct.optional(schema.name),
  userId: schema.optionalId,
  applicationId: schema.optionalId,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update a role.
 */
export async function update({ session, ...context }: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(session);

  return await db.role.update({
    where: {
      id: payload.id,
      organizationId: session.organizationId,
    },
    data: {
      name: payload.name,
      userId: payload.userId,
      applicationId: payload.applicationId,
    },
  });
}
