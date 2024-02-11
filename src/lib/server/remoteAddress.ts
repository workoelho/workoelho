import { headers } from "next/headers";

export function getRemoteAddress() {
  const forwardedFor = headers().get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0];
  }
  return headers().get("x-real-ip") || forwardedFor || "0.0.0.0";
}
