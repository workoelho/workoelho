"use server";

import * as superstruct from "superstruct";

import { ActionContext } from "~/src/lib/server/action";
import prisma from "~/src/lib/server/prisma";
import { comparePassword } from "~/src/lib/server/user";
import * as Schema from "~/src/lib/shared/schema";

import { ValidationError } from "../lib/server/ValidationError";

export async function create({ data }: ActionContext) {
  superstruct.assert(
    data,
    superstruct.union([
      superstruct.object({
        email: Schema.email,
        password: Schema.password,
      }),
      superstruct.object({
        email: Schema.email,
        recovery: superstruct.literal(true),
      }),
    ])
  );

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ValidationError("E-mail not found");
  }

  if (
    "password" in data &&
    !(await comparePassword(data.password, user.password))
  ) {
    throw new ValidationError("Bad password");
  }

  return await prisma.session.create({
    data: {
      expiresAt: superstruct.create(undefined, Schema.expiresAt),
      userId: user.id,
    },
    include: {
      user: {
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  });
}
