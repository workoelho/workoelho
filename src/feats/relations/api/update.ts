"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  id: schema.id,
  name: superstruct.optional(schema.name),
  url: superstruct.optional(schema.url),
  relator: superstruct.optional(
    superstruct.union([
      superstruct.object({
        applicationId: schema.id,
      }),
      superstruct.object({
        projectId: schema.id,
      }),
    ])
  ),
  relatable: superstruct.optional(
    superstruct.union([
      superstruct.object({
        applicationId: schema.id,
      }),
      superstruct.object({
        providerId: schema.id,
      }),
    ])
  ),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update relation.
 */
export async function update(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.relation.update({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
    },
    data: {
      name: payload.name,
      url: payload.url,
      relator: { update: payload.relator },
      relatable: { update: payload.relatable },
    },
  });
}
