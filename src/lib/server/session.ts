import { cookies } from "next/headers";

import { db, Session } from "~/src/lib/server/prisma";
import { UnauthorizedError } from "~/src/lib/shared/errors";
import { Nullable } from "~/src/lib/shared/nullable";

export const sessionCookieId = "session";

/**
 * Get session from request cookies.
 */
export async function getRequestSession() {
  const id = cookies().get(sessionCookieId)?.value;

  if (!id) {
    throw new UnauthorizedError("Session cookie is missing");
  }

  return await db.session.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
    include: {
      user: true,
      organization: true,
    },
  });
}

/**
 * Validate session.
 */
export function validate<T extends Session>(
  session: Nullable<T>,
): asserts session is NonNullable<T> {
  if (!session) {
    throw new UnauthorizedError("Session is missing");
  }

  if (session.expiresAt < new Date()) {
    throw new UnauthorizedError("Session expired");
  }
}

/**
 * Set session cookie.
 */
export async function setSessionCookie(session: Session) {
  "use server";

  cookies().set(sessionCookieId, session.id, {
    path: "/",
    expires: session.expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Clear session cookie.
 */
export function clearSessionCookie() {
  cookies().delete("session");
}
