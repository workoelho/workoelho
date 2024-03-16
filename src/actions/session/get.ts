"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  id: schema.session.id,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Get one session.
 */
export async function get(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  return await db.session.findUniqueOrThrow({
    where: {
      id: payload.id,
    },
    include: {
      user: true,
      organization: true,
    },
  });
}
