"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  organizationId: schema.id,
  page: superstruct.optional(superstruct.number()),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List users in an organization.
 */
export async function list({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  const take = 10;
  const skip = (payload.page ?? 0) * take;

  return await db.user.findMany({
    where: {
      organizationId: payload.organizationId,
    },
    orderBy: {
      id: "asc",
    },
    skip,
    take,
  });
}
