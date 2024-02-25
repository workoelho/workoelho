"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  id: schema.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Get user by ID.
 */
export async function get({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  return await db.user.findUnique({
    where: {
      id: payload.id,
    },
  });
}
