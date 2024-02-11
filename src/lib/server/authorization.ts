import { getCurrentSession } from "~/src/lib/server/session";
import { ForbiddenError, UnauthorizedError } from "~/src/lib/shared/errors";
import { getPrivateId } from "~/src/lib/shared/publicId";

type Context = {
  organizationId: string | number;
};

/**
 * Enforce valid session and proper authorization.
 */
export async function authorize({ organizationId }: Context) {
  if (typeof organizationId === "string") {
    organizationId = getPrivateId(organizationId);
  }

  const session = await getCurrentSession();

  if (!session) {
    throw new UnauthorizedError("Session not found");
  }

  if (session.expiresAt <= new Date()) {
    throw new UnauthorizedError("Session expired");
  }

  if (session.user.organizationId !== organizationId) {
    throw new ForbiddenError("Organization mismatch");
  }

  return session;
}
