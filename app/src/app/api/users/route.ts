import * as superstruct from "superstruct";

import * as Schema from "~/lib/shared/schema";
import prisma from "~/lib/server/prisma";
import { comparePassword, createPassword } from "~/lib/server/user";
import { withErrorHandled } from "~/lib/server/handler";

const schema = superstruct.object({
  name: Schema.name,
  organization: Schema.organization,
  email: Schema.email,
  password: Schema.password,
});

export const POST = withErrorHandled(async (request: Request) => {
  const data = superstruct.create(await request.json(), schema);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: await createPassword(data.password),
      name: data.name,
      memberships: {
        create: [
          {
            role: "administrator",
            organization: {
              create: {
                name: data.organization,
              },
            },
          },
        ],
      },
      sessions: {
        create: [
          {
            expiresAt: superstruct.create(undefined, Schema.expiresAt),
          },
        ],
      },
    },
    include: {
      memberships: true,
      sessions: true,
    },
  });

  return Response.json(user);
});
