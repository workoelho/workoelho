"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  id: schema.id,
  email: superstruct.optional(schema.email),
  name: superstruct.optional(schema.name),
  password: superstruct.optional(schema.password),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update user.
 */
export async function update({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  return await db.user.update({
    where: {
      id: payload.id,
    },
    data: {
      email: payload.email,
      name: payload.name,
      password: payload.password
        ? await password.create(payload.password)
        : undefined,
    },
  });
}
