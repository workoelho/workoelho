"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";
import { ValidationError } from "~/src/lib/server/ValidationError";
import { create } from "~/src/actions/session/create";

const payloadSchema = superstruct.object({
  email: schema.email,
  password: schema.password,
  deviceId: superstruct.string(),
  userAgent: superstruct.string(),
  remoteAddress: superstruct.string(),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Create new session from credentials.
 */
export async function authenticate({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  const user = await db.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ValidationError("E-mail not found");
  }

  if (!(await password.validate(String(payload.password), user.password))) {
    throw new ValidationError("Bad password");
  }

  return await create({
    payload: {
      organizationId: user.organizationId,
      userId: user.id,
      deviceId: payload.deviceId,
      userAgent: payload.userAgent,
      remoteAddress: payload.remoteAddress,
    },
  });
}
