import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { getBody } from "~/src/shared/response";
import { database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { comparePassword } from "~/src/shared/password";
import { getSessionExpiration, setSessionCookie } from "~/src/shared/session";

export const url = "/sessions";

async function handlePost(context: Context) {
  const data = await getBody(context.request, {
    email: superstruct.string(),
    password: superstruct.string(),
  });

  const user = await database.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new HttpError(401);
  }

  if (!(await comparePassword(data.password, user.password))) {
    throw new HttpError(401);
  }

  const expiresAt = getSessionExpiration();

  const session = await database.session.create({
    data: {
      expiresAt,
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  setSessionCookie(context.response, session.id, expiresAt);

  context.response.writeHead(302, {
    Location: `/organizations/${session.user.organizationId}/applications`,
  });
  context.response.end();
}

// eslint-disable-next-line @typescript-eslint/require-await
async function handleDelete(context: Context) {
  context.response.setHeader(
    "Set-Cookie",
    `sid=; Path=/; HttpOnly; SameSite=Strict; Expires=${new Date().toUTCString()}`
  );
  context.response.writeHead(302, {
    Location: `/sessions/new`,
  });
  context.response.end();
}

export async function handler(context: Context) {
  switch (context.request.method) {
    case "POST":
      return handlePost(context);
    case "DELETE":
      return handleDelete(context);
    default:
      throw new HttpError(405);
  }
}