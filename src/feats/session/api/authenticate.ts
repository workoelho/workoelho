"use server";

import * as superstruct from "superstruct";

import * as Sessions from "~/src/feats/session/api";
import { ValidationError } from "~/src/lib/server/ValidationError";
import { Context } from "~/src/lib/server/actions";
import * as password from "~/src/lib/server/password";
import { db } from "~/src/lib/server/prisma";
import * as schema from "~/src/lib/shared/schema";

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
export async function authenticate(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  const user = await db.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ValidationError("Email not found");
  }

  if (!(await password.validate(payload.password, user.password))) {
    throw new ValidationError("Bad password");
  }

  return await Sessions.create({
    payload: {
      organizationId: user.organizationId,
      userId: user.id,
      deviceId: payload.deviceId,
      userAgent: payload.userAgent,
      remoteAddress: payload.remoteAddress,
    },
  });
}
