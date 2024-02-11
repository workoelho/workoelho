import { randomUUID } from "crypto";

import { cookies } from "next/headers";

export const deviceCookieId = "did";

export function getDeviceId() {
  return cookies().get(deviceCookieId)?.value;
}

export function setDeviceId() {
  if (getDeviceId()) {
    return;
  }

  const id = randomUUID();

  cookies().set(deviceCookieId, id, {
    path: "/",
    maxAge: Infinity,
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
