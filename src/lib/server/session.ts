import { cookies } from "next/headers";

import { db, Session } from "~/src/lib/server/prisma";

export const sessionCookieId = "session";

export async function findValidSession(id: string) {
  return await db.session.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
    include: {
      user: { include: { organization: true } },
    },
  });
}

export async function getSession() {
  const id = cookies().get(sessionCookieId)?.value;
  if (!id) {
    return;
  }
  return await findValidSession(id);
}

export async function setSession(session: Session) {
  cookies().set(sessionCookieId, session.id, {
    path: "/",
    expires: session.expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSession() {
  cookies().delete("session");
}
