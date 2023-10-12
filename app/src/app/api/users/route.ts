import { NextResponse } from "next/server";
import { New, createPassword } from "~/lib/api/User";
import { withErrorHandled } from "~/lib/handler";
import prisma from "~/lib/prisma";

export const POST = withErrorHandled(async (request) => {
  const input = New.parse(await request.json());

  const user = await prisma.user.create({
    data: {
      name: input.name ?? "",
      email: input.email,
      password: await createPassword(input.password),
    },
  });

  return NextResponse.json({ data: user }, { status: 201 });
});
