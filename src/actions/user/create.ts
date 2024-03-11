"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  name: schema.name,
  email: schema.email,
  level: schema.user.level,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create an user.
 */
export async function create(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.user.create({
    data: {
      organizationId: context.session.organizationId,
      email: payload.email,
      name: payload.name,
      level: payload.level,
      password: await password.create(password.random()),
    },
  });
}
