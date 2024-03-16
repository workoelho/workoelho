"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  id: schema.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Delete an application.
 */
export async function destroy(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.application.delete({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
    },
  });
}
