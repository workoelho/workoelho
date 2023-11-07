import { cookies } from "next/headers";
import * as superstruct from "superstruct";

import { withErrorHandled } from "~/src/lib/server/handler";
import prisma from "~/src/lib/server/prisma";
import { createPassword } from "~/src/lib/server/user";
import * as Schema from "~/src/lib/shared/schema";

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

  cookies().set({
    name: "session",
    value: user.sessions[0].secret,
    httpOnly: true,
    // secure: true,
    sameSite: "lax",
    expires: user.sessions[0].expiresAt,
    path: "/",
  });

  return Response.json(user);
});
