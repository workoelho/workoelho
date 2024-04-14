"use server";

import * as superstruct from "superstruct";

import * as schema from "~/src/lib/shared/schema";
import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  page: superstruct.defaulted(superstruct.number(), 1),
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
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List services.
 */
export async function list(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  const take = 10;
  const skip = (payload.page - 1) * take;

  return await db.relation.findMany({
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
    where: {
      organizationId: context.session.organizationId,
      relator: payload.relator,
    },
    orderBy: {
      id: "asc",
    },
    skip,
    take,
  });
}
