import { comparePassword } from "~/lib/server/user";
import { withErrorHandled } from "~/lib/server/handler";
import prisma from "~/lib/server/prisma";
import * as Schema from "~/lib/shared/schema";
import { z } from "zod";
import { InvalidInput } from "~/lib/shared/InvalidInput";

export const POST = withErrorHandled(async (request) => {
  const schema = z.object({
    email: z.string().email(),
    password: Schema.User.password,
  });
  const input = schema.parse(await request.json());

  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new InvalidInput([
      {
        path: ["email"],
        code: "nonexistent",
      },
    ]);
  }

  if (!(await comparePassword(input.password, user.password))) {
    throw new InvalidInput([
      {
        path: ["password"],
        code: "mismatch",
      },
    ]);
  }

  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userId: user.id,
    },
  });

  return Response.json({ data: session }, { status: 201 });
});
