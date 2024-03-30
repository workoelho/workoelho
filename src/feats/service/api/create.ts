"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  name: schema.name,
  applicationId: schema.id,
  providerType: superstruct.string(),
  providerId: schema.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create an service.
 */
export async function create({ session, ...context }: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(session);

  return await db.service.create({
    data: {
      organizationId: session.organizationId,
      name: payload.name,
      applicationId: payload.applicationId,
      providerType: payload.providerType,
      providerId: payload.providerId,
    },
  });
}
