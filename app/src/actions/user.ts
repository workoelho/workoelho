import * as superstruct from "superstruct";
import * as Schema from "~/lib/shared/schema";
import { Context } from "~/lib/server/Context";
import prisma from "~/lib/server/prisma";
import { createPassword } from "~/lib/server/user";

const schema = superstruct.object({
  name: Schema.name,
  email: Schema.email,
  password: Schema.password,
});

export async function create(context: Context, data: Record<string, unknown>) {
  superstruct.assert(data, schema);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await createPassword(data.password),
    },
  });
}
