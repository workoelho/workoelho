"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  organizationId: schema.id,
  skip: superstruct.defaulted(superstruct.number(), 0),
  take: superstruct.defaulted(superstruct.number(), 10),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List users in an organization.
 */
export async function list({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  return await db.user.findMany({
    where: {
      organizationId: payload.organizationId,
    },
    orderBy: {
      id: "asc",
    },
    skip: payload.skip,
    take: payload.take,
  });
}
