import * as superstruct from "superstruct";

import { ActionContext } from "~/src/lib/server/action";
import prisma from "~/src/lib/server/prisma";
import { createPassword } from "~/src/lib/server/user";
import * as Schema from "~/src/lib/shared/schema";

const schema = superstruct.object({
  name: Schema.name,
  organization: Schema.organization,
  email: Schema.email,
  password: Schema.password,
});

export async function create({ data }: ActionContext) {
  superstruct.assert(data, schema);

  return await prisma.user.create({
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
}
