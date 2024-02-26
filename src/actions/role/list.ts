"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  userId: schema.id,
  page: superstruct.defaulted(superstruct.number(), 1),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List roles of a user.
 */
export async function list(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  const take = 10;
  const skip = (payload.page - 1) * take;

  return await db.role.findMany({
    where: { userId: payload.userId },
    include: { application: true },
    take,
    skip,
  });
}
