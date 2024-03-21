"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  email: schema.email,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Get one user, by email.
 */
export async function getByEmail(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  return await db.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
}
