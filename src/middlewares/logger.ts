import log from "npmlog";

import { Context, Next } from "~/src/types";

/**
 * Log requests.
 */
export function getLoggerHandler() {
  return async ({ request, response, url }: Context, next: Next) => {
    performance.mark("request");

    await next();

    const { duration } = performance.measure("request", "request");

    log.info(
      "request",
      `${String(request.method)} ${String(url.inputs[0])} ${
        response.statusCode
      } ${duration.toFixed(0)}ms`
    );
  };
}
