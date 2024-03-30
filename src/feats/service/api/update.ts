"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  id: schema.id,
  name: superstruct.optional(schema.name),
  applicationId: schema.optionalId,
  providerType: superstruct.optional(superstruct.string()),
  providerId: schema.optionalId,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update service.
 */
export async function update(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.service.update({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
    },
    data: {
      name: payload.name,
      applicationId: payload.applicationId,
      providerType: payload.providerType,
      providerId: payload.providerId,
    },
  });
}
