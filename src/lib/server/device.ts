// import { randomUUID } from "crypto";

type Cookies = {
  set(name: string, value: string, options: Record<string, unknown>): void;
  get(name: string): undefined | { value: string };
};

export const cookieId = "device";

export function getDeviceId(cookies: Cookies) {
  console.log("getDeviceId", { cookieId, cookie: cookies.get(cookieId) });

  return cookies.get(cookieId)?.value;
}

export function setDeviceId(cookies: Cookies) {
  console.log("setDeviceId", { cookies });

  if (getDeviceId(cookies)) {
    return;
  }

  const id = crypto.randomUUID();

  cookies.set(cookieId, id, {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
