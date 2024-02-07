import * as superstruct from "superstruct";

import { HttpError } from "~/src/shared/error";
import { getBody } from "~/src/shared/request";
import { database } from "~/src/shared/database";
import { Context } from "~/src/shared/handler";
import { createPassword } from "~/src/shared/password";
import { getSessionExpiration, setSessionCookie } from "~/src/shared/session";

export const url = "/organizations";

async function handlePost(context: Context) {
  const data = await getBody(context.request, {
    organization: superstruct.string(),
    name: superstruct.string(),
    email: superstruct.string(),
    password: superstruct.string(),
  });

  const organization = await database.organization.create({
    data: {
      name: data.organization,
      users: {
        create: {
          name: data.name,
          email: data.email,
          password: await createPassword(data.password),
        },
      },
    },
    select: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  const expiresAt = getSessionExpiration();

  const session = await database.session.create({
    data: {
      expiresAt,
      userId: organization.users[0].id,
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

export async function handler(context: Context) {
  switch (context.request.method) {
    case "POST":
      return handlePost(context);
    default:
      throw new HttpError(405);
  }
}
