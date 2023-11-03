import * as superstruct from "superstruct";

import * as Schema from "~/lib/shared/schema";
import prisma from "~/lib/server/prisma";
import { comparePassword } from "~/lib/server/user";
import { withErrorHandled } from "~/lib/server/handler";

const schema = superstruct.object({
  email: Schema.email,
  password: Schema.password,
});

export const POST = withErrorHandled(async (request: Request) => {
  const data = superstruct.create(await request.json(), schema);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("E-mail not found");
  }

  if (!(await comparePassword(data.password, user.password))) {
    throw new Error("Bad password");
  }

  const session = await prisma.session.create({
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

  return Response.json(session);
});
