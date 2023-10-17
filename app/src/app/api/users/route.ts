import { createPassword } from "~/lib/server/user";
import { withErrorHandled } from "~/lib/server/handler";
import prisma from "~/lib/server/prisma";
import * as Schema from "~/lib/shared/schema";
import { z } from "zod";

export const POST = withErrorHandled(async (request) => {
  const schema = z.object({
    name: Schema.User.name,
    email: Schema.User.email,
    password: Schema.User.password,
  });
  const input = schema.parse(await request.json());

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await createPassword(input.password),
    },
  });

  return Response.json({ data: user }, { status: 201 });
});
