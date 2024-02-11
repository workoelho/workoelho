import { cookies } from "next/headers";

import { create } from "~/src/actions/session";
import { withErrorHandled } from "~/src/lib/server/handler";

export const POST = withErrorHandled(async (request: Request) => {
  const session = await create({ payload: await request.json() });

  cookies().set({
    name: "session",
    value: session.secret,
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    expires: session.expiresAt,
    path: "/",
  });

  return Response.json(session, { status: 201 });
});
