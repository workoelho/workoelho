"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";
import { validate } from "~/src/lib/server/session";

const payloadSchema = superstruct.object({
  id: schema.id,
  email: superstruct.optional(schema.email),
  name: superstruct.optional(schema.name),
  password: superstruct.optional(schema.password),
  level: superstruct.optional(schema.user.level),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Update user.
 */
export async function update(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  validate(context.session);

  return await db.user.update({
    where: {
      id: payload.id,
      organizationId: context.session.organizationId,
    },
    data: {
      email: payload.email,
      name: payload.name,
      level: payload.level,
      password: payload.password
        ? await password.create(payload.password)
        : undefined,
    },
  });
}
