import { cookies } from "next/headers";

import { db, Session } from "~/src/lib/server/prisma";

export const sessionCookieId = "sid";

export async function findValidSession(id: string) {
  return await db.session.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
    include: {
      user: { include: { organization: true } },
    },
  });
}

export async function getCurrentSession() {
  const id = cookies().get(sessionCookieId)?.value;
  if (!id) {
    return;
  }
  return await findValidSession(id);
}

export async function setCurrentSession(session: Session) {
  cookies().set(sessionCookieId, session.id, {
    path: "/",
    expires: session.expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearCurrentSession() {
  cookies().delete("session");
}
