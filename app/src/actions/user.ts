import * as superstruct from "superstruct";

import * as Schema from "~/lib/shared/schema";
import { Context } from "~/lib/server/Context";
import prisma from "~/lib/server/prisma";
import { createPassword } from "~/lib/server/user";

const schema = superstruct.object({
  name: Schema.name,
  organization: Schema.organization,
  email: Schema.email,
  password: Schema.password,
});

export async function create(context: Context, data: Record<string, unknown>) {
  superstruct.assert(data, schema);

  const organization = await prisma.organization.create({
    data: {
      name: data.organization,
    },
  });

  return await prisma.user.create({
    data: {
      email: data.email,
      password: await createPassword(data.password),
      name: data.name,
      role: "administrator",
      organizationId: organization.id,
    },
  });
}
