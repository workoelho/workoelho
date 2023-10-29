"use server";

import * as superstruct from "superstruct";

import * as Schema from "~/lib/shared/schema";
import { UserNotFoundError, WrongPasswordError } from "~/lib/shared/error";
import { Context } from "~/lib/server/Context";
import { comparePassword } from "~/lib/server/user";
import prisma from "~/lib/server/prisma";

const schema = superstruct.object({
  email: Schema.email,
  password: Schema.password,
});

export async function create(context: Context, data: Record<string, unknown>) {
  superstruct.assert(data, schema);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  if (!(await comparePassword(data.password, user.password))) {
    throw new WrongPasswordError();
  }

  return await prisma.session.create({
    data: {
      expiresAt: superstruct.create(undefined, Schema.expiresAt),
      userId: user.id,
    },
  });
}
