// import { randomUUID } from "crypto";

import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { Time } from "~/src/lib/shared/Time";

export const cookieId = "device";

export function getDeviceId(cookies: RequestCookies | ReadonlyRequestCookies) {
  return cookies.get(cookieId)?.value;
}

export function setDeviceId(cookies: ResponseCookies) {
  const id = crypto.randomUUID();

  cookies.set(cookieId, id, {
    path: "/",
    expires: new Date(Date.now() + Time.Year * 100),
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
