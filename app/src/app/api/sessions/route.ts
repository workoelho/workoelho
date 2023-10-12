import { NextResponse } from "next/server";
import { New } from "~/lib/api/Session";
import { comparePassword } from "~/lib/api/User";
import { withErrorHandled } from "~/lib/handler";
import prisma from "~/lib/prisma";

export const POST = withErrorHandled(async (request) => {
  const input = New.parse(await request.json());

  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return new NextResponse(null, { status: 404 });
  }

  if (await comparePassword(input.password, user.password)) {
    return new NextResponse(null, { status: 401 });
  }

  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      userId: user.id,
    },
  });

  return NextResponse.json({ data: session }, { status: 201 });
});
