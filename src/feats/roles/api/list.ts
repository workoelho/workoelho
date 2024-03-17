"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  userId: superstruct.optional(schema.id),
  applicationId: superstruct.optional(schema.id),
  page: superstruct.defaulted(superstruct.number(), 1),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * List roles of a user.
 */
export async function list(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  const take = 10;
  const skip = (payload.page - 1) * take;

  return await db.role.findMany({
    where: {
      userId: payload.userId,
      applicationId: payload.applicationId,
      organizationId: context.session.organizationId,
    },
    include: { user: true, application: true },
    take,
    skip,
  });
}
