import { IncomingMessage, ServerResponse } from "http";

import { parse, serialize } from "cookie";

import { database } from "~/src/shared/database";

/**
 * Get default session expiration date.
 */
export function getSessionExpiration() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
}

export const sessionCookieId = "sid";

/**
 * Set session cookie.
 */
export function setSessionCookie(
  response: ServerResponse,
  sessionId: string,
  expiresAt: Date
) {
  response.setHeader(
    "Set-Cookie",
    serialize(sessionCookieId, sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: expiresAt,
    })
  );
}

/**
 * Clear session cookie.
 */
export function clearSessionCookie(response: ServerResponse) {
  response.setHeader(
    "Set-Cookie",
    serialize(sessionCookieId, "", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(),
    })
  );
}

/**
 * Get session id from request cookies.
 */
export function getSessionId(request: IncomingMessage) {
  const cookies = parse(request.headers.cookie ?? "");
  return cookies[sessionCookieId];
}

/**
 * Get current session from request.
 */
export async function getSession(request: IncomingMessage) {
  const sessionId = getSessionId(request);

  if (!sessionId) {
    return null;
  }

  const session = await database.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          organization: true,
        },
      },
    },
  });

  return session;
}
