"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  id: schema.id,
  name: superstruct.optional(schema.name),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update provider.
 */
export async function update(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.provider.update({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
    },
    data: {
      name: payload.name,
    },
  });
}
