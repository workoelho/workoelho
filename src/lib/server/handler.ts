import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StructError } from "superstruct";

import { ValidationError } from "~/src/lib/server/ValidationError";

type Handler = (request: Request) => Promise<Response>;

export function withErrorHandled(handler: Handler) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (err) {
      if (err instanceof ValidationError) {
        return Response.json(err, { status: 422 });
      }
      if (err instanceof StructError) {
        return Response.json(err, { status: 422 });
      }
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return new Response(null, { status: 409 });
        } else if (err.code === "P2025") {
          return new Response(null, { status: 404 });
        }
      }

      throw err;
    }
  };
}
