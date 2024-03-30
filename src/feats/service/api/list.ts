"use server";

import * as superstruct from "superstruct";

import * as schema from "~/src/lib/shared/schema";
import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  page: superstruct.defaulted(superstruct.number(), 1),
  applicationId: schema.id,
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

  return await db.service.findMany({
    where: {
      organizationId: context.session.organizationId,
      applicationId: payload.applicationId,
    },
    orderBy: {
      id: "asc",
    },
    skip,
    take,
  });
}
