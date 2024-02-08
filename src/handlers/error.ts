import log from "npmlog";

import { HttpError } from "~/src/shared/error";
import { Handler } from "~/src/shared/handler";

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
        log.verbose("http", "Expected error", error);
      } else {
        log.error("http", "Unexpected error", error);
      }
    }

    const handler = routes.get(context.response.statusCode);

    if (handler) {
      return await handler(context, next);
    } else {
      log.warn(
        "http",
        "No handler for status code",
        context.response.statusCode
      );
    }

    context.response.end();
  };
}
