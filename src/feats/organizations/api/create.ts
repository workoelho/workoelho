"use server";

import * as superstruct from "superstruct";

import { Context } from "~/src/lib/server/actions";
import { db } from "~/src/lib/server/prisma";
import * as password from "~/src/lib/server/password";
import * as schema from "~/src/lib/shared/schema";

const payloadSchema = superstruct.object({
  organization: schema.name,
  name: schema.name,
  email: schema.email,
  password: schema.password,
});

type Payload = superstruct.Infer<typeof payloadSchema>;

export async function create(context: Context<Payload>) {
  const payload = superstruct.create(context.payload, payloadSchema);

  return await db.organization.create({
    data: {
      name: payload.organization,
      users: {
        create: [
          {
            email: payload.email,
            password: await password.create(payload.password),
            name: payload.name,
            level: superstruct.create("administrator", schema.user.level),
          },
        ],
      },
    },
    include: {
      users: {
        include: {
          sessions: true,
        },
      },
    },
  });
}
