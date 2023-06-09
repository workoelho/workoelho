import log from "npmlog";

import { HttpError } from "~/src/shared";
import { Handler } from "~/src/types";

/**
 * ...
 */
export function getErrorHandler(routes: Map<number, Handler>): Handler {
  return async (context, next) => {
    try {
      return await next();
    } catch (error) {
      const statusCode = HttpError.getStatusCode(error);
      context.response.statusCode = statusCode ?? 500;

      if (!statusCode) {
        log.error("router", "Error handled", error);
      }
    }

    const handler = routes.get(context.response.statusCode);

    if (handler) {
      return await handler(context, next);
    }

    context.response.end();
  };
}
