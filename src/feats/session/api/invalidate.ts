"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";

const payloadSchema = superstruct.object({
  sessionId: superstruct.string(),
});

type Payload = superstruct.Infer<typeof payloadSchema>;

/**
 * Expires a session.
 */
export async function invalidate(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  await db.session.update({
    where: { id: payload.sessionId },
    data: {
      expiresAt: new Date(),
    },
  });
}
