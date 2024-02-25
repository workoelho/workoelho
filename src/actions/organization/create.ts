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

export async function create({ payload }: Context<Payload>) {
  superstruct.assert(payload, payloadSchema);

  return await db.organization.create({
    data: {
      name: payload.organization,
      users: {
        create: [
          {
            email: payload.email,
            password: await password.create(payload.password),
            name: payload.name,
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
