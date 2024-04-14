"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  name: schema.name,
  url: superstruct.optional(schema.url),
  relator: superstruct.union([
    superstruct.object({
      applicationId: schema.id,
    }),
    superstruct.object({
      projectId: schema.id,
    }),
  ]),
  relatable: superstruct.union([
    superstruct.object({
      applicationId: schema.id,
    }),
    superstruct.object({
      providerId: schema.id,
    }),
  ]),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create a relation.
 */
export async function create({ session, ...context }: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(session);

  const relator = await db.relator.create({
    data: payload.relator,
  });

  const relatable = await db.relatable.create({
    data: payload.relatable,
  });

  // @todo: For some reason I couldn't make nested create work.
  // It kept complaining about type mismatch between the payload and `undefined`.
  return await db.relation.create({
    data: {
      organizationId: session.organizationId,
      name: payload.name,
      url: payload.url,
      relatorId: relator.id,
      relatableId: relatable.id,
    },
    include: {
      relator: {
        include: {
          application: true,
          project: true,
        },
      },
      relatable: {
        include: {
          application: true,
          provider: true,
        },
      },
    },
  });
}
