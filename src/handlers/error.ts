import type { Handler } from "~/src/shared/handler";
import { HttpError } from "~/src/shared/error";
import { print } from "~/src/shared/log";

/**
 * Handle uncaught errors.
 */
export function getErrorHandler(routes: Map<number, Handler>): Handler {
  return async (context, next) => {
    try {
      return await next();
    } catch (error) {
      const statusCode = HttpError.getStatusCode(error);
      context.response.statusCode = statusCode ?? 500;

      if (statusCode) {
        print("log", "Expected error", error);
      } else {
        print("log", "Unexpected error", error);
      }
    }

    const handler = routes.get(context.response.statusCode);

    if (handler) {
      return await handler(context, next);
    }

    print(
      "error",
      "No handler for status code",
      context.response.statusCode
    );

    context.response.end();
  };
}
