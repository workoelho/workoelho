import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { Infer } from "superstruct";

import prisma from "~/src/lib/server/prisma";
import { id } from "~/src/lib/shared/schema";

type Session = Prisma.SessionGetPayload<{
  include: { user: { include: { memberships: true } } };
}>;

export const cookieId = "session";

export async function findValidSessionBySecret(secret: string) {
  return await prisma.session.findUnique({
    where: { secret, expiresAt: { gt: new Date() } },
    include: {
      user: { include: { memberships: { include: { organization: true } } } },
    },
  });
}

export async function getCurrentSession() {
  const secret = cookies().get(cookieId)?.value;
  if (!secret) {
    return;
  }
  return await findValidSessionBySecret(secret);
}

export function hasMembershipTo(
  session: Session | undefined | null,
  organizationId: Infer<typeof id>
) {
  return session?.user.memberships.some(
    (membership) => membership.organizationId === organizationId
  );
}
