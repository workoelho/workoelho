import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withErrorHandled(handler: Handler) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json(err, { status: 422 });
      }
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return new NextResponse(null, { status: 409 });
      }
      throw err;
    }
  };
}
