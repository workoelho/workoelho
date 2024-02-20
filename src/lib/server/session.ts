import { cookies } from "next/headers";

import { db, Session } from "~/src/lib/server/prisma";

export const sessionCookieId = "session";

/**
 * Get valid session by ID. If no ID is provided, read it from the session cookie.
 */
export async function getValidSession(id?: string) {
  id ??= cookies().get(sessionCookieId)?.value;

  if (!id) {
    return;
  }

  return await db.session.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
    include: {
      user: { include: { organization: true } },
    },
  });
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
