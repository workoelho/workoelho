import { NextResponse } from "next/server";
import { createPassword } from "~/lib/api/user";
import { withErrorHandled } from "~/lib/handler";
import prisma from "~/lib/prisma";
import { newUserSchema } from "~/lib/schema/user";

export const POST = withErrorHandled(async (request) => {
  const input = newUserSchema.parse(await request.json());

  const user = await prisma.user.create({
    data: {
      name: input.name ?? "",
      email: input.email,
      password: await createPassword(input.password),
    },
  });

  return NextResponse.json({ data: user }, { status: 201 });
});
