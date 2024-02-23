import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getDeviceId, setDeviceId } from "~/src/lib/server/deviceId";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!getDeviceId(request.cookies)) {
    setDeviceId(response.cookies);
  }
  return response;
}
