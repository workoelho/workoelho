"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  organizationId: schema.id,
  name: schema.name,
  email: schema.email,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create an user.
 */
export async function create({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  return await db.user.create({
    data: {
      organizationId: payload.organizationId,
      name: payload.name,
      email: payload.email,
      password: await password.create(password.random()),
    },
  });
}
