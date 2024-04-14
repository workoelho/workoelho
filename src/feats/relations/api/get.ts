"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  id: schema.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Get one relation.
 */
export async function get(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.relation.findUniqueOrThrow({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
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
