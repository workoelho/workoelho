"use server";

import * as superstruct from "superstruct";

import { ActionContext } from "~/src/lib/server/action";
import prisma from "~/src/lib/server/prisma";
import { comparePassword } from "~/src/lib/server/user";
import * as Schema from "~/src/lib/shared/schema";

const schema = superstruct.object({
  email: Schema.email,
  password: Schema.password,
});

export async function create({ data }: ActionContext) {
  superstruct.assert(data, schema);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("E-mail not found");
  }

  if (!(await comparePassword(data.password, user.password))) {
    throw new Error("Bad password");
  }

  return await prisma.session.create({
    data: {
      expiresAt: superstruct.create(undefined, Schema.expiresAt),
      userId: user.id,
    },
    include: {
      user: {
        include: {
          memberships: true,
        },
      },
    },
  });
}
