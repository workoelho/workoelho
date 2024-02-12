import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { setDeviceId } from "~/src/lib/server/device";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return;
  }

  const response = NextResponse.next();
  setDeviceId(response.cookies);
  return response;
}
